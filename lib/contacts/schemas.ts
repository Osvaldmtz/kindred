import { z } from "zod";

const RELATIONSHIP_TYPES = [
  "family",
  "friend",
  "client",
  "prospect",
  "rotary",
  "colleague",
  "mentor",
  "other",
] as const;

export type RelationshipTypeEnum = (typeof RELATIONSHIP_TYPES)[number];

/**
 * Form-side schema: validates format but keeps strings as-is.
 * Used with react-hook-form + zodResolver. No null transforms, no .default().
 * Defaults are provided via useForm's defaultValues.
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z
    .string()
    .max(255)
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Ingresa un email válido",
    })
    .optional(),
  phone: z.string().max(30, "Teléfono muy largo").optional(),
  relationship_type: z.enum(RELATIONSHIP_TYPES),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  birthday: z.string().optional(),
  photo_url: z
    .string()
    .refine((v) => !v || v.startsWith("http"), {
      message: "URL de foto inválida",
    })
    .optional(),
  target_frequency_days: z.number().int().min(1).max(365),
  notes: z.string().max(2000, "Notas muy largas (máx. 2000 caracteres)").optional(),
  interests: z.array(z.string().max(50)).max(20),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Server-side schema: full validation + transforms to nullable for DB insert.
 */
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
  phone: z
    .string()
    .max(30)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
  relationship_type: z.enum(RELATIONSHIP_TYPES),
  company: z
    .string()
    .max(100)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
  role: z
    .string()
    .max(100)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
  birthday: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
  photo_url: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
  target_frequency_days: z
    .number()
    .int()
    .min(1, "Mínimo 1 día")
    .max(365, "Máximo 365 días")
    .default(30),
  notes: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
  interests: z.array(z.string().max(50)).max(20).default([]),
});

export type ContactServerParsed = z.output<typeof contactSchema>;

export const contactUpdateSchema = contactSchema.partial().extend({
  name: z.string().min(2).max(100),
});
