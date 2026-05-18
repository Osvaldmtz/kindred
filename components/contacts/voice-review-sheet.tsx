"use client";

import { useState, useTransition } from "react";
import { Drawer } from "vaul";
import { X, Trash2, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { saveContactContext, updateContactBirthday } from "@/lib/contacts/queries";
import type { ExtractedContext } from "@/lib/anthropic/prompts";

interface VoiceReviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  extracted: ExtractedContext;
  transcript: string;
}

type BirthdayItem = { type: "birthday"; value: string };
type ContextItem = { type: "context"; key: string; value: string };
type NoteItem = { type: "note"; value: string };
type ReviewItem = BirthdayItem | ContextItem | NoteItem;

function iconForKey(key: string): string {
  const icons: Record<string, string> = {
    hijos: "👨‍👩‍👧",
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
  };
  return icons[key] ?? "📌";
}

function buildItems(extracted: ExtractedContext, transcript: string): ReviewItem[] {
  const items: ReviewItem[] = [];
  if (extracted.birthday) {
    items.push({ type: "birthday", value: extracted.birthday });
  }
  for (const e of extracted.context_entries) {
    items.push({ type: "context", key: e.key, value: e.value });
  }
  if (extracted.note) {
    items.push({ type: "note", value: extracted.note });
  }
  if (items.length === 0 && transcript) {
    items.push({ type: "note", value: transcript });
  }
  return items;
}

function formatBirthday(value: string): string {
  try {
    const [year, month, day] = value.split("-");
    const months = [
      "ene", "feb", "mar", "abr", "may", "jun",
      "jul", "ago", "sep", "oct", "nov", "dic",
    ];
    const m = parseInt(month, 10) - 1;
    const y = year === "1900" ? "(año desconocido)" : year;
    return `${day} de ${months[m]} de ${y}`;
  } catch {
    return value;
  }
}

function itemIcon(item: ReviewItem): string {
  if (item.type === "birthday") return "📅";
  if (item.type === "note") return "📝";
  return iconForKey(item.key);
}

function itemLabel(item: ReviewItem): string {
  if (item.type === "birthday") return "Cumpleaños";
  if (item.type === "note") return "Nota";
  return item.key;
}

function itemDisplayValue(item: ReviewItem): string {
  if (item.type === "birthday") return formatBirthday(item.value);
  return item.value;
}

export function VoiceReviewSheet({
  open,
  onOpenChange,
  contactId,
  contactName,
  extracted,
  transcript,
}: VoiceReviewSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Sync items when sheet opens
  if (open && !initialized) {
    setItems(buildItems(extracted, transcript));
    setInitialized(true);
  }
  if (!open && initialized) {
    setInitialized(false);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function startEdit(index: number, currentValue: string) {
    setEditingIndex(index);
    setEditValue(currentValue);
  }

  function saveEdit(index: number) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        return { ...item, value: editValue };
      })
    );
    setEditingIndex(null);
  }

  function handleSave() {
    if (items.length === 0) {
      onOpenChange(false);
      return;
    }

    startTransition(async () => {
      try {
        const birthdayItem = items.find(
          (i): i is BirthdayItem => i.type === "birthday"
        );

        const contextItems = items.filter(
          (i): i is ContextItem => i.type === "context"
        );

        const noteItem = items.find(
          (i): i is NoteItem => i.type === "note"
        );

        const allEntries = [
          ...contextItems.map((i) => ({ key: i.key, value: i.value })),
          ...(noteItem ? [{ key: "nota", value: noteItem.value }] : []),
        ];

        const promises: Promise<void>[] = [];

        if (birthdayItem) {
          promises.push(updateContactBirthday(contactId, birthdayItem.value));
        }
        if (allEntries.length > 0) {
          promises.push(saveContactContext(contactId, allEntries, "voice"));
        }

        await Promise.all(promises);
        toast.success(`Guardado en el perfil de ${contactName}`);
        setItems([]);
        setInitialized(false);
        onOpenChange(false);
      } catch {
        toast.error("No pudimos guardar. Intenta de nuevo.");
      }
    });
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl pb-8 outline-none max-h-[80vh] overflow-y-auto">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-[#e8e0dc] mt-3 mb-1" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5ece8] sticky top-0 bg-white z-10">
            <div>
              <p className="font-bold text-[#1f1b18]">✅ Claude detectó esto</p>
              <p className="text-xs text-[#8a726b]">Revisa y edita antes de guardar</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a726b] hover:bg-[#f5ece8]"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Items */}
          <div className="px-6 pt-4 pb-2 flex flex-col gap-3">
            {items.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#8a726b]">
                  No pude detectar información estructurada.
                </p>
                <p className="text-xs text-[#8a726b] mt-1">
                  Intenta ser más específico al hablar.
                </p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-[#faf7f5] rounded-2xl p-4"
                >
                  <span className="text-lg leading-none mt-0.5">
                    {itemIcon(item)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#8a726b] uppercase tracking-wide mb-0.5">
                      {itemLabel(item)}
                    </p>
                    {editingIndex === index ? (
                      <div className="flex gap-2 items-center">
                        <input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 text-sm border border-[#ddc0b9] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#9c3e21]"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(index)}
                          className="w-8 h-8 rounded-full bg-[#9c3e21] text-white flex items-center justify-center"
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-[#1f1b18] leading-relaxed">
                        {itemDisplayValue(item)}
                      </p>
                    )}
                  </div>
                  {editingIndex !== index && (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(index, item.value)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#8a726b] hover:bg-[#f5ece8]"
                        aria-label="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => removeItem(index)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 mx-6 mt-4">
            <button
              onClick={() => {
                setItems([]);
                setInitialized(false);
                onOpenChange(false);
              }}
              className="flex-1 h-12 rounded-full border-2 border-[#e8e0dc] text-[#56423c] font-semibold text-sm"
            >
              Descartar
            </button>
            <button
              onClick={handleSave}
              disabled={isPending || items.length === 0}
              className="flex-1 h-12 rounded-full bg-[#9c3e21] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#802a0d] disabled:opacity-50 transition-all"
            >
              {isPending ? "Guardando…" : "Guardar todo ✓"}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
