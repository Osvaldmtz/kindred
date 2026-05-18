"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Users,
  Sparkles,
  User,
  Plus,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickAddSheet } from "./quick-add-sheet";

interface SidebarProps {
  userEmail?: string;
  userInitials?: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Hoy", icon: Home },
  { href: "/dashboard/contacts", label: "Contactos", icon: Users },
  { href: "/dashboard/briefs", label: "Briefs", icon: Sparkles },
  { href: "/dashboard/settings", label: "Perfil", icon: User },
] as const;

export function Sidebar({ userEmail, userInitials }: SidebarProps) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      <QuickAddSheet open={sheetOpen} onOpenChange={setSheetOpen} />

      <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#fbf2ed] border-r border-[#ddc0b9] flex flex-col z-40 hidden md:flex">
        {/* Logo */}
        <div className="px-6 pt-8 pb-6">
          <span className="text-2xl font-bold text-primary tracking-tight">
            Kindred
          </span>
        </div>

        {/* Quick add button */}
        <div className="px-4 mb-4">
          <button
            onClick={() => setSheetOpen(true)}
            className="w-full h-11 rounded-2xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:bg-[#802a0d] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Nueva acción
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-white"
                    : "text-[#56423c] hover:bg-[#f5ece8]"
                )}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={1.5}
                  fill={active ? "currentColor" : "none"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="border-t border-[#ddc0b9] px-3 py-4 flex flex-col gap-2">
          {/* User row */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#f5ece8] flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {userInitials ?? "?"}
            </div>
            <span className="text-xs text-muted-foreground truncate flex-1">
              {userEmail ?? ""}
            </span>
          </div>

          {/* Logout */}
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#56423c] hover:bg-[#f5ece8] transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
