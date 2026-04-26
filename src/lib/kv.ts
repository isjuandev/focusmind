import { createClient, type RedisClientType } from "redis";

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

export const hasVercelKV = Boolean(process.env.REDIS_URL);

let redisClient: RedisClientType | null = null;

async function getRedisClient(): Promise<RedisClientType> {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not configured");
  }

  if (redisClient?.isOpen) return redisClient;

  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on("error", (err: Error) => {
    console.error("[redis]", err);
  });

  await redisClient.connect();
  return redisClient;
}

const memCounts = new Map<string, number>();
const memEmails = new Set<string>();
const memEmailEntries: RegistrationEntry[] = [];

let warnedMissingKV = false;

function warnMissingKVOnce() {
  if (warnedMissingKV || hasVercelKV) return;
  warnedMissingKV = true;
  console.warn(
    "[kv] Missing REDIS_URL. Using in-memory fallback."
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
  const redis = await getRedisClient();
  return redis.incr(key);
}

/** Lee un número guardado como string, default 0 */
export async function getCount(key: string): Promise<number> {
  if (!hasVercelKV) {
    return memCounts.get(key) ?? 0;
  }
  const redis = await getRedisClient();
  const val = await redis.get(key);
  return val ? Number(val) : 0;
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
  const redis = await getRedisClient();
  const added = await redis.sAdd("fm:email_set", email);
  if (!added) return { ok: false, duplicate: true };

  const entry: RegistrationEntry = {
    email,
    name,
    lastName,
    occupation,
    ts: new Date().toISOString(),
  };
  await redis.lPush(KEYS.emails, JSON.stringify(entry));
  await increment(KEYS.registrations);
  return { ok: true, duplicate: false };
}

/** Devuelve todos los emails registrados (más reciente primero) */
export async function getEmails(): Promise<RegistrationEntry[]> {
  if (!hasVercelKV) {
    return memEmailEntries;
  }

  const redis = await getRedisClient();
  const raw = await redis.lRange(KEYS.emails, 0, -1);
  return raw.map((r: string) => {
    try { return JSON.parse(r); } catch { return null; }
  }).filter(Boolean) as RegistrationEntry[];
}
