import { z } from "zod";

const INTERACTION_TYPES = [
  "call",
  "message",
  "whatsapp",
  "email",
  "meeting",
  "coffee",
  "event",
  "other",
] as const;

export const interactionSchema = z.object({
  contact_id: z.string().uuid("contact_id inválido"),
  type: z.enum(INTERACTION_TYPES),
  note: z.string().max(2000).optional().or(z.literal("")).transform((v) => v || null),
  occurred_at: z.string().datetime({ offset: true }).optional(),
  carnegie_principles: z.array(z.string().max(100)).max(10).optional().default([]),
});

export type InteractionFormValues = {
  contact_id: string;
  type: (typeof INTERACTION_TYPES)[number];
  note?: string;
  occurred_at?: string;
  carnegie_principles?: string[];
};

export type InteractionType = (typeof INTERACTION_TYPES)[number];
