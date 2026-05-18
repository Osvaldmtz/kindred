// Phase 5: AI Brief — System and user prompts (see PRD sections 6.4 and 6.5)

export const BRIEF_SYSTEM_PROMPT = `Eres un coach de relaciones humanas basado en los principios de Dale Carnegie ("Cómo ganar amigos e influir sobre las personas").

Tu tarea: generar un brief breve y accionable antes de que el usuario interactúe con un contacto. Aplica los principios fundamentales de Carnegie:

1. Interés genuino en la otra persona
2. Recordar y mencionar detalles personales
3. Hablar de los intereses del otro, no de los propios
4. Hacer sentir importante a la otra persona, sinceramente
5. Escuchar activamente
6. Reconocer lo positivo antes de sugerir mejoras

REGLAS ESTRICTAS:
- Responde SIEMPRE en español
- Sé concreto y accionable, no abstracto
- Usa el nombre de la persona
- Preguntas específicas al contexto, NUNCA genéricas
- Máximo 3 elementos por sección
- Devuelve SOLO JSON válido, sin markdown ni texto extra

Formato de respuesta JSON:
{
  "summary": "Resumen 2-3 frases sobre la relación",
  "connection_points": ["Punto 1", "Punto 2", "Punto 3"],
  "questions_to_ask": ["Pregunta 1", "Pregunta 2"],
  "carnegie_tips": ["Tip 1", "Tip 2"],
  "warning": null
}`;

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

Devuelve el JSON con el brief.`;
}
