import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <div className="bg-primary flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
        <h1 className="text-[40px] font-bold text-white leading-tight tracking-[-0.02em]">
          Kindred
        </h1>
        <p className="mt-3 text-white/80 text-base font-medium max-w-xs">
          Tu CRM personal para relaciones humanas con propósito.
        </p>
        <p className="mt-2 text-white/60 text-sm max-w-xs">
          Basado en los principios de Dale Carnegie.
        </p>
      </div>

      {/* CTA panel */}
      <div className="bg-background rounded-t-[24px] -mt-12 relative z-10 px-6 pt-10 pb-16 flex flex-col items-center gap-4">
        <Link
          href="/login"
          className="w-full max-w-xs h-14 rounded-2xl bg-primary text-white font-semibold text-base flex items-center justify-center gap-2 transition-all hover:bg-[#802a0d] active:scale-[0.98]"
        >
          Iniciar sesión
          <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
        </Link>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Ingresa con tu correo — sin contraseñas, sin fricción.
        </p>
      </div>
    </main>
  );
}
