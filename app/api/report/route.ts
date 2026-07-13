import { NextResponse } from "next/server";

const profileNames: Record<string, string> = {
  connection: "Conexión consciente",
  avoidance: "Conversaciones postergadas",
  defensive: "Comunicación defensiva",
  distance: "Distancia emocional",
};

export async function POST(request: Request) {
  try {
    const { email, resultProfile, consentToContact } = await request.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email) || !profileNames[resultProfile]) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const saved = await fetch(`${supabaseUrl}/rest/v1/relationship_assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Prefer: "return=minimal" },
        body: JSON.stringify({ email, result_profile: resultProfile, consent_to_contact: Boolean(consentToContact) }),
      });
      if (!saved.ok) throw new Error("No se pudo guardar el resultado");
    }

    if (!supabaseUrl || !supabaseKey) throw new Error("Supabase no está configurado");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No fue posible procesar la solicitud" }, { status: 500 });
  }
}
