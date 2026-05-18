"use client";

import { useState } from "react";
import { Cake } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { AvatarWithColor } from "@/components/shared/avatar-with-color";
import { InteractionSheet } from "@/components/contacts/interaction-sheet";
import type { BirthdayContact } from "@/lib/contacts/queries";

interface BirthdayCardProps {
  contact: BirthdayContact;
}

function birthdayLabel(daysUntil: number, birthdayStr: string): string {
  const date = parseISO(birthdayStr);
  const formatted = format(date, "d 'de' MMMM", { locale: es });
  if (daysUntil === 0) return `🎉 Hoy cumple · ${formatted}`;
  if (daysUntil === 1) return `🎉 Mañana cumple · ${formatted}`;
  return `En ${daysUntil} días · ${formatted}`;
}

export function BirthdayCard({ contact }: BirthdayCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isSoon = contact.daysUntilBirthday <= 1;

  return (
    <>
      <div
        className={`rounded-[20px] p-4 flex items-center gap-4 relative overflow-hidden ${
          isSoon
            ? "bg-[#ffdbd1]"
            : "bg-[#f5ece8]"
        }`}
      >
        {/* Avatar with cake overlay */}
        <div className="relative shrink-0">
          <AvatarWithColor
            name={contact.name ?? ""}
            photoUrl={contact.photo_url}
            size="md"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#9c3e21] rounded-full flex items-center justify-center">
            <Cake className="w-3 h-3 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[18px] leading-6 text-[#1f1b18] truncate">
            {contact.name}
          </p>
          <p className="text-sm text-[#56423c] mt-0.5 font-medium">
            {contact.birthday
              ? birthdayLabel(contact.daysUntilBirthday, contact.birthday)
              : ""}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => setSheetOpen(true)}
          className="bg-[#9c3e21] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#802a0d] active:scale-95 transition-all shrink-0"
        >
          Felicitar
        </button>

        {/* Decorative */}
        <div className="absolute right-[-8px] bottom-[-8px] opacity-[0.06] rotate-12 select-none pointer-events-none text-[100px]">
          🎉
        </div>
      </div>

      {/* Interaction sheet pre-selected as 'message' */}
      <InteractionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        contactId={contact.id ?? ""}
        contactName={contact.name ?? ""}
        contactPhotoUrl={contact.photo_url}
      />
    </>
  );
}
