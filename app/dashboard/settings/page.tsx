import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";
import { redirect } from "next/navigation";
import {
  User,
  Bell,
  Sliders,
  Download,
  Trash2,
  Info,
  Shield,
  FileText,
  ChevronRight,
} from "lucide-react";
import { LogoutButton } from "@/components/settings/logout-button";

export const dynamic = "force-dynamic";

async function getProfileStats(userId: string) {
  const supabase = await createClient();

  const [{ count: totalContacts }, { count: totalInteractions }, { data: contactsData }] =
    await Promise.all([
      supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("interactions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("contacts_with_status")
        .select("days_since_last_interaction, target_frequency_days")
        .eq("user_id", userId),
    ]);

  // Average health = avg % across contacts that have been contacted
  let avgHealth = 0;
  if (contactsData && contactsData.length > 0) {
    const healths: number[] = contactsData.map((c) => {
      if (!c.days_since_last_interaction) return 0;
      const freq = c.target_frequency_days ?? 30;
      const days = c.days_since_last_interaction;
      if (days <= freq) return 100;
      if (days <= freq * 1.5) return 75;
      if (days <= freq * 2) return 50;
      return 25;
    });
    avgHealth = Math.round(healths.reduce((a: number, b: number) => a + b, 0) / healths.length);
  }

  return {
    totalContacts: totalContacts ?? 0,
    totalInteractions: totalInteractions ?? 0,
    avgHealth,
  };
}

interface SettingRow {
  label: string;
  icon: React.ElementType;
  placeholder?: boolean;
  danger?: boolean;
}

const SECTIONS: { title: string; rows: SettingRow[] }[] = [
  {
    title: "Cuenta",
    rows: [
      { label: "Configuración de perfil", icon: User, placeholder: true },
      { label: "Notificaciones", icon: Bell, placeholder: true },
    ],
  },
  {
    title: "Preferencias",
    rows: [
      { label: "Frecuencia de contacto por defecto", icon: Sliders, placeholder: true },
    ],
  },
  {
    title: "Datos",
    rows: [
      { label: "Exportar mis datos", icon: Download, placeholder: true },
      { label: "Eliminar cuenta", icon: Trash2, placeholder: true, danger: true },
    ],
  },
  {
    title: "App",
    rows: [
      { label: "Privacidad", icon: Shield, placeholder: true },
      { label: "Términos de uso", icon: FileText, placeholder: true },
      { label: "Versión 1.0.0", icon: Info, placeholder: true },
    ],
  },
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const email = user.email ?? "";
  const name = email.split("@")[0] ?? "";
  const initials = getInitials(name);
  const stats = await getProfileStats(user.id);

  return (
    <div className="min-h-screen bg-[#fff8f5] pb-32">
      {/* Header */}
      <header className="bg-[#9c3e21] pt-14 pb-28 px-6 flex flex-col items-center text-white">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#9c3e21] font-bold text-2xl shadow-md mb-4">
          {initials}
        </div>
        <h1 className="text-xl font-bold truncate max-w-[200px]">{name}</h1>
        <p className="text-white/70 text-sm mt-0.5 truncate max-w-[240px]">{email}</p>
      </header>

      {/* Stats card */}
      <div className="mx-6 -mt-14 relative z-10">
        <div className="bg-white rounded-[20px] shadow-md p-5">
          <div className="grid grid-cols-3 divide-x divide-[#f5ece8]">
            <div className="flex flex-col items-center gap-1 pr-4">
              <span className="text-2xl font-bold text-[#9c3e21]">
                {stats.totalContacts}
              </span>
              <span className="text-xs text-[#8a726b] text-center leading-tight">
                Contactos
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="text-2xl font-bold text-[#9c3e21]">
                {stats.avgHealth}%
              </span>
              <span className="text-xs text-[#8a726b] text-center leading-tight">
                Salud media
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 pl-4">
              <span className="text-2xl font-bold text-[#9c3e21]">
                {stats.totalInteractions}
              </span>
              <span className="text-xs text-[#8a726b] text-center leading-tight">
                Interacciones
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div className="mt-6 px-6 space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-bold tracking-widest text-[#8a726b] uppercase mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-white rounded-[20px] overflow-hidden divide-y divide-[#f5ece8]">
              {section.rows.map((row) => {
                const Icon = row.icon;
                return (
                  <button
                    key={row.label}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#fbf2ed] transition-colors text-left"
                    onClick={
                      row.placeholder
                        ? undefined
                        : undefined
                    }
                    disabled={row.placeholder}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${row.danger ? "text-red-500" : "text-[#9c3e21]"}`}
                      strokeWidth={1.5}
                    />
                    <span
                      className={`flex-1 text-sm font-medium ${row.danger ? "text-red-500" : "text-[#1f1b18]"}`}
                    >
                      {row.label}
                    </span>
                    {row.placeholder ? (
                      <span className="text-[10px] font-semibold text-[#8a726b] bg-[#f5ece8] px-2 py-0.5 rounded-full">
                        Próximamente
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#8a726b]" strokeWidth={1.5} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <LogoutButton />

        <p className="text-center text-xs text-[#8a726b] pb-4">
          Kindred v1.0.0 · Hecho con ♥ para cultivar relaciones
        </p>
      </div>
    </div>
  );
}
