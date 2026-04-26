import { NextRequest, NextResponse } from "next/server";
import { addEmail } from "@/lib/kv";

export const runtime = "edge";

// Validación básica de email
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body?.email as string)?.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Correo inválido." }, { status: 400 });
    }

    const result = await addEmail(email);

    if (result.duplicate) {
      return NextResponse.json(
        { error: "Este correo ya está registrado." },
        { status: 409 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[register]", e);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
