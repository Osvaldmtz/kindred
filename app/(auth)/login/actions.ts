"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const emailSchema = z.string().email("Ingresa un email válido");

export type LoginState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string };

export async function sendMagicLink(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const raw = formData.get("email");
  const parsed = emailSchema.safeParse(raw);

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Email inválido" };
  }

  const email = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    const isRateLimit =
      error.status === 429 ||
      error.message?.toLowerCase().includes("rate limit") ||
      error.code === "over_email_send_rate_limit";

    return {
      status: "error",
      message: isRateLimit
        ? "Demasiados intentos. Espera unos minutos antes de solicitar otro enlace."
        : "No pudimos enviar el enlace. Verifica el email e intenta de nuevo.",
    };
  }

  return { status: "sent", email };
}
