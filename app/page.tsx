"use client";

import { useMemo, useState } from "react";

type ProfileKey = "connection" | "avoidance" | "defensive" | "distance";

const options: { label: string; value: ProfileKey }[] = [
  { label: "Casi siempre", value: "connection" },
  { label: "A veces", value: "avoidance" },
  { label: "Pocas veces", value: "defensive" },
  { label: "Casi nunca", value: "distance" },
];

const questions = [
  "Podemos hablar de lo que sentimos sin miedo a ser juzgados.",
  "Cuando hay un desacuerdo, intentamos entendernos antes de responder.",
  "Podemos pedir lo que necesitamos de forma clara.",
  "Los temas difíciles se conversan, aunque necesitemos una pausa.",
  "Sentimos que nuestra opinión importa dentro de la relación.",
  "Podemos reconocer un error sin convertirlo en una competencia.",
  "Después de una discusión, buscamos reparar la conexión.",
  "Tenemos momentos para hablar sin pantallas ni interrupciones.",
  "Podemos expresar afecto y agradecimiento con naturalidad.",
  "Sabemos detener una conversación cuando empieza a hacernos daño.",
];

const profiles: Record<ProfileKey, {
  title: string; kicker: string; summary: string; strength: string;
  signals: string[]; exercises: { title: string; text: string }[]; week: string;
}> = {
  connection: {
    title: "Conexión consciente", kicker: "Hay una base valiosa para seguir creciendo",
    summary: "En su comunicación aparecen escucha, claridad y disposición para reparar. Eso no significa ausencia de conflictos: significa que cuentan con recursos para atravesarlos sin perderse de vista.",
    strength: "La capacidad de expresar necesidades y volver a encontrarse después de una diferencia.",
    signals: ["Escuchan antes de concluir", "Pueden nombrar lo que necesitan", "Buscan soluciones compartidas"],
    exercises: [
      { title: "La pregunta nueva", text: "Una vez al día pregúntense: ¿qué fue importante para ti hoy? Escuchen sin resolver." },
      { title: "Aprecio específico", text: "Nombren una acción concreta del otro que agradecieron durante el día." },
      { title: "Revisión semanal", text: "Reserven 15 minutos para hablar de qué funcionó y qué necesitan ajustar." },
    ],
    week: "Protejan una conversación de 20 minutos, sin pantallas, solo para ponerse al día emocionalmente.",
  },
  avoidance: {
    title: "Conversaciones postergadas", kicker: "La calma protege, pero algunos temas necesitan espacio",
    summary: "Parece que suelen evitar o aplazar ciertas conversaciones para conservar la tranquilidad. Esta estrategia reduce la tensión inmediata, pero puede hacer que necesidades importantes se acumulen en silencio.",
    strength: "El deseo de cuidar el vínculo y no herirse impulsivamente durante un desacuerdo.",
    signals: ["Cambian de tema ante la incomodidad", "Dicen “no importa” cuando sí importa", "Los asuntos reaparecen sin resolverse"],
    exercises: [
      { title: "Cita con el tema", text: "Si necesitan pausar, acuerden una hora concreta para retomar la conversación." },
      { title: "Una frase segura", text: "Practiquen: “Esto me cuesta decirlo y quiero hacerlo sin atacarte”." },
      { title: "Tema pequeño primero", text: "Empiecen por una incomodidad de baja intensidad para entrenar la conversación." },
    ],
    week: "Elijan un tema pendiente pequeño y conversen durante 10 minutos usando turnos de dos minutos.",
  },
  defensive: {
    title: "Comunicación defensiva", kicker: "Detrás de la defensa suele haber una necesidad de protección",
    summary: "Cuando aparece una diferencia, la conversación puede convertirse rápidamente en explicaciones, reproches o intentos de tener la razón. No habla de falta de amor: suele indicar que ambos necesitan más seguridad al conversar.",
    strength: "Hay energía e interés en lo que ocurre en la relación; el reto es transformar intensidad en curiosidad.",
    signals: ["Responden antes de escuchar por completo", "Aparecen “siempre” y “nunca”", "El tono pesa más que el tema"],
    exercises: [
      { title: "Pausa con regreso", text: "Detengan la conversación cuando suba el tono y acuerden retomarla en 20 minutos." },
      { title: "Reflejar antes de responder", text: "Repitan con sus palabras lo que entendieron y pregunten si es correcto." },
      { title: "Del reproche a la petición", text: "Cambien “tú nunca…” por “me ayudaría que…”." },
    ],
    week: "Durante un desacuerdo, cada persona hará una sola petición concreta sin explicar quién tuvo la culpa.",
  },
  distance: {
    title: "Distancia emocional", kicker: "Reconectar empieza con intercambios pequeños y seguros",
    summary: "Puede estar costando expresar lo que sienten o percibir que la otra persona está disponible para escuchar. La distancia no define el futuro del vínculo, pero sí invita a recuperar contacto sin exigir grandes conversaciones de inmediato.",
    strength: "Completar este diagnóstico ya muestra interés por observar la relación y abrir una posibilidad de cambio.",
    signals: ["Las conversaciones son principalmente prácticas", "Cuesta pedir apoyo emocional", "Hay sensación de no ser visto o escuchado"],
    exercises: [
      { title: "Dos minutos presentes", text: "Compartan cómo llegan al final del día sin interrupciones ni consejos." },
      { title: "Mapa de cercanía", text: "Cada uno escriba qué gesto pequeño le hace sentir acompañado." },
      { title: "Invitación, no exigencia", text: "Prueben: “¿Tienes energía para escucharme cinco minutos?”." },
    ],
    week: "Elijan un ritual breve de conexión —un café, una caminata o una despedida consciente— y repítanlo tres veces.",
  },
};

