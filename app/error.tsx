"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[Global Error]", error);
    }
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#ffdbd1] flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-[#9c3e21]" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold text-[#1f1b18] mb-2">
            Algo salió mal
          </h1>
          <p className="text-sm text-[#8a726b] mb-6 leading-relaxed">
            Ocurrió un error inesperado. Intenta recargar la página.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl p-3 mb-4 text-left font-mono break-all">
              {error.message}
            </p>
          )}
          <button
            onClick={reset}
            className="h-12 px-6 rounded-full bg-[#9c3e21] text-white font-semibold flex items-center gap-2 mx-auto hover:bg-[#802a0d] active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
