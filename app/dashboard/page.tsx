import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Bell } from "lucide-react";
import {
  getSuggestedActions,
  getBirthdaysThisWeek,
  getDashboardStats,
} from "@/lib/contacts/queries";
import { SuggestedActionCard } from "@/components/dashboard/suggested-action-card";
import { BirthdayCard } from "@/components/dashboard/birthday-card";
import { EmptyStateDashboard } from "@/components/dashboard/empty-state-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const initials = getInitials(email.split("@")[0] ?? "");

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const todayLabel = today.charAt(0).toUpperCase() + today.slice(1);

  // Fetch all dashboard data in parallel
  const [suggested, birthdays, stats] = await Promise.all([
    getSuggestedActions(10),
    getBirthdaysThisWeek(),
    getDashboardStats(),
  ]);

  // Build a map of contactId → daysUntilBirthday for the suggested action cards
  const birthdayMap = new Map(
    birthdays.map((b) => [b.id, b.daysUntilBirthday])
  );

  const hasContacts = stats.total_contacts > 0;
  const dueCount = stats.due_count;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Terracota Header ────────────────────────────────────────────── */}
      <header className="bg-[#9c3e21] pt-14 pb-24 px-6 flex flex-col items-center relative text-white">
        {/* Top row */}
        <div className="w-full flex justify-between items-center mb-6">
          {/* User avatar */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#9c3e21] font-bold text-sm shadow-sm">
            {initials}
          </div>
          {/* Bell (UI only) */}
          <Bell className="w-6 h-6 text-white/80" strokeWidth={1.5} />
        </div>

        <h1 className="text-[32px] font-bold tracking-[-0.02em] leading-10">
          Hoy
        </h1>
        <p className="text-white/80 text-sm font-medium mt-1">{todayLabel}</p>
      </header>

      {/* ── Content Panel ───────────────────────────────────────────────── */}
      <main className="flex-1 bg-[#fff8f5] rounded-t-[24px] -mt-12 relative z-10 pt-10 pb-32">
        {/* Floating yellow chip at junction */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
          {dueCount > 0 ? (
            <div className="bg-[#ffd33d] text-[#1f1b18] px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md border border-yellow-300/40">
              <span className="text-base">✨</span>
              <span className="text-sm font-semibold">
                {dueCount} {dueCount === 1 ? "persona espera" : "personas esperan"} tu mensaje
              </span>
            </div>
          ) : hasContacts ? (
            <div className="bg-[#ffd33d] text-[#1f1b18] px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md border border-yellow-300/40">
              <span className="text-base">🎉</span>
              <span className="text-sm font-semibold">No tienes pendientes</span>
            </div>
          ) : null}
        </div>

        <div className="px-6">
          {!hasContacts ? (
            /* ── Empty state ── */
            <EmptyStateDashboard />
          ) : (
            <>
              {/* ── Section: Acciones Sugeridas ───────────────────────── */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-[#1f1b18] tracking-[-0.01em]">
                    Acciones sugeridas
                  </h2>
                  {dueCount > 0 && (
                    <span className="w-7 h-7 rounded-full bg-[#9c3e21] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {dueCount}
                    </span>
                  )}
                </div>

                {suggested.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {suggested.map((contact) => (
                      <SuggestedActionCard
                        key={contact.id ?? ""}
                        contact={contact}
                        daysUntilBirthday={contact.id ? birthdayMap.get(contact.id) : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#f5ece8] rounded-[20px] p-6 flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <p className="font-semibold text-[#1f1b18]">Todo al día</p>
                      <p className="text-sm text-[#8a726b] mt-0.5">
                        No tienes contactos pendientes por ahora.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* ── Section: Cumpleaños esta semana ───────────────────── */}
              {birthdays.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-[#1f1b18] tracking-[-0.01em] mb-4">
                    Cumpleaños esta semana
                  </h2>
                  <div className="flex flex-col gap-3">
                    {birthdays.map((contact) => (
                      <BirthdayCard key={contact.id ?? ""} contact={contact} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
