import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const initials = getInitials(email.split("@")[0] ?? "");
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Terracota header */}
      <header className="bg-primary pt-12 pb-24 px-6 flex flex-col items-center relative text-white">
        <div className="w-full flex justify-between items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border border-white/30">
            {initials}
          </div>
          <span className="text-white/80 text-sm">{email}</span>
        </div>
        <h1 className="text-[32px] font-bold tracking-[-0.02em] leading-10">
          Hoy
        </h1>
        <p className="text-white/80 text-sm font-medium mt-1">
          {todayCapitalized}
        </p>
      </header>

      {/* Content panel */}
      <main className="flex-1 bg-background rounded-t-[24px] -mt-12 relative z-10 px-6 pt-10 pb-32 md:pb-10">
        {/* Yellow chip */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#ffd33d] text-[#1f1b18] px-6 py-2.5 rounded-full flex items-center gap-2 whitespace-nowrap z-10">
          <span className="text-sm font-semibold">
            ✨ Bienvenido a Kindred
          </span>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center text-2xl font-bold text-primary">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              ¡Estás dentro!
            </p>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              La Fase 6 construirá este dashboard con tus contactos pendientes,
              cumpleaños y acciones sugeridas.
            </p>
          </div>
          <div className="mt-2 flex flex-col gap-2 w-full max-w-xs">
            <Link
              href="/dashboard/contacts/new"
              className="h-12 rounded-2xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:bg-[#802a0d]"
            >
              Agregar tu primer contacto →
            </Link>
            <Link
              href="/dashboard/contacts"
              className="h-12 rounded-2xl bg-card text-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:bg-[#efe6e2]"
            >
              Ver contactos
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
