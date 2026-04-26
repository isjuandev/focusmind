/**
 * Wrapper sobre @vercel/kv con fallback en memoria para desarrollo local.
 * En producción (Vercel) se usan automáticamente las variables KV_REST_API_URL
 * y KV_REST_API_TOKEN que Vercel inyecta al conectar Vercel KV al proyecto.
 */

import { kv } from "@vercel/kv";

// Keys del experimento
export const KEYS = {
  visits: "fm:visits",
  appClicks: "fm:app_clicks",
  registrations: "fm:registrations",
  emails: "fm:emails",            // JSON array of {email, ts}
} as const;

export type Occupation = "Estudiante" | "Empleado" | "No aplica";

export interface RegistrationEntry {
  name: string;
  lastName: string;
  occupation: Occupation;
  email: string;
  ts: string;
}

export const hasVercelKV =
  Boolean(process.env.KV_REST_API_URL) &&
  Boolean(process.env.KV_REST_API_TOKEN);

const memCounts = new Map<string, number>();
const memEmails = new Set<string>();
const memEmailEntries: RegistrationEntry[] = [];

let warnedMissingKV = false;

function warnMissingKVOnce() {
  if (warnedMissingKV || hasVercelKV) return;
  warnedMissingKV = true;
  console.warn(
    "[kv] Missing KV_REST_API_URL/KV_REST_API_TOKEN. Using in-memory fallback."
  );
}

/** Incrementa un counter y devuelve el nuevo valor */
export async function increment(key: string): Promise<number> {
  if (!hasVercelKV) {
    warnMissingKVOnce();
    const nextValue = (memCounts.get(key) ?? 0) + 1;
    memCounts.set(key, nextValue);
    return nextValue;
  }
  return kv.incr(key);
}

/** Lee un número guardado como string, default 0 */
export async function getCount(key: string): Promise<number> {
  if (!hasVercelKV) {
    return memCounts.get(key) ?? 0;
  }
  const val = await kv.get<number>(key);
  return val ?? 0;
}

/** Añade un email al listado (evita duplicados a nivel de kv) */
export async function addEmail(
  payload: Omit<RegistrationEntry, "ts">
): Promise<{ ok: boolean; duplicate: boolean }> {
  const { email, name, lastName, occupation } = payload;

  if (!hasVercelKV) {
    warnMissingKVOnce();
    if (memEmails.has(email)) return { ok: false, duplicate: true };
    memEmails.add(email);
    memEmailEntries.unshift({
      email,
      name,
      lastName,
      occupation,
      ts: new Date().toISOString(),
    });
    await increment(KEYS.registrations);
    return { ok: true, duplicate: false };
  }

  // Usamos un SET de Redis para deduplicar
  const added = await kv.sadd("fm:email_set", email);
  if (!added) return { ok: false, duplicate: true };

  const entry: RegistrationEntry = {
    email,
    name,
    lastName,
    occupation,
    ts: new Date().toISOString(),
  };
  await kv.lpush(KEYS.emails, JSON.stringify(entry));
  await increment(KEYS.registrations);
  return { ok: true, duplicate: false };
}

/** Devuelve todos los emails registrados (más reciente primero) */
export async function getEmails(): Promise<RegistrationEntry[]> {
  if (!hasVercelKV) {
    return memEmailEntries;
  }

  const raw = await kv.lrange<string>(KEYS.emails, 0, -1);
  return raw.map((r) => {
    try { return JSON.parse(r as string); } catch { return null; }
  }).filter(Boolean) as RegistrationEntry[];
}
