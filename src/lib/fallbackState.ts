import { NextRequest, NextResponse } from "next/server";
import { Occupation, RegistrationEntry } from "@/lib/kv";

export interface FallbackMetricsState {
  visits: number;
  appClicks: number;
  registrations: number;
  emails: RegistrationEntry[];
}

const COOKIE_NAME = "fm_metrics";

const EMPTY_STATE: FallbackMetricsState = {
  visits: 0,
  appClicks: 0,
  registrations: 0,
  emails: [],
};

export function readFallbackState(req: NextRequest): FallbackMetricsState {
  const raw = req.cookies.get(COOKIE_NAME)?.value;
  if (!raw) return { ...EMPTY_STATE };
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as FallbackMetricsState;
    return {
      visits: parsed.visits ?? 0,
      appClicks: parsed.appClicks ?? 0,
      registrations: parsed.registrations ?? 0,
      emails: Array.isArray(parsed.emails) ? parsed.emails : [],
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

export function writeFallbackState(
  res: NextResponse,
  state: FallbackMetricsState
) {
  res.cookies.set(COOKIE_NAME, encodeURIComponent(JSON.stringify(state)), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function addFallbackRegistration(
  state: FallbackMetricsState,
  payload: Omit<RegistrationEntry, "ts">
): { ok: boolean; duplicate: boolean; state: FallbackMetricsState } {
  const email = payload.email.trim().toLowerCase();
  const exists = state.emails.some((entry) => entry.email === email);
  if (exists) {
    return { ok: false, duplicate: true, state };
  }

  const next: FallbackMetricsState = {
    ...state,
    registrations: state.registrations + 1,
    emails: [
      { ...payload, email, ts: new Date().toISOString(), occupation: payload.occupation as Occupation },
      ...state.emails,
    ],
  };

  return { ok: true, duplicate: false, state: next };
}
