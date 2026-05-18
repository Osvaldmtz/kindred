"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[Dashboard Error]", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-[#ffdbd1] flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-[#9c3e21]" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-[#1f1b18] mb-2">
          Algo salió mal
        </h2>
        <p className="text-sm text-[#8a726b] mb-6 leading-relaxed">
          No pudimos cargar esta sección. Puedes intentarlo de nuevo.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-red-500 bg-red-50 rounded-xl p-3 mb-4 text-left font-mono break-all">
            {error.message}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="h-11 px-5 rounded-full bg-[#9c3e21] text-white font-semibold text-sm flex items-center gap-2 hover:bg-[#802a0d] active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
            Reintentar
          </button>
          <Link
            href="/dashboard"
            className="h-11 px-5 rounded-full border-2 border-[#9c3e21] text-[#9c3e21] font-semibold text-sm flex items-center gap-2 hover:bg-[#ffdbd1] transition-colors"
          >
            <Home className="w-4 h-4" strokeWidth={1.5} />
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
