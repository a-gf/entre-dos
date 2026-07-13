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

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.REPORT_FROM_EMAIL;
    if (resendKey && fromEmail) {
      const sent = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromEmail, to: [email], subject: `Tu informe Entre Dos: ${profileNames[resultProfile]}`, html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#34272d"><h1 style="font-family:Georgia,serif;color:#432235">${profileNames[resultProfile]}</h1><p>Gracias por regalarse una pausa para observar cómo están conversando.</p><p>Tu informe completo, con señales y ejercicios, permanece disponible en la página donde realizaste el diagnóstico.</p><p style="padding:18px;background:#f8f2e9;border-radius:12px">Este resultado es educativo y orientativo. No constituye un diagnóstico ni reemplaza terapia psicológica.</p><p>— Entre Dos</p></div>` }),
      });
      if (!sent.ok) throw new Error("No se pudo enviar el correo");
    }

    return NextResponse.json({ ok: true, emailConfigured: Boolean(resendKey && fromEmail) });
  } catch {
    return NextResponse.json({ error: "No fue posible procesar la solicitud" }, { status: 500 });
  }
}
