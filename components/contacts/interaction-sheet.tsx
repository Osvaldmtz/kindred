"use client";

import { useState, useTransition } from "react";
import { Drawer } from "vaul";
import {
  Phone,
  MessageCircle,
  MessageSquare,
  Mail,
  Users,
  Coffee,
  Calendar,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { format, addHours } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { createInteraction } from "@/lib/interactions/queries";
import { PRINCIPLES } from "@/lib/carnegie/principles";
import { AvatarWithColor } from "@/components/shared/avatar-with-color";
import type { InteractionType } from "@/lib/interactions/schemas";

const TYPE_OPTIONS: {
  type: InteractionType;
  label: string;
  icon: React.ElementType;
}[] = [
  { type: "call", label: "Llamada", icon: Phone },
  { type: "message", label: "Mensaje", icon: MessageCircle },
  { type: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { type: "email", label: "Email", icon: Mail },
  { type: "meeting", label: "Reunión", icon: Users },
  { type: "coffee", label: "Café", icon: Coffee },
];

interface InteractionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  contactPhotoUrl?: string | null;
}

export function InteractionSheet({
  open,
  onOpenChange,
  contactId,
  contactName,
  contactPhotoUrl,
}: InteractionSheetProps) {
  const [selectedType, setSelectedType] = useState<InteractionType | null>(null);
  const [note, setNote] = useState("");
  const [hoursOffset, setHoursOffset] = useState(0);
  const [principlesOpen, setPrinciplesOpen] = useState(false);
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const baseDate = new Date();
  const targetDate = addHours(baseDate, hoursOffset);

  function getDateLabel(): string {
    const diffHours = Math.abs(hoursOffset);
    if (diffHours === 0) {
      return `Hoy · ${format(targetDate, "h:mm a", { locale: es })}`;
    }
    if (diffHours < 24) {
      return `Hace ${diffHours}h · ${format(targetDate, "h:mm a", { locale: es })}`;
    }
    if (diffHours < 48) {
      return `Ayer · ${format(targetDate, "h:mm a", { locale: es })}`;
    }
    return format(targetDate, "d MMM · h:mm a", { locale: es });
  }

  function togglePrinciple(id: string) {
    setSelectedPrinciples((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function resetForm() {
    setSelectedType(null);
    setNote("");
    setHoursOffset(0);
    setPrinciplesOpen(false);
    setSelectedPrinciples([]);
  }

  function handleCancel() {
    resetForm();
    onOpenChange(false);
  }

  function handleSave() {
    if (!selectedType) return;

    startTransition(async () => {
      const result = await createInteraction({
        contact_id: contactId,
        type: selectedType,
        note: note || null,
        occurred_at: targetDate.toISOString(),
        carnegie_principles: selectedPrinciples,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Interacción con ${contactName} registrada`);
        resetForm();
        onOpenChange(false);
      }
    });
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-[#fff8f5] rounded-t-[24px] max-h-[90dvh] outline-none">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 bg-[#ddc0b9] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-[#f5ece8]">
            <button
              onClick={handleCancel}
              className="text-[#9c3e21] font-medium text-sm"
            >
              Cancelar
            </button>
            <span className="font-bold text-[#1f1b18] text-base">
              Nueva interacción
            </span>
            <button
              onClick={handleSave}
              disabled={!selectedType || isPending}
              className="text-[#9c3e21] font-bold text-sm disabled:opacity-40"
            >
              {isPending ? "Guardando…" : "Guardar"}
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 pb-12">
            {/* Contact subtitle */}
            <div className="flex items-center gap-3 py-5">
              <AvatarWithColor
                name={contactName}
                photoUrl={contactPhotoUrl}
                size="sm"
              />
              <p className="text-sm text-[#56423c] italic">con {contactName}</p>
            </div>

            {/* TIPO */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-[#8a726b] tracking-widest uppercase mb-3">
                Tipo
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {TYPE_OPTIONS.map(({ type, label, icon: Icon }) => {
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl transition-all",
                        isSelected
                          ? "bg-[#ffdbd1] border-2 border-[#9c3e21] text-[#9c3e21]"
                          : "bg-[#fbf2ed] border-2 border-transparent text-[#56423c] hover:bg-[#f5ece8]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-6 h-6",
                          isSelected ? "text-[#9c3e21]" : "text-[#56423c]"
                        )}
                        strokeWidth={isSelected ? 2 : 1.5}
                      />
                      <span className="text-xs font-semibold">{label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* CUÁNDO */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-[#8a726b] tracking-widest uppercase mb-3">
                Cuándo
              </h3>
              <div className="flex items-center justify-between p-4 bg-[#fbf2ed] rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#9c3e21]" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-[#1f1b18]">
                    {getDateLabel()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHoursOffset((h) => Math.max(-168, h - 1))}
                    disabled={hoursOffset <= -168}
                    className="w-8 h-8 rounded-full bg-[#eae1dc] flex items-center justify-center disabled:opacity-40"
                    title="Más atrás en el tiempo"
                  >
                    <Minus className="w-3.5 h-3.5 text-[#1f1b18]" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setHoursOffset((h) => Math.min(0, h + 1))}
                    disabled={hoursOffset >= 0}
                    className="w-8 h-8 rounded-full bg-[#eae1dc] flex items-center justify-center disabled:opacity-40"
                    title="Más reciente"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#1f1b18]" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </section>

            {/* NOTA */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-[#8a726b] tracking-widest uppercase mb-3">
                Nota
              </h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="¿De qué hablamos? ¿Algo importante que recordar?"
                className="w-full bg-[#fbf2ed] rounded-xl px-4 py-3 text-sm text-[#1f1b18] placeholder:text-[#8a726b] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 resize-none transition"
              />
            </section>

            {/* PRINCIPIOS (collapsible) */}
            <section>
              <button
                type="button"
                onClick={() => setPrinciplesOpen((o) => !o)}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="text-xs font-semibold text-[#8a726b] tracking-widest uppercase">
                  Principios aplicados
                  {selectedPrinciples.length > 0 && (
                    <span className="ml-2 bg-[#9c3e21] text-white rounded-full px-1.5 py-0.5 text-[10px]">
                      {selectedPrinciples.length}
                    </span>
                  )}
                </h3>
                {principlesOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#8a726b]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8a726b]" />
                )}
              </button>
              {principlesOpen && (
                <div className="flex flex-wrap gap-2">
                  {PRINCIPLES.map((p) => {
                    const isSelected = selectedPrinciples.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePrinciple(p.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                          isSelected
                            ? "bg-[#9c3e21]/10 text-[#9c3e21] border border-[#9c3e21]/20"
                            : "bg-[#eae1dc] text-[#56423c]"
                        )}
                      >
                        {p.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
