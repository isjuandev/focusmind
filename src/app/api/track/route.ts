import { NextRequest, NextResponse } from "next/server";
import { hasVercelKV, increment, KEYS } from "@/lib/kv";
import { readFallbackState, writeFallbackState } from "@/lib/fallbackState";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body?.event as string;

    if (!hasVercelKV) {
      const state = readFallbackState(req);
      if (event === "visit") {
        state.visits += 1;
      } else if (event === "app_click") {
        state.appClicks += 1;
      } else {
        return NextResponse.json({ error: "Unknown event" }, { status: 400 });
      }

      const res = NextResponse.json({ ok: true, storage: "cookie" });
      writeFallbackState(res, state);
      return res;
    }

    if (event === "visit") {
      await increment(KEYS.visits);
    } else if (event === "app_click") {
      await increment(KEYS.appClicks);
    } else {
      return NextResponse.json({ error: "Unknown event" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, storage: "redis" });
  } catch (e) {
    console.error("[track]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
