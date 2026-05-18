"use client";

import { useState } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { BriefSheet } from "./brief-sheet";
import type { BriefResponse } from "@/lib/anthropic/prompts";

interface BriefIAButtonProps {
  contactId: string;
  contactName: string;
  contactPhotoUrl?: string | null;
}

/** Action grid button — replaces the disabled "Brief IA" slot */
export function BriefIAButton({
  contactId,
  contactName,
  contactPhotoUrl,
}: BriefIAButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setSheetOpen(true)}
        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#fbf2ed] hover:bg-[#efe6e2] transition-colors group"
      >
        <Zap
          className="w-6 h-6 text-[#9c3e21] group-hover:scale-110 transition-transform"
          strokeWidth={1.5}
        />
        <span className="text-sm font-semibold text-[#9c3e21]">Brief IA</span>
      </button>

      <BriefSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        contactId={contactId}
        contactName={contactName}
        contactPhotoUrl={contactPhotoUrl}
      />
    </>
  );
}

interface BriefCardProps {
  contactId: string;
  contactName: string;
  contactPhotoUrl?: string | null;
  cachedBrief: BriefResponse;
  cachedAt?: string | null;
}

/** Preview card below the action row — only rendered when a cached brief exists */
export function BriefCard({
  contactId,
  contactName,
  contactPhotoUrl,
  cachedBrief,
  cachedAt,
}: BriefCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="bg-[#fbf2ed] rounded-[20px] p-6 text-left">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <h2 className="text-sm font-bold text-[#9c3e21] tracking-wide uppercase">
              Brief de IA listo
            </h2>
          </div>
          {cachedAt && (
            <span className="text-xs text-[#8a726b]">{formatCacheAge(cachedAt)}</span>
          )}
        </div>
        <p className="text-sm text-[#56423c] leading-relaxed mb-4 line-clamp-3">
          {cachedBrief.summary}
        </p>
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#9c3e21] hover:gap-2.5 transition-all"
        >
          Ver brief completo
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      <BriefSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        contactId={contactId}
        contactName={contactName}
        contactPhotoUrl={contactPhotoUrl}
      />
    </>
  );
}

function formatCacheAge(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  return `hace ${Math.floor(diffH / 24)} días`;
}
