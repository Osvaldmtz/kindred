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
    return { status: "error", message: "No pudimos enviar el enlace. Intenta de nuevo." };
  }

  return { status: "sent", email };
}
