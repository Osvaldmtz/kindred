import { Mic } from "lucide-react";
import type { ContactContext } from "@/types/database";

const KEY_LABELS: Record<string, string> = {
  nota: "Nota libre",
  hijos: "Hijos",
  hijas: "Hijas",
  interes: "Interés",
  intereses: "Intereses",
  ciudad: "Ciudad",
  perro: "Perro",
  gato: "Gato",
  mascota: "Mascota",
  pareja: "Pareja",
  empresa: "Empresa",
  cargo: "Cargo",
  universidad: "Universidad",
  hobby: "Hobby",
  hermanos: "Hermanos",
  padres: "Padres",
  abuelos: "Abuelos",
  cumpleanos: "Cumpleaños",
  telefono: "Teléfono",
  email: "Correo",
};

function iconForKey(key: string): string {
  const k = key.toLowerCase();
  const icons: Record<string, string> = {
    hijos: "👨‍👩‍👧",
    hijas: "👨‍👩‍👧",
    perro: "🐕",
    gato: "🐈",
    mascota: "🐾",
    pareja: "💑",
    empresa: "🏢",
    cargo: "💼",
    universidad: "🎓",
    hobby: "🎯",
    ciudad: "📍",
    hermanos: "👫",
    padres: "👴",
    interes: "✨",
    intereses: "✨",
    nota: "📝",
  };
  return icons[k] ?? "📌";
}

function labelForKey(key: string): string {
  const k = key.toLowerCase().trim();
  if (KEY_LABELS[k]) return KEY_LABELS[k];
  return k
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isNarrativeRow(key: string, value: string): boolean {
  const k = key.toLowerCase();
  if (k === "nota") return true;
  if (value.length >= 120) return true;
  return false;
}

function sortRows(rows: ContactContext[]): ContactContext[] {
  return [...rows].sort((a, b) => {
    const aNote = isNarrativeRow(a.key, a.value) ? 1 : 0;
    const bNote = isNarrativeRow(b.key, b.value) ? 1 : 0;
    if (aNote !== bNote) return aNote - bNote;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}

interface ContactContextSectionProps {
  rows: ContactContext[];
}

export function ContactContextSection({ rows }: ContactContextSectionProps) {
  if (rows.length === 0) return null;

  const sorted = sortRows(rows);
  const allVoice = sorted.every((r) => r.source === "voice");
  const anyVoice = sorted.some((r) => r.source === "voice");

  const facts = sorted.filter((r) => !isNarrativeRow(r.key, r.value));
  const narratives = sorted.filter((r) => isNarrativeRow(r.key, r.value));

  return (
    <section className="mb-6 w-full text-left" aria-labelledby="contact-context-heading">
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            id="contact-context-heading"
            className="text-xl font-semibold text-[#1f1b18]"
          >
            Lo que recordamos
          </h3>
          {anyVoice && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD33D]/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#1f1b18]">
              <Mic className="w-3 h-3" strokeWidth={1.75} aria-hidden />
              {allVoice ? "Por dictado" : "Incluye dictado"}
            </span>
          )}
        </div>
        <p className="text-xs text-[#8a726b] leading-snug max-w-xl">
          Hechos en tarjetas cortas; el detalle largo va abajo. Antes de guardar en el
          dictado puedes quitar líneas repetidas.
        </p>
      </div>

      <div className="rounded-[20px] border border-[#e8e0dc] bg-[#f5ece8] p-4 sm:p-5 space-y-4">
        {facts.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#8a726b] mb-3">
              Datos
            </p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {facts.map((row) => (
                <li
                  key={row.id}
                  className="flex gap-3 rounded-2xl bg-white/70 border border-[#e8e0dc]/80 px-3.5 py-3 shadow-sm"
                >
                  <span
                    className="text-lg leading-none shrink-0 w-9 h-9 rounded-full bg-[#fff8f5] border border-[#e8e0dc] flex items-center justify-center"
                    aria-hidden
                  >
                    {iconForKey(row.key)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-[#9c3e21] uppercase tracking-wide mb-0.5">
                      {labelForKey(row.key)}
                    </p>
                    <p className="text-sm text-[#1f1b18] leading-relaxed break-words">
                      {row.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {narratives.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#8a726b] mb-3">
              {facts.length > 0 ? "Nota / detalle" : "Nota"}
            </p>
            <ul className="space-y-3">
              {narratives.map((row) => (
                <li
                  key={row.id}
                  className="rounded-2xl border-l-4 border-[#9c3e21] bg-[#fff8f5] pl-4 pr-4 py-3.5 shadow-sm"
                >
                  <p className="text-[11px] font-bold text-[#8a726b] uppercase tracking-wide mb-1.5">
                    {labelForKey(row.key)}
                  </p>
                  <p className="text-sm text-[#56423c] leading-relaxed whitespace-pre-wrap break-words">
                    {row.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
