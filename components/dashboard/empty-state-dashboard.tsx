import Link from "next/link";
import { UserPlus } from "lucide-react";

const HOW_TO_STEPS = [
  {
    step: "1",
    title: "Agrega a las personas importantes",
    desc: "Familia, amigos, mentores, clientes, contactos de Rotary…",
  },
  {
    step: "2",
    title: "Registra cuando hablen",
    desc: "Una llamada, un café, un mensaje — todo cuenta.",
  },
  {
    step: "3",
    title: "Pide un Brief IA antes de cada conversación",
    desc: "Kindred te recuerda qué importa y qué preguntar.",
  },
];

export function EmptyStateDashboard() {
  return (
    <div className="flex flex-col items-center text-center py-10">
      {/* Decorative icon */}
      <div className="w-24 h-24 rounded-full bg-[#ffdbd1] flex items-center justify-center mb-6">
        <span className="text-5xl select-none">🌱</span>
      </div>

      <h2 className="text-[22px] font-bold text-[#1f1b18] leading-tight mb-3">
        Empieza tu memoria viva
      </h2>
      <p className="text-sm text-[#8a726b] leading-relaxed max-w-xs mb-8">
        Agrega a las personas que importan en tu vida y Kindred te ayuda a
        mantener esas relaciones vivas.
      </p>

      {/* How-to guide card */}
      <div className="w-full bg-white rounded-[20px] p-5 text-left mb-6 border border-[#f5ece8] shadow-sm">
        <p className="text-xs font-bold tracking-widest text-[#8a726b] uppercase mb-4">
          ¿Cómo usar Kindred?
        </p>
        <div className="flex flex-col gap-4">
          {HOW_TO_STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-[#9c3e21] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {step}
              </div>
              <div>
                <p className="font-semibold text-[#1f1b18] text-sm">{title}</p>
                <p className="text-xs text-[#8a726b] mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/dashboard/contacts/new"
        className="h-14 px-8 rounded-full bg-[#9c3e21] text-white font-semibold text-base flex items-center gap-2 hover:bg-[#802a0d] active:scale-95 transition-all shadow-md"
      >
        <UserPlus className="w-5 h-5" strokeWidth={1.5} />
        Agregar mi primer contacto
      </Link>
    </div>
  );
}
