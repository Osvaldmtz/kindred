"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { InteractionSheet } from "./interaction-sheet";

interface ContactDetailFabProps {
  contactId: string;
  contactName: string;
  contactPhotoUrl?: string | null;
}

export function ContactDetailFab({
  contactId,
  contactName,
  contactPhotoUrl,
}: ContactDetailFabProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setSheetOpen(true)}
        aria-label="Registrar interacción"
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#9c3e21] text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-[#802a0d] hover:scale-105 active:scale-95 transition-all"
      >
        <Plus className="w-7 h-7" strokeWidth={1.5} />
      </button>

      <InteractionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        contactId={contactId}
        contactName={contactName}
        contactPhotoUrl={contactPhotoUrl}
      />
    </>
  );
}
