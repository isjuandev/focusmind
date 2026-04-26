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

/** Incrementa un counter y devuelve el nuevo valor */
export async function increment(key: string): Promise<number> {
  return kv.incr(key);
}

/** Lee un número guardado como string, default 0 */
export async function getCount(key: string): Promise<number> {
  const val = await kv.get<number>(key);
  return val ?? 0;
}

/** Añade un email al listado (evita duplicados a nivel de kv) */
export async function addEmail(email: string): Promise<{ ok: boolean; duplicate: boolean }> {
  // Usamos un SET de Redis para deduplicar
  const added = await kv.sadd("fm:email_set", email);
  if (!added) return { ok: false, duplicate: true };

  const entry = { email, ts: new Date().toISOString() };
  await kv.lpush(KEYS.emails, JSON.stringify(entry));
  await increment(KEYS.registrations);
  return { ok: true, duplicate: false };
}

/** Devuelve todos los emails registrados (más reciente primero) */
export async function getEmails(): Promise<Array<{ email: string; ts: string }>> {
  const raw = await kv.lrange<string>(KEYS.emails, 0, -1);
  return raw.map((r) => {
    try { return JSON.parse(r as string); } catch { return null; }
  }).filter(Boolean);
}
