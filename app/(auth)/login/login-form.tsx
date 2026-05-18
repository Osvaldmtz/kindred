"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";
import { Loader2, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, isPending] = useActionState(sendMagicLink, initialState);

  useEffect(() => {
    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  if (state.status === "sent") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#fbf2ed] flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">
            Revisa tu correo
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Enviamos un enlace mágico a{" "}
            <span className="font-medium text-foreground">{state.email}</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          El enlace expira en 1 hora. Revisa también tu carpeta de spam.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary underline underline-offset-4 mt-2"
        >
          Usar otro correo
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            strokeWidth={1.5}
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="tu@correo.com"
            className="w-full h-14 pl-11 pr-4 rounded-xl bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-14 w-full rounded-2xl bg-primary text-white font-semibold text-[16px] flex items-center justify-center gap-2 transition-all hover:bg-[#802a0d] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
            Enviando…
          </>
        ) : (
          <>
            Enviar enlace mágico
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
          </>
        )}
      </button>
    </form>
  );
}
