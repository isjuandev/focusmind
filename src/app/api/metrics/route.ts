import { NextRequest, NextResponse } from "next/server";
import { getCount, getEmails, KEYS } from "@/lib/kv";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  // Protección simple con token — configura METRICS_SECRET en Vercel env vars
  const secret = process.env.METRICS_SECRET;
  if (secret) {
    const token = req.nextUrl.searchParams.get("token");
    if (token !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const [visits, appClicks, registrations, emails] = await Promise.all([
      getCount(KEYS.visits),
      getCount(KEYS.appClicks),
      getCount(KEYS.registrations),
      getEmails(),
    ]);

    const conversionRate =
      visits > 0 ? parseFloat(((registrations / visits) * 100).toFixed(2)) : 0;
    const ctr =
      visits > 0 ? parseFloat(((appClicks / visits) * 100).toFixed(2)) : 0;

    return NextResponse.json({
      visits,
      appClicks,
      registrations,
      conversionRate,
      ctr,
      emails,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[metrics]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
