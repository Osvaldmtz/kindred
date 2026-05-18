"use client";

import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { contactFormSchema, type ContactFormValues } from "@/lib/contacts/schemas";
import { Constants } from "@/types/database";
import type { Contact, ContactInterest } from "@/types/database";

const RELATIONSHIP_LABELS: Record<string, string> = {
  family: "Familia",
  friend: "Amigo",
  client: "Cliente",
  prospect: "Prospecto",
  rotary: "Rotary",
  colleague: "Colega",
  mentor: "Mentor",
  other: "Otro",
};

interface ContactFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<Contact>;
  defaultInterests?: ContactInterest[];
  submitLabel?: string;
}

export function ContactForm({
  action,
  defaultValues,
  defaultInterests = [],
  submitLabel = "Guardar contacto",
}: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [notesOpen, setNotesOpen] = useState(!!defaultValues?.notes);
  const [interests, setInterests] = useState<string[]>(
    defaultInterests.map((i) => i.tag)
  );
  const [interestInput, setInterestInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      relationship_type: defaultValues?.relationship_type ?? "friend",
      company: defaultValues?.company ?? "",
      role: defaultValues?.role ?? "",
      birthday: defaultValues?.birthday ?? "",
      photo_url: defaultValues?.photo_url ?? "",
      target_frequency_days: defaultValues?.target_frequency_days ?? 30,
      notes: defaultValues?.notes ?? "",
      interests: defaultInterests.map((i) => i.tag),
    },
  });

  const frequencyRaw = watch("target_frequency_days");
  const frequency = frequencyRaw ?? 30;

  function addInterest(tag: string) {
    const clean = tag.trim();
    if (!clean || interests.includes(clean) || interests.length >= 20) return;
    const next = [...interests, clean];
    setInterests(next);
    setValue("interests", next);
    setInterestInput("");
  }

  function removeInterest(tag: string) {
    const next = interests.filter((i) => i !== tag);
    setInterests(next);
    setValue("interests", next);
  }

  function onSubmit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    // Remove old interest entries and re-add from state
    formData.delete("interests[]");
    interests.forEach((tag) => formData.append("interests[]", tag));

    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al guardar el contacto"
        );
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-[calc(100vh-80px)]">
      <div className="flex-1 px-5 py-6 space-y-5">
        {/* Photo URL */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#1f1b18]">
            URL de foto <span className="font-normal text-[#8a726b]">(opcional)</span>
          </label>
          <input
            {...register("photo_url")}
            type="url"
            placeholder="https://..."
            className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] placeholder:text-[#8a726b] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition"
          />
          {errors.photo_url && (
            <p className="text-xs text-red-600">{errors.photo_url.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#1f1b18]">
            Nombre completo <span className="text-[#9c3e21]">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="María García"
            className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] placeholder:text-[#8a726b] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition"
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Relationship type */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#1f1b18]">
            Tipo de relación
          </label>
          <select
            {...register("relationship_type")}
            className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition appearance-none"
          >
            {Constants.public.Enums.relationship_type.map((type) => (
              <option key={type} value={type}>
                {RELATIONSHIP_LABELS[type] ?? type}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#1f1b18]">
            Email <span className="font-normal text-[#8a726b]">(opcional)</span>
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="maria@ejemplo.com"
            className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] placeholder:text-[#8a726b] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition"
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#1f1b18]">
            Teléfono <span className="font-normal text-[#8a726b]">(opcional)</span>
          </label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+52 55 1234 5678"
            className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] placeholder:text-[#8a726b] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition"
          />
        </div>

        {/* Company + Role */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#1f1b18]">Empresa</label>
            <input
              {...register("company")}
              type="text"
              placeholder="Empresa S.A."
              className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] placeholder:text-[#8a726b] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#1f1b18]">Cargo</label>
            <input
              {...register("role")}
              type="text"
              placeholder="Directora"
              className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] placeholder:text-[#8a726b] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition"
            />
          </div>
        </div>

        {/* Birthday */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#1f1b18]">
            Cumpleaños <span className="font-normal text-[#8a726b]">(opcional)</span>
          </label>
          <input
            {...register("birthday")}
            type="date"
            className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition"
          />
        </div>

        {/* Interests */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#1f1b18]">
            Intereses <span className="font-normal text-[#8a726b]">(presiona Enter para agregar)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {interests.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-[#9c3e21]/10 text-[#9c3e21] px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeInterest(tag)}
                  className="hover:text-[#802a0d] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addInterest(interestInput);
              }
            }}
            placeholder="Fotografía, Rotary, Emprendimiento..."
            className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] placeholder:text-[#8a726b] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition"
          />
        </div>

        {/* Frequency counter */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1f1b18]">
            Frecuencia de contacto
          </label>
          <div className="flex items-center gap-4 bg-[#f5ece8] rounded-xl px-4 py-3">
            <button
              type="button"
              onClick={() =>
                setValue("target_frequency_days", Math.max(1, frequency - 1))
              }
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#9c3e21] shadow-sm hover:bg-[#ffdbd1] transition-colors"
            >
              <Minus className="w-4 h-4" strokeWidth={2} />
            </button>
            <span className="flex-1 text-center font-bold text-[#1f1b18]">
              Cada {frequency} día{frequency !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={() =>
                setValue("target_frequency_days", Math.min(365, frequency + 1))
              }
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#9c3e21] shadow-sm hover:bg-[#ffdbd1] transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <input type="hidden" {...register("target_frequency_days", { valueAsNumber: true })} />
        </div>

        {/* Notes (collapsible) */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setNotesOpen((o) => !o)}
            className="flex items-center gap-2 text-sm font-semibold text-[#1f1b18]"
          >
            Notas iniciales
            {notesOpen ? (
              <ChevronUp className="w-4 h-4 text-[#8a726b]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8a726b]" />
            )}
          </button>
          {notesOpen && (
            <textarea
              {...register("notes")}
              rows={4}
              placeholder="Contexto relevante, temas de conversación, recordatorios..."
              className="w-full bg-[#f5ece8] rounded-xl px-4 py-3 text-sm text-[#1f1b18] placeholder:text-[#8a726b] outline-none focus:ring-2 focus:ring-[#9c3e21]/30 transition resize-none"
            />
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-[#fff8f5] border-t border-[#ddc0b9]/30 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#9c3e21] hover:bg-[#802a0d] disabled:opacity-60 text-white rounded-2xl px-6 py-4 font-semibold text-base transition-colors"
        >
          {isPending ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
