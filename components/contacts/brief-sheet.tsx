"use client";

import { useState, useEffect, useCallback } from "react";
import { Drawer } from "vaul";
import { X, Lightbulb, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AvatarWithColor } from "@/components/shared/avatar-with-color";
import type { BriefResponse } from "@/lib/anthropic/prompts";

interface BriefSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  contactPhotoUrl?: string | null;
}

type BriefState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; brief: BriefResponse; cached: boolean; generatedAt?: string }
  | { status: "error"; message: string };

function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#eae1dc] rounded-full animate-pulse ${className}`}
    />
  );
}

function BriefSkeleton() {
  return (
    <div className="space-y-8">
      {/* AI chip skeleton */}
      <div className="h-7 w-48 bg-[#eae1dc] rounded-full animate-pulse" />

      {/* Section 1 */}
      <section className="space-y-3">
        <div className="h-3 w-24 bg-[#ddc0b9] rounded-full animate-pulse" />
        <div className="bg-[#f5ece8] p-6 rounded-[20px] space-y-2">
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-5/6" />
          <SkeletonLine className="h-4 w-4/6" />
        </div>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <div className="h-3 w-36 bg-[#ddc0b9] rounded-full animate-pulse" />
        <div className="bg-[#f5ece8] p-6 rounded-[20px] space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#ddc0b9] shrink-0" />
              <SkeletonLine className={`h-4 flex-1 ${i === 3 ? "w-3/4" : ""}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <div className="h-3 w-44 bg-[#ddc0b9] rounded-full animate-pulse" />
        <div className="bg-[#f5ece8] p-6 rounded-[20px] space-y-3">
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-5/6" />
        </div>
      </section>

      {/* Section 4 */}
      <div className="bg-[#ffdbd1]/30 p-6 rounded-[20px] border border-[#ffdbd1] space-y-2">
        <SkeletonLine className="h-3 w-24" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-4/5" />
      </div>
    </div>
  );
}

export function BriefSheet({
  open,
  onOpenChange,
  contactId,
  contactName,
  contactPhotoUrl,
}: BriefSheetProps) {
  const [state, setState] = useState<BriefState>({ status: "idle" });

  const fetchBrief = useCallback(
    async (force = false) => {
      setState({ status: "loading" });
      try {
        const res = await fetch(`/api/brief/${contactId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ force }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(err.error ?? `HTTP ${res.status}`);
        }

        const data = await res.json() as {
          brief: BriefResponse;
          cached: boolean;
          generated_at?: string;
        };

        setState({
          status: "success",
          brief: data.brief,
          cached: data.cached,
          generatedAt: data.generated_at,
        });
      } catch (err) {
        console.error("[BriefSheet] fetch error:", err);
        setState({
          status: "error",
          message:
            err instanceof Error ? err.message : "Error desconocido",
        });
      }
    },
    [contactId]
  );

  // Auto-fetch when sheet opens
  useEffect(() => {
    if (open && state.status === "idle") {
      fetchBrief(false);
    }
    // Reset when closed
    if (!open) {
      setState({ status: "idle" });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleRegenerate() {
    await fetchBrief(true);
    toast.success("Brief regenerado");
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white rounded-t-[24px] h-[85dvh] outline-none shadow-2xl">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 bg-[#ddc0b9] rounded-full" />
          </div>

          {/* Header */}
          <header className="px-6 py-4 flex items-center justify-between border-b border-[#f5ece8] shrink-0">
            <div className="flex items-center gap-3">
              <AvatarWithColor
                name={contactName}
                photoUrl={contactPhotoUrl}
                size="sm"
              />
              <h2 className="font-bold text-lg text-[#1f1b18] leading-tight">
                Brief para {contactName}
              </h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-10 h-10 rounded-full hover:bg-[#f5ece8] flex items-center justify-center transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-[#56423c]" strokeWidth={1.5} />
            </button>
          </header>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
            {state.status === "loading" && <BriefSkeleton />}

            {state.status === "error" && (
              <div className="space-y-4">
                <div className="bg-[#FFF9C4] border border-[#FBC02D]/40 rounded-[20px] p-5 flex gap-3 items-start">
                  <AlertTriangle
                    className="w-5 h-5 text-[#827717] shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="font-semibold text-[#827717] text-sm">
                      No se pudo generar el brief
                    </p>
                    <p className="text-sm text-[#56423c] mt-1">
                      {state.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => fetchBrief(false)}
                  className="w-full h-12 rounded-2xl bg-[#9c3e21] text-white font-semibold text-sm hover:bg-[#802a0d] transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {state.status === "success" && (
              <BriefContent
                brief={state.brief}
                cached={state.cached}
                generatedAt={state.generatedAt}
              />
            )}
          </div>

          {/* Sticky footer */}
          <footer className="absolute bottom-0 left-0 right-0 bg-white px-6 py-5 border-t border-[#f5ece8] flex gap-3">
            <button
              onClick={handleRegenerate}
              disabled={state.status === "loading"}
              className="flex-1 h-14 rounded-full border-2 border-[#9c3e21] text-[#9c3e21] font-semibold text-base hover:bg-[#ffdbd1] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
            >
              {state.status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
              )}
              Regenerar
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="flex-[1.5] h-14 rounded-full bg-[#9c3e21] text-white font-semibold text-base hover:bg-[#802a0d] active:scale-95 transition-all"
            >
              Empezar conversación
            </button>
          </footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function BriefContent({
  brief,
  cached,
  generatedAt,
}: {
  brief: BriefResponse;
  cached: boolean;
  generatedAt?: string;
}) {
  const timeLabel = generatedAt
    ? `hace ${formatDistanceToNow(new Date(generatedAt), { locale: es, addSuffix: false })}`
    : "ahora";

  return (
    <div className="space-y-8">
      {/* AI Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF9C4] rounded-full">
        <span className="text-[#FBC02D] text-base">✨</span>
        <span className="text-sm font-medium text-[#827717]">
          {cached
            ? `Generado con IA · ${timeLabel}`
            : "Generado con IA · ahora"}
        </span>
      </div>

      {/* Warning (if any) */}
      {brief.warning && (
        <div className="bg-[#FFF9C4] border border-[#FBC02D]/40 rounded-[20px] p-5 flex gap-3 items-start">
          <AlertTriangle
            className="w-5 h-5 text-[#827717] shrink-0 mt-0.5"
            strokeWidth={1.5}
          />
          <p className="text-sm text-[#56423c]">{brief.warning}</p>
        </div>
      )}

      {/* CONTEXTO */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold tracking-widest text-[#8a726b] uppercase">
          Contexto
        </h3>
        <div className="bg-[#f5ece8] p-6 rounded-[20px]">
          <p className="text-base text-[#56423c] leading-relaxed">
            {brief.summary}
          </p>
        </div>
      </section>

      {/* PUNTOS DE CONEXIÓN */}
      {brief.connection_points.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold tracking-widest text-[#8a726b] uppercase">
            Puntos de conexión
          </h3>
          <div className="bg-[#f5ece8] p-6 rounded-[20px] space-y-4">
            {brief.connection_points.map((point, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#9c3e21] shrink-0" />
                <p className="text-base text-[#56423c] leading-snug">{point}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PREGUNTAS */}
      {brief.questions_to_ask.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold tracking-widest text-[#8a726b] uppercase">
            Preguntas para hacer
          </h3>
          <div className="bg-[#f5ece8] p-6 rounded-[20px] space-y-4">
            {brief.questions_to_ask.map((q, i) => (
              <p key={i} className="text-base text-[#56423c] italic leading-snug">
                &ldquo;{q}&rdquo;
              </p>
            ))}
          </div>
        </section>
      )}

      {/* TIP CARNEGIE */}
      {brief.carnegie_tips.length > 0 && (
        <div className="bg-[#ffdbd1]/30 p-6 rounded-[20px] flex gap-4 items-start border border-[#ffdbd1]">
          <Lightbulb
            className="w-5 h-5 text-[#9c3e21] shrink-0 mt-0.5"
            strokeWidth={1.5}
            fill="currentColor"
          />
          <div className="space-y-2">
            <span className="text-sm font-bold text-[#9c3e21] uppercase tracking-wider">
              Tip Carnegie
            </span>
            {brief.carnegie_tips.map((tip, i) => (
              <p key={i} className="text-base text-[#802a0d] leading-snug">
                {tip}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
