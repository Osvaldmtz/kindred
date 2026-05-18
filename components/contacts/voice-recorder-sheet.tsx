"use client";

import { useState, useEffect, useRef } from "react";
import { Drawer } from "vaul";
import { Mic, Square, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import type { ExtractedContext } from "@/lib/anthropic/prompts";

interface VoiceRecorderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  onExtracted: (data: ExtractedContext, transcript: string) => void;
}

type RecordingState = "idle" | "recording" | "analyzing";

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventLocal extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLocal extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLocal) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLocal) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export function VoiceRecorderSheet({
  open,
  onOpenChange,
  contactId,
  contactName,
  onExtracted,
}: VoiceRecorderSheetProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");
  const [seconds, setSeconds] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      stopRecognition();
      setTranscript("");
      setSeconds(0);
      setState("idle");
    }
  }, [open]);

  // Timer
  useEffect(() => {
    if (state === "recording") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  function stopRecognition() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }

  function startRecording() {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Tu navegador no soporta grabación. Usa Chrome o Safari.");
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-MX";

    let finalTranscript = "";

    recognition.onresult = (event: SpeechRecognitionEventLocal) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLocal) => {
      if (event.error === "not-allowed") {
        toast.error("Necesitamos acceso al micrófono para grabar.");
      } else {
        toast.error("Error al grabar. Intenta de nuevo.");
      }
      setState("idle");
    };

    recognition.start();
    recognitionRef.current = recognition;
    setSeconds(0);
    setState("recording");
  }

  async function stopAndAnalyze() {
    stopRecognition();
    setState("analyzing");

    const currentTranscript = transcript.trim();
    if (currentTranscript.length < 5) {
      toast.error("El texto grabado es muy corto. Intenta hablar más.");
      setState("idle");
      return;
    }

    try {
      const res = await fetch("/api/voice-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: currentTranscript, contactId, contactName }),
      });

      if (!res.ok) throw new Error("Error del servidor");

      const { extracted } = (await res.json()) as { extracted: ExtractedContext };
      onExtracted(extracted, currentTranscript);
      onOpenChange(false);
    } catch {
      toast.error("No pudimos analizar el audio. Intenta de nuevo.");
      setState("idle");
    }
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl pb-8 outline-none">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-[#e8e0dc] mt-3 mb-1" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5ece8]">
            <div>
              <p className="font-bold text-[#1f1b18]">🎙️ Dictar nota</p>
              <p className="text-xs text-[#8a726b]">Sobre: {contactName}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a726b] hover:bg-[#f5ece8]"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Transcript area */}
          <div className="mx-6 mt-5 min-h-[120px] bg-[#faf7f5] rounded-2xl p-4 border border-[#e8e0dc]">
            {transcript ? (
              <p className="text-sm text-[#1f1b18] leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-sm text-[#8a726b] italic">
                {state === "recording"
                  ? "Escuchando… habla con naturalidad"
                  : "Toca el botón para empezar a hablar…"}
              </p>
            )}
          </div>

          {/* Recording indicator */}
          {state === "recording" && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-[#56423c]">
                Grabando {formatTime(seconds)}
              </span>
            </div>
          )}

          {state === "analyzing" && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Loader2 className="w-4 h-4 text-[#9c3e21] animate-spin" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-[#56423c]">
                Analizando con IA…
              </span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex gap-3 mx-6 mt-6">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-full border-2 border-[#e8e0dc] text-[#56423c] font-semibold text-sm"
            >
              Cancelar
            </button>

            {state === "idle" || state === "recording" ? (
              <button
                onClick={state === "idle" ? startRecording : stopAndAnalyze}
                disabled={state === "recording" && transcript.length < 5}
                className="flex-1 h-12 rounded-full bg-[#9c3e21] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#802a0d] disabled:opacity-50 transition-all"
              >
                {state === "idle" ? (
                  <>
                    <Mic className="w-4 h-4" strokeWidth={1.5} />
                    Grabar
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" strokeWidth={1.5} />
                    Detener y analizar
                  </>
                )}
              </button>
            ) : (
              <div className="flex-1 h-12 rounded-full bg-[#f5ece8] flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-[#9c3e21] animate-spin" strokeWidth={1.5} />
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
