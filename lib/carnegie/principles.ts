/**
 * Principios de Dale Carnegie
 * "Cómo ganar amigos e influir sobre las personas" (1936)
 *
 * Este archivo va en: lib/carnegie/principles.ts
 *
 * Uso:
 * - La IA usa este catálogo como referencia conceptual
 * - El usuario puede tagear interacciones con principios aplicados
 * - Las cards de "Tip Carnegie" en briefs se generan a partir de estos
 */

export type CarneguePrincipleCategory =
  | "handling_people"
  | "making_friends"
  | "winning_over"
  | "leadership";

export type CarneguePrinciple = {
  id: string;
  category: CarneguePrincipleCategory;
  title: string;
  description: string;
  example: string;
};

export const PRINCIPLES: CarneguePrinciple[] = [
  // ═══════════════════════════════════════════════
  // PARTE 1: Técnicas fundamentales para tratar con la gente
  // ═══════════════════════════════════════════════

  {
    id: "no-criticism",
    category: "handling_people",
    title: "No critiques, no condenes ni te quejes",
    description:
      "La crítica es inútil porque pone a la otra persona a la defensiva.",
    example:
      "En vez de decir 'lo hiciste mal', pregunta '¿qué aprendiste de esto?'",
  },
  {
    id: "sincere-appreciation",
    category: "handling_people",
    title: "Demuestra aprecio honrado y sincero",
    description:
      "El deseo de ser importante es el impulso humano más profundo.",
    example:
      "Reconoce algo específico que la persona haya hecho bien recientemente.",
  },
  {
    id: "arouse-eager-want",
    category: "handling_people",
    title: "Despierta en los demás un deseo vehemente",
    description:
      "Habla siempre de lo que la otra persona quiere y muéstrale cómo conseguirlo.",
    example:
      "En vez de 'necesito que firmes esto', di 'esto te ahorrará 3 horas a la semana'.",
  },

  // ═══════════════════════════════════════════════
  // PARTE 2: Seis maneras de agradar a los demás
  // ═══════════════════════════════════════════════

  {
    id: "genuine-interest",
    category: "making_friends",
    title: "Interésate sinceramente por los demás",
    description:
      "Se hacen más amigos en dos meses interesándose por otros que en dos años tratando de que otros se interesen por uno.",
    example:
      "Pregunta por su familia, su proyecto, su pasión — y escucha de verdad.",
  },
  {
    id: "smile",
    category: "making_friends",
    title: "Sonríe",
    description:
      "Las acciones dicen más que las palabras, y una sonrisa dice 'me gusta usted'.",
    example: "En reuniones por video, sonríe al saludar — se nota.",
  },
  {
    id: "remember-name",
    category: "making_friends",
    title: "Recuerda que el nombre de una persona es el sonido más dulce",
    description:
      "Para esa persona, su nombre es la palabra más importante en cualquier idioma.",
    example: "Usa el nombre de la persona 2-3 veces durante la conversación, naturalmente.",
  },
  {
    id: "be-good-listener",
    category: "making_friends",
    title: "Sé un buen oyente. Anima a los demás a hablar de sí mismos",
    description:
      "Escuchar con atención es uno de los cumplidos más altos.",
    example:
      "Hace preguntas de seguimiento sin interrumpir, sin desviar a tu propia historia.",
  },
  {
    id: "talk-their-interests",
    category: "making_friends",
    title: "Habla siempre de lo que interesa a los demás",
    description:
      "El camino real al corazón de una persona pasa por sus intereses.",
    example:
      "Si le gusta el ajedrez, pregúntale sobre la última partida que jugó.",
  },
  {
    id: "make-them-important",
    category: "making_friends",
    title: "Haz que la otra persona se sienta importante — y hazlo sinceramente",
    description:
      "La regla de oro: trata a los demás como te gustaría ser tratado.",
    example: "Pídele consejo en algo donde realmente sea experto.",
  },

  // ═══════════════════════════════════════════════
  // PARTE 3: Logre que los demás piensen como usted
  // ═══════════════════════════════════════════════

  {
    id: "avoid-arguments",
    category: "winning_over",
    title: "La única forma de ganar una discusión es evitándola",
    description: "Nadie cambia de opinión por ser derrotado en debate.",
    example:
      "En vez de discutir, di 'déjame pensarlo, hay puntos interesantes'.",
  },
  {
    id: "respect-opinions",
    category: "winning_over",
    title: "Respeta las opiniones ajenas. Jamás digas 'está usted equivocado'",
    description:
      "Decirle a alguien que está equivocado es atacar su inteligencia.",
    example:
      "Di 'puede que esté equivocado, frecuentemente lo estoy. Examinemos los hechos'.",
  },
  {
    id: "admit-wrong",
    category: "winning_over",
    title: "Si está equivocado, admítalo rápida y enfáticamente",
    description:
      "Cualquier tonto puede defender sus errores. Admitirlos es noble.",
    example: "Anticípate a la crítica con autocrítica honesta.",
  },
  {
    id: "friendly-start",
    category: "winning_over",
    title: "Empiece de forma amigable",
    description:
      "Una gota de miel atrae más moscas que un galón de hiel.",
    example: "Antes de pedir algo, reconoce algo positivo del otro lado.",
  },
  {
    id: "yes-yes-method",
    category: "winning_over",
    title: "Consiga que la otra persona diga 'sí, sí' desde el principio",
    description:
      "Empezar con puntos de acuerdo facilita el 'sí' final.",
    example:
      "Empieza con tres preguntas donde sabes que la respuesta es sí.",
  },
  {
    id: "let-them-talk",
    category: "winning_over",
    title: "Permita que la otra persona sea quien hable más",
    description:
      "Tus amigos prefieren contarte sus logros que escuchar los tuyos.",
    example: "Haz preguntas abiertas y deja largos silencios.",
  },
  {
    id: "let-it-be-their-idea",
    category: "winning_over",
    title: "Permita que la otra persona sienta que la idea es suya",
    description:
      "La gente confía más en ideas que descubre ella misma.",
    example:
      "Sugiere con preguntas: '¿qué pasaría si...?', '¿has considerado...?'",
  },
  {
    id: "see-their-view",
    category: "winning_over",
    title:
      "Trate honradamente de ver las cosas desde el punto de vista del otro",
    description:
      "Hay una razón por la que el otro piensa y actúa como lo hace.",
    example:
      "Antes de la reunión, pregúntate: ¿qué presiones tiene esta persona?",
  },

  // ═══════════════════════════════════════════════
  // PARTE 4: Sea un líder
  // ═══════════════════════════════════════════════

  {
    id: "praise-first",
    category: "leadership",
    title: "Empiece con elogio y aprecio sincero",
    description:
      "Es más fácil escuchar cosas desagradables tras un cumplido sincero.",
    example:
      "Antes del feedback duro, reconoce dos cosas que sí hizo bien.",
  },
  {
    id: "indirect-attention",
    category: "leadership",
    title: "Llame la atención sobre los errores indirectamente",
    description:
      "Reemplaza 'pero' por 'y' para que el elogio no se invalide.",
    example:
      "En vez de 'buen trabajo, pero...', di 'buen trabajo, y para la próxima...'.",
  },
  {
    id: "admit-own-mistakes",
    category: "leadership",
    title: "Hable de sus propios errores antes de criticar los del otro",
    description:
      "La autocrítica honesta abre el espacio a la crítica recíproca.",
    example:
      "Cuenta una historia donde tú cometiste el mismo error y qué aprendiste.",
  },
  {
    id: "ask-questions",
    category: "leadership",
    title: "Haga preguntas en vez de dar órdenes",
    description:
      "Las preguntas invitan a la cooperación; las órdenes generan resentimiento.",
    example: "En vez de 'haz X', di '¿qué pensarías si hiciéramos X?'.",
  },
  {
    id: "save-face",
    category: "leadership",
    title: "Permita que la otra persona salve su prestigio",
    description: "Aún cuando tengas razón, no humilles al otro.",
    example: "Si alguien comete un error público, dale salida elegante.",
  },
  {
    id: "praise-improvement",
    category: "leadership",
    title: "Elogie el más pequeño progreso y, además, cada progreso",
    description: "Sea caluroso en su aprobación y generoso en sus elogios.",
    example: "Cuando notes una mejora pequeña, díselo al instante.",
  },
  {
    id: "good-reputation",
    category: "leadership",
    title:
      "Atribuya a la otra persona una buena reputación a la cual hacer honor",
    description:
      "Si quieres que alguien mejore en algo, trátalo como si ya lo fuera.",
    example:
      "Di 'siempre te he visto como alguien muy responsable con los plazos...'",
  },
  {
    id: "easy-to-correct",
    category: "leadership",
    title:
      "Aliente a la otra persona. Haga que los errores parezcan fáciles de corregir",
    description:
      "Si una tarea parece imposible, nadie la intentará.",
    example: "Divide la mejora en pasos pequeños y celebra cada uno.",
  },
  {
    id: "make-happy",
    category: "leadership",
    title:
      "Procure que la otra persona se sienta satisfecha de hacer lo que usted sugiere",
    description:
      "La gente cumple con entusiasmo lo que cree que beneficia a sí misma.",
    example:
      "Conecta lo que pides con un beneficio real para la otra persona.",
  },
];

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════

export function getPrinciplesByCategory(
  category: CarneguePrincipleCategory
): CarneguePrinciple[] {
  return PRINCIPLES.filter((p) => p.category === category);
}

export function getPrincipleById(id: string): CarneguePrinciple | undefined {
  return PRINCIPLES.find((p) => p.id === id);
}

export const CATEGORY_LABELS: Record<CarneguePrincipleCategory, string> = {
  handling_people: "Tratar con personas",
  making_friends: "Agradar a los demás",
  winning_over: "Persuadir",
  leadership: "Liderar",
};

export function getCategoryLabel(category: CarneguePrincipleCategory): string {
  return CATEGORY_LABELS[category];
}
