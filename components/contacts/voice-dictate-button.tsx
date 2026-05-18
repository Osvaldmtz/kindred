"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { VoiceRecorderSheet } from "./voice-recorder-sheet";
import { VoiceReviewSheet } from "./voice-review-sheet";
import type { ExtractedContext } from "@/lib/anthropic/prompts";

interface VoiceDictateButtonProps {
  contactId: string;
  contactName: string;
  variant?: "grid" | "inline";
}

const EMPTY_EXTRACTED: ExtractedContext = {
  birthday: null,
  context_entries: [],
  note: null,
  contact_name: null,
};

export function VoiceDictateButton({
  contactId,
  contactName,
  variant = "grid",
}: VoiceDictateButtonProps) {
  const [recorderOpen, setRecorderOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedContext>(EMPTY_EXTRACTED);
  const [transcript, setTranscript] = useState("");

  function handleExtracted(data: ExtractedContext, rawTranscript: string) {
    setExtracted(data);
    setTranscript(rawTranscript);
    setReviewOpen(true);
  }

  return (
    <>
      {variant === "grid" ? (
        <button
          onClick={() => setRecorderOpen(true)}
          className="flex flex-col items-start gap-2 p-4 rounded-[20px] text-left bg-[#f5ece8] hover:bg-[#eae1dc] active:scale-[0.98] transition-colors"
          aria-label="Dictar nota de voz"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Mic className="w-5 h-5 text-[#9c3e21]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1f1b18] leading-tight">
              Dictar nota
            </p>
            <p className="text-xs text-[#8a726b] mt-0.5">
              Graba info del contacto
            </p>
          </div>
        </button>
      ) : (
        <button
          onClick={() => setRecorderOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-[#9c3e21] hover:underline"
          aria-label="Dictar nota de voz"
        >
          <Mic className="w-4 h-4" strokeWidth={1.5} />
          Dictar nota
        </button>
      )}

      <VoiceRecorderSheet
        open={recorderOpen}
        onOpenChange={setRecorderOpen}
        contactId={contactId}
        contactName={contactName}
        onExtracted={handleExtracted}
      />

      <VoiceReviewSheet
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        contactId={contactId}
        contactName={contactName}
        extracted={extracted}
        transcript={transcript}
      />
    </>
  );
}
