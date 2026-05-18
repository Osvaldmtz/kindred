// AI Brief — System and user prompts (PRD sections 6.4 and 6.5)

export const BRIEF_SYSTEM_PROMPT = `Eres un coach de relaciones humanas basado en los principios de Dale Carnegie.

Tu tarea: generar un brief accionable antes de una conversación con un contacto.

INSTRUCCIÓN CRÍTICA: Responde ÚNICAMENTE con un objeto JSON válido. Sin texto adicional, sin markdown, sin explicaciones. Solo el JSON.

El JSON debe tener EXACTAMENTE estas claves (en inglés, como se especifican):

{
  "summary": "2-3 frases contextuales sobre la relación y última interacción",
  "connection_points": ["Punto específico de conexión 1", "Punto 2", "Punto 3"],
  "questions_to_ask": ["¿Pregunta concreta y personal 1?", "¿Pregunta concreta 2?"],
  "carnegie_tips": ["Tip Carnegie aplicado a este contexto 1", "Tip 2"],
  "warning": null
}

Reglas para el contenido:
- SIEMPRE en español
- summary: menciona el nombre, contexto y última interacción conocida
- connection_points: temas específicos de esta persona, no genéricos
- questions_to_ask: preguntas concretas basadas en su contexto real
- carnegie_tips: principios de Carnegie aplicados a ESTA persona
- warning: null si todo bien, string breve si hay algo delicado a considerar
- Máximo 3 elementos por array`;

export type ContactContext = {
  name: string;
  relationshipType: string;
  company?: string | null;
  role?: string | null;
  birthday?: string | null;
  interests: string[];
  notes?: string | null;
  recentInteractions: Array<{
    occurredAt: string;
    type: string;
    note: string | null;
  }>;
};

export type BriefResponse = {
  summary: string;
  connection_points: string[];
  questions_to_ask: string[];
  carnegie_tips: string[];
  warning: string | null;
};

export const FALLBACK_BRIEF: BriefResponse = {
  summary:
    "El brief no pudo generarse en este momento. Aquí tienes algunas ideas generales basadas en Carnegie.",
  connection_points: [
    "Saluda por su nombre, usándolo al menos una vez",
    "Pregúntale sobre algo que te haya compartido antes",
    "Escucha más de lo que hablas",
  ],
  questions_to_ask: [
    "¿En qué has estado pensando últimamente?",
    "¿Algo importante por lo que pueda preguntarte?",
  ],
  carnegie_tips: [
    "Recuerda: el nombre de una persona es el sonido más dulce que puede escuchar.",
    "Demuestra interés genuino, no transaccional.",
  ],
  warning: null,
};

export function buildBriefUserPrompt(ctx: ContactContext): string {
  return `Genera un brief para mi próxima interacción con ${ctx.name}.

CONTEXTO:
- Nombre: ${ctx.name}
- Relación: ${ctx.relationshipType}
${ctx.company ? `- Empresa: ${ctx.company}` : ""}
${ctx.role ? `- Rol: ${ctx.role}` : ""}
${ctx.birthday ? `- Cumpleaños: ${ctx.birthday}` : ""}
- Intereses: ${ctx.interests.join(", ") || "(sin tags)"}
${ctx.notes ? `- Notas: ${ctx.notes}` : ""}

ÚLTIMAS INTERACCIONES (más reciente primero):
${
  ctx.recentInteractions.length > 0
    ? ctx.recentInteractions
        .map(
          (i, idx) =>
            `${idx + 1}. [${i.occurredAt}] ${i.type}: ${i.note ?? "(sin nota)"}`
        )
        .join("\n")
    : "(Primera interacción registrada)"
}

Responde SOLO con JSON válido usando estas claves exactas: summary, connection_points, questions_to_ask, carnegie_tips, warning.`;
}
