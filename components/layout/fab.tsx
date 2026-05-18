"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FabProps {
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
}

export function Fab({ onClick, className, "aria-label": ariaLabel }: FabProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel ?? "Abrir acciones rápidas"}
      className={cn(
        "w-14 h-14 rounded-2xl bg-primary text-white shadow-lg",
        "flex items-center justify-center",
        "transition-transform active:scale-90 hover:bg-[#802a0d]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
    >
      <Plus className="w-7 h-7" strokeWidth={1.5} />
    </button>
  );
}
