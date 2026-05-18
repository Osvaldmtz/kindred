"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import { MessageSquarePlus, UserPlus, Sparkles, Clock, X } from "lucide-react";
import { InteractionSheet } from "@/components/contacts/interaction-sheet";
import { AvatarWithColor } from "@/components/shared/avatar-with-color";
import { getDueContacts } from "@/lib/interactions/queries";
import type { ContactWithStatus } from "@/types/database";

interface QuickAddSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SelectedContact {
  id: string;
  name: string;
  photoUrl?: string | null;
}

export function QuickAddSheet({ open, onOpenChange }: QuickAddSheetProps) {
  const router = useRouter();
  const [dueContacts, setDueContacts] = useState<ContactWithStatus[]>([]);
  const [selectedContact, setSelectedContact] = useState<SelectedContact | null>(null);
  const [interactionSheetOpen, setInteractionSheetOpen] = useState(false);

  // Fetch due contacts when sheet opens
  useEffect(() => {
    if (open) {
      getDueContacts(6).then(setDueContacts).catch(() => setDueContacts([]));
    }
  }, [open]);

  function handleSuggestedContact(contact: ContactWithStatus) {
    setSelectedContact({
      id: contact.id ?? "",
      name: contact.name ?? "",
      photoUrl: contact.photo_url,
    });
    onOpenChange(false);
    // Small delay to let the quick-add sheet close before opening interaction sheet
    setTimeout(() => setInteractionSheetOpen(true), 200);
  }

  function handleRegisterInteraction() {
    // Without pre-selected contact, navigate to contacts to pick one
    onOpenChange(false);
    router.push("/dashboard/contacts");
  }

  function handleAddContact() {
    onOpenChange(false);
    router.push("/dashboard/contacts/new");
  }

  const QUICK_ACTIONS = [
    {
      icon: MessageSquarePlus,
      label: "Registrar interacción",
      description: "Anotá un contacto reciente",
      onClick: handleRegisterInteraction,
      active: true,
    },
    {
      icon: UserPlus,
      label: "Agregar contacto",
      description: "Nueva persona a tu CRM",
      onClick: handleAddContact,
      active: true,
    },
    {
      icon: Sparkles,
      label: "Generar brief",
      description: "Resumen IA del contacto",
      onClick: () => {},
      active: false,
    },
    {
      icon: Clock,
      label: "Recordatorio",
      description: "Próximamente en v2",
      onClick: () => {},
      active: false,
    },
  ] as const;

  return (
    <>
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-[#fff8f5] rounded-t-[24px] max-h-[75dvh] outline-none">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-[#ddc0b9] rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0">
              <h2 className="text-lg font-bold text-[#1f1b18]">
                ¿Qué quieres hacer?
              </h2>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-full bg-[#f5ece8] flex items-center justify-center text-[#56423c] hover:bg-[#eae1dc] transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-8">
              {/* Action grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={action.active ? action.onClick : undefined}
                      disabled={!action.active}
                      className={`flex flex-col items-start gap-2 p-4 rounded-[20px] text-left transition-colors ${
                        action.active
                          ? "bg-[#f5ece8] hover:bg-[#eae1dc] active:scale-[0.98]"
                          : "bg-[#f5ece8] opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Icon
                          className="w-5 h-5 text-[#9c3e21]"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1f1b18] leading-tight">
                          {action.label}
                        </p>
                        <p className="text-xs text-[#8a726b] mt-0.5">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Suggested contacts */}
              {dueContacts.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[#8a726b] tracking-widest uppercase mb-3">
                    Acciones sugeridas
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {dueContacts.map((contact) => {
                      const days = contact.days_since_last_interaction;
                      const label =
                        days === null
                          ? "Sin contacto"
                          : days === 0
                            ? "Hoy"
                            : days === 1
                              ? "Hace 1 día"
                              : `Hace ${days} días`;

                      return (
                        <button
                          key={contact.id}
                          onClick={() => handleSuggestedContact(contact)}
                          className="flex flex-col items-center gap-2 p-3 bg-[#f5ece8] rounded-2xl hover:bg-[#eae1dc] transition-colors shrink-0 w-[90px] active:scale-95"
                        >
                          <AvatarWithColor
                            name={contact.name ?? ""}
                            photoUrl={contact.photo_url}
                            size="sm"
                          />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-[#1f1b18] truncate w-full">
                              {contact.name?.split(" ")[0]}
                            </p>
                            <p className="text-[10px] text-[#9c3e21] font-medium">
                              {label}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Interaction sheet triggered from suggested contacts */}
      {selectedContact && (
        <InteractionSheet
          open={interactionSheetOpen}
          onOpenChange={(o) => {
            setInteractionSheetOpen(o);
            if (!o) setSelectedContact(null);
          }}
          contactId={selectedContact.id}
          contactName={selectedContact.name}
          contactPhotoUrl={selectedContact.photoUrl}
        />
      )}
    </>
  );
}
