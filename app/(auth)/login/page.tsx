import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Iniciar sesión — Kindred",
};

export default function LoginPage() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <main className="min-h-screen bg-background flex flex-col">
        {/* Terracota header block */}
        <div className="bg-primary pt-16 pb-20 px-6 flex flex-col items-center text-center">
          <h1 className="text-[32px] font-bold text-white leading-tight tracking-[-0.02em]">
            Kindred
          </h1>
          <p className="mt-2 text-white/80 text-sm font-medium">
            Relaciones humanas con propósito
          </p>
        </div>

        {/* Curved content panel */}
        <div className="flex-1 bg-background rounded-t-[24px] -mt-6 relative z-10 px-6 pt-10 pb-10 flex flex-col">
          <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Bienvenido de nuevo
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Te enviamos un enlace mágico a tu correo, sin contraseñas.
              </p>
            </div>

            <LoginForm />

            <p className="text-center text-xs text-muted-foreground">
              Al continuar, aceptas nuestros{" "}
              <span className="text-primary underline underline-offset-2 cursor-pointer">
                Términos de uso
              </span>{" "}
              y{" "}
              <span className="text-primary underline underline-offset-2 cursor-pointer">
                Privacidad
              </span>
              .
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
