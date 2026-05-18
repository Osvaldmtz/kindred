"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Users, Sparkles, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickAddSheet } from "./quick-add-sheet";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Hoy", icon: Home },
  { href: "/dashboard/contacts", label: "Contactos", icon: Users },
  { href: "/dashboard/briefs", label: "Briefs", icon: Sparkles },
  { href: "/dashboard/settings", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  // Split items around the FAB center slot
  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  return (
    <>
      <QuickAddSheet open={sheetOpen} onOpenChange={setSheetOpen} />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[#fff8f5] border-t border-[#ddc0b9] md:hidden"
        style={{
          height: "calc(64px + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Left items */}
        {leftItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-4 py-1 rounded-xl transition-all",
                active ? "text-primary" : "text-[#56423c]"
              )}
            >
              <Icon
                className={cn("h-6 w-6 transition-transform", active && "scale-110")}
                strokeWidth={1.5}
                fill={active ? "currentColor" : "none"}
              />
              <span
                className={cn(
                  "text-[11px] leading-none",
                  active ? "font-bold" : "font-medium"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Center FAB slot */}
        <div className="relative flex flex-col items-center justify-center -mt-5">
          <button
            onClick={() => setSheetOpen(true)}
            aria-label="Abrir acciones rápidas"
            className="w-14 h-14 rounded-2xl bg-primary text-white shadow-lg flex items-center justify-center transition-transform active:scale-90 hover:bg-[#802a0d]"
          >
            <Plus className="h-7 w-7" strokeWidth={1.5} />
          </button>
          <span className="mt-1 text-[11px] font-medium text-[#56423c]">
            Agregar
          </span>
        </div>

        {/* Right items */}
        {rightItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-4 py-1 rounded-xl transition-all",
                active ? "text-primary" : "text-[#56423c]"
              )}
            >
              <Icon
                className={cn("h-6 w-6 transition-transform", active && "scale-110")}
                strokeWidth={1.5}
                fill={active ? "currentColor" : "none"}
              />
              <span
                className={cn(
                  "text-[11px] leading-none",
                  active ? "font-bold" : "font-medium"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
