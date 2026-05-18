"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/auth/signout", { method: "POST" });
      window.location.href = "/login";
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] border-2 border-red-200 text-red-500 font-semibold hover:bg-red-50 active:scale-95 transition-all disabled:opacity-50"
    >
      <LogOut className="w-5 h-5" strokeWidth={1.5} />
      {isPending ? "Cerrando sesión…" : "Cerrar sesión"}
    </button>
  );
}