function scoreResult(answers: ProfileKey[]): ProfileKey {
  const points = answers.reduce((sum, answer) => sum + ({ connection: 3, avoidance: 2, defensive: 1, distance: 0 }[answer]), 0);
  if (points >= 24) return "connection";
  if (points >= 17) return "avoidance";
  if (points >= 9) return "defensive";
  return "distance";
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ProfileKey[]>([]);
  const [resultKey, setResultKey] = useState<ProfileKey | null>(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const result = resultKey ? profiles[resultKey] : null;
  const percent = useMemo(() => Math.round((step / questions.length) * 100), [step]);

  function begin() {
    setStarted(true); setResultKey(null); setStep(0); setAnswers([]);
    setTimeout(() => document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function answer(value: ProfileKey) {
    const next = [...answers, value];
    setAnswers(next);
    if (step === questions.length - 1) {
      setResultKey(scoreResult(next));
      setStarted(false);
      setTimeout(() => document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth" }), 50);
    } else setStep(step + 1);
  }

  async function sendReport(e: React.FormEvent) {
    e.preventDefault();
    if (!resultKey || !email) return;
    setSendState("loading");
    try {
      const response = await fetch("/api/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, resultProfile: resultKey, consentToContact: consent }) });
      if (!response.ok) throw new Error();
      setSendState("success");
    } catch { setSendState("error"); }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio">Entre Dos</a>
        <nav aria-label="Navegación principal"><a href="#como-funciona">Cómo funciona</a><a href="#privacidad">Privacidad</a><button onClick={begin}>Comenzar</button></nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Una pausa para escucharse</p>
          <h1>¿Cómo están conversando realmente?</h1>
          <p className="lead">Descubre el patrón de comunicación que predomina en tu relación y recibe recomendaciones prácticas para los próximos 7 días.</p>
          <button className="primary" onClick={begin}>Empezar diagnóstico <span>→</span></button>
          <p className="meta">Gratis <b>·</b> 5 minutos <b>·</b> Respuestas privadas</p>
        </div>
        <div className="preview-card" aria-hidden="true">
          <div className="preview-top"><span>Pregunta 3 de 10</span><span>30%</span></div><div className="progress"><i /></div>
          <h2>Cuando hay un desacuerdo, ¿qué suele pasar?</h2>
          {["Intentamos escucharnos", "Evitamos el tema", "Terminamos defendiéndonos", "Nos desconectamos"].map((x, i) => <div className={`fake-option ${i === 0 ? "selected" : ""}`} key={x}><i />{x}{i === 0 && <b>✓</b>}</div>)}
          <p className="preview-note">▤ <span>Tu informe aparece al finalizar</span></p>
        </div>
        <div className="bubble bubble-one"/><div className="bubble bubble-two"/>
      </section>

      <section className="trust"><p>◎ <span><b>Sin juicios</b><small>No hay respuestas buenas o malas</small></span></p><p>↯ <span><b>Resultado inmediato</b><small>El informe aparece en pantalla</small></span></p><p>◇ <span><b>Privacidad primero</b><small>No guardamos tus respuestas</small></span></p></section>

      {started && <section className="quiz-section" id="diagnostico">
        <div className="quiz-card">
          <div className="quiz-head"><button className="back" disabled={step === 0} onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}>← Anterior</button><span>{step + 1} de {questions.length}</span></div>
          <div className="progress"><i style={{ width: `${percent + 10}%` }} /></div>
          <p className="eyebrow">Piensa en cómo suelen comunicarse</p><h2>{questions[step]}</h2>
          <div className="answer-grid">{options.map(option => <button key={option.label} onClick={() => answer(option.value)}><i />{option.label}<span>→</span></button>)}</div>
          <p className="microcopy">Responde según lo que ocurre la mayoría de las veces, no según un día excepcional.</p>
        </div>
      </section>}

      {result && <section className="result-section" id="resultado">
        <div className="result-heading"><p className="eyebrow">Tu perfil orientativo</p><h2>{result.title}</h2><p className="result-kicker">{result.kicker}</p><p>{result.summary}</p></div>
        <div className="report-grid">
          <article className="strength"><span>Lo que ya tienen a favor</span><h3>{result.strength}</h3></article>
          <article><span>Señales para observar</span><ul>{result.signals.map(x => <li key={x}>{x}</li>)}</ul></article>
        </div>
        <div className="exercises"><p className="eyebrow">Tres ejercicios para empezar</p><div>{result.exercises.map((x, i) => <article key={x.title}><b>0{i + 1}</b><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></div>
        <div className="week"><span>Tu recomendación para los próximos 7 días</span><p>{result.week}</p></div>
        <div className="email-card">
          <div><p className="eyebrow">Guarda este momento</p><h2>Recibe una copia del informe</h2><p>Te enviaremos este resultado y los ejercicios. El informe completo ya es tuyo; dejar el correo es opcional.</p></div>
          {sendState === "success" ? <div className="success"><b>✓ Informe solicitado</b><p>Revisa tu bandeja de entrada. También puedes conservar esta página.</p></div> : <form onSubmit={sendReport}><label htmlFor="email">Tu correo</label><div className="input-row"><input id="email" type="email" required placeholder="nombre@correo.com" value={email} onChange={e => setEmail(e.target.value)} /><button disabled={sendState === "loading"}>{sendState === "loading" ? "Enviando…" : "Enviar informe"}</button></div><label className="check"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /> Quiero recibir información sobre recursos y consultas. Es opcional.</label>{sendState === "error" && <p className="error">No pudimos enviarlo ahora. Tu resultado sigue disponible en esta página.</p>}</form>}
        </div>
        <button className="restart" onClick={begin}>Volver a realizar el diagnóstico</button>
      </section>}

      <section className="how" id="como-funciona"><p className="eyebrow">Cómo funciona</p><h2>Un espacio breve para mirar la conversación con otros ojos.</h2><div><article><b>01</b><h3>Responde con honestidad</h3><p>Diez preguntas sobre situaciones cotidianas. No pedimos nombres ni detalles íntimos.</p></article><article><b>02</b><h3>Conoce el patrón</h3><p>El resultado se calcula en tu navegador y aparece inmediatamente.</p></article><article><b>03</b><h3>Prueba algo pequeño</h3><p>Recibe ejercicios y una acción concreta para los próximos siete días.</p></article></div></section>
      <section className="privacy" id="privacidad"><div><p className="eyebrow">Privacidad y cuidado</p><h2>La relación es de ustedes. Las respuestas también.</h2></div><div><p>No almacenamos las respuestas individuales del cuestionario. Si solicitas el informe por correo, guardamos únicamente el correo, el perfil obtenido, el consentimiento y la fecha.</p><p>Esta herramienta es educativa y orientativa. No diagnostica ni reemplaza terapia psicológica. Si hay violencia, amenazas o riesgo inmediato, busca apoyo profesional o comunícate con los servicios de emergencia de tu país.</p></div></section>
      <footer><a className="brand" href="#inicio">Entre Dos</a><p>Una invitación a conversar, no una etiqueta.</p><small>© 2026 Entre Dos · Herramienta educativa</small></footer>
    </main>
  );
}
