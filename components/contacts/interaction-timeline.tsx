import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { Interaction, InteractionType } from "@/types/database";

const INTERACTION_ICONS: Record<InteractionType, string> = {
  call: "📞",
  message: "💬",
  whatsapp: "📱",
  email: "✉️",
  meeting: "🤝",
  coffee: "☕",
  event: "📅",
  other: "⭐",
};

const INTERACTION_LABELS: Record<InteractionType, string> = {
  call: "Llamada",
  message: "Mensaje",
  whatsapp: "WhatsApp",
  email: "Email",
  meeting: "Reunión",
  coffee: "Café",
  event: "Evento",
  other: "Otro",
};

interface InteractionTimelineProps {
  interactions: Interaction[];
}

export function InteractionTimeline({ interactions }: InteractionTimelineProps) {
  if (interactions.length === 0) {
    return (
      <div className="bg-[#fbf2ed] rounded-xl p-6 text-center">
        <p className="text-sm text-[#56423c]">
          Aún no hay interacciones registradas.
        </p>
        <p className="text-xs text-[#8a726b] mt-1">
          Usa el botón + para registrar un contacto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interactions.map((interaction) => {
        const itype = interaction.type as InteractionType;
        const date = parseISO(interaction.occurred_at);
        return (
          <div
            key={interaction.id}
            className="p-4 bg-[#fbf2ed] rounded-xl flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-lg">
              {INTERACTION_ICONS[itype] ?? "⭐"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#1f1b18] text-sm">
                {INTERACTION_LABELS[itype] ?? itype}
                {interaction.note ? (
                  <span className="font-normal text-[#56423c]">
                    {" "}— {interaction.note}
                  </span>
                ) : null}
              </p>
              <p className="text-xs text-[#56423c] mt-0.5">
                {format(date, "d 'de' MMMM", { locale: es })} ·{" "}
                {formatDistanceToNow(date, { addSuffix: true, locale: es })}
              </p>
              {interaction.carnegie_principles &&
                interaction.carnegie_principles.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {interaction.carnegie_principles.slice(0, 3).map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 bg-[#9c3e21]/10 text-[#9c3e21] rounded-full text-[10px] font-medium"
                      >
                        {p}
                      </span>
                    ))}
                    {interaction.carnegie_principles.length > 3 && (
                      <span className="px-2 py-0.5 bg-[#eae1dc] text-[#56423c] rounded-full text-[10px] font-medium">
                        +{interaction.carnegie_principles.length - 3}
                      </span>
                    )}
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
