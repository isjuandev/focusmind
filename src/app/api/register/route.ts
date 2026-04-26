import { NextRequest, NextResponse } from "next/server";
import { addEmail, hasVercelKV, Occupation } from "@/lib/kv";
import {
  addFallbackRegistration,
  readFallbackState,
  writeFallbackState,
} from "@/lib/fallbackState";

export const runtime = "nodejs";
const VALID_OCCUPATIONS: Occupation[] = ["Estudiante", "Empleado", "No aplica"];

// Validación básica de email
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body?.name as string)?.trim();
    const lastName = (body?.lastName as string)?.trim();
    const occupation = (body?.occupation as string)?.trim() as Occupation;
    const email = (body?.email as string)?.trim().toLowerCase();

    if (!name || !lastName) {
      return NextResponse.json({ error: "Nombre y apellido son obligatorios." }, { status: 400 });
    }

    if (!VALID_OCCUPATIONS.includes(occupation)) {
      return NextResponse.json({ error: "Selecciona una ocupación válida." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Correo inválido." }, { status: 400 });
    }

    if (!hasVercelKV) {
      const state = readFallbackState(req);
      const result = addFallbackRegistration(state, {
        name,
        lastName,
        occupation,
        email,
      });

      if (result.duplicate) {
        return NextResponse.json(
          { error: "Este correo ya está registrado." },
          { status: 409 }
        );
      }

      const res = NextResponse.json({ ok: true, storage: "cookie" });
      writeFallbackState(res, result.state);
      return res;
    }

    const result = await addEmail({ name, lastName, occupation, email });

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
