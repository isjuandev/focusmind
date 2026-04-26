import { NextRequest, NextResponse } from "next/server";
import { increment, KEYS } from "@/lib/kv";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body?.event as string;

    if (event === "visit") {
      await increment(KEYS.visits);
    } else if (event === "app_click") {
      await increment(KEYS.appClicks);
    } else {
      return NextResponse.json({ error: "Unknown event" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[track]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
