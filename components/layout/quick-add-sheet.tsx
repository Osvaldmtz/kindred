"use client";

import { Drawer } from "vaul";
import {
  MessageSquare,
  UserPlus,
  Sparkles,
  CalendarClock,
  X,
  type LucideIcon,
} from "lucide-react";

interface QuickAddSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface QuickAction {
  icon: LucideIcon;
  label: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: MessageSquare,
    label: "Registrar interacción",
    description: "Anota una conversación",
  },
  {
    icon: UserPlus,
    label: "Agregar contacto",
    description: "Nueva persona a tu red",
  },
  {
    icon: Sparkles,
    label: "Generar brief",
    description: "Brief de IA para reunión",
  },
  {
    icon: CalendarClock,
    label: "Programar recordatorio",
    description: "Próxima conversación",
  },
];

export function QuickAddSheet({ open, onOpenChange }: QuickAddSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[24px] bg-background focus:outline-none"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Drag handle */}
          <div className="mx-auto mt-3 mb-1 h-1 w-9 rounded-full bg-[#ddc0b9]" />

          <div className="px-5">
            {/* Header */}
            <div className="flex items-center justify-between py-4">
              <h2 className="text-[20px] font-semibold text-foreground">
                ¿Qué quieres hacer?
              </h2>
              <button
                onClick={() => onOpenChange(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Action grid */}
            <div className="grid grid-cols-2 gap-3 pb-8">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => onOpenChange(false)}
                    className="flex flex-col gap-3 rounded-[20px] bg-card p-5 text-left transition-all active:scale-[0.97] hover:bg-[#efe6e2]"
                  >
                    <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-semibold leading-tight text-foreground">
                        {action.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
