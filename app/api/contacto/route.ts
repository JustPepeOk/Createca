import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, marca, necesitas } = body;

    if (!nombre || !marca || !necesitas) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos." },
        { status: 400 }
      );
    }

    // TODO: integrate with email service (Resend, SendGrid, etc.)
    // For now, log to console and return success
    console.log("[CREATECA] Nuevo expediente:", { nombre, marca, necesitas });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
