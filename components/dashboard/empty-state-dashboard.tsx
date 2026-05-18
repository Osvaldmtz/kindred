import Link from "next/link";
import { UserPlus } from "lucide-react";

export function EmptyStateDashboard() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      {/* Decorative icon */}
      <div className="w-24 h-24 rounded-full bg-[#ffdbd1] flex items-center justify-center mb-6">
        <span className="text-5xl select-none">🌱</span>
      </div>

      <h2 className="text-[22px] font-bold text-[#1f1b18] leading-tight mb-3">
        Empieza tu memoria viva
      </h2>
      <p className="text-sm text-[#8a726b] leading-relaxed max-w-xs mb-8">
        Agrega a las personas que importan en tu vida. Familia, amigos, mentores,
        clientes, contactos de Rotary…
      </p>

      <Link
        href="/dashboard/contacts/new"
        className="h-14 px-8 rounded-full bg-[#9c3e21] text-white font-semibold text-base flex items-center gap-2 hover:bg-[#802a0d] active:scale-95 transition-all shadow-md"
      >
        <UserPlus className="w-5 h-5" strokeWidth={1.5} />
        Agregar mi primer contacto
      </Link>

      <Link
        href="/dashboard/contacts"
        className="mt-4 text-sm font-medium text-[#9c3e21] hover:underline"
      >
        Ver mis contactos →
      </Link>
    </div>
  );
}
