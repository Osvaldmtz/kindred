"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

function pickMimeType(): string | undefined {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const t of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return undefined;
}

function extensionForMime(mime: string): string {
  if (mime.includes("mp4") || mime.includes("m4a")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

export function VoiceRecorderSheet({
  open,
  onOpenChange,
  contactId,
  contactName,
  onExtracted,
}: VoiceRecorderSheetProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordedMimeRef = useRef<string>("audio/webm");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRecorderSilently = useCallback(() => {
    const rec = mediaRecorderRef.current;
    mediaRecorderRef.current = null;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    chunksRef.current = [];
  }, []);

  // Reset on close
  useEffect(() => {
    if (!open) {
      stopRecorderSilently();
      setSeconds(0);
      setState("idle");
    }
  }, [open, stopRecorderSilently]);

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

  async function startRecording() {
    if (typeof MediaRecorder === "undefined") {
      toast.error("Tu navegador no permite grabar audio.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recordedMimeRef.current = recorder.mimeType || mimeType || "audio/webm";

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setSeconds(0);
      setState("recording");
    } catch {
      toast.error("Necesitamos acceso al micrófono para grabar.");
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setState("idle");
    }
  }

  async function stopAndAnalyze() {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      setState("idle");
      return;
    }

    setState("analyzing");

    const mime = recorder.mimeType || recordedMimeRef.current;
    await new Promise<void>((resolve) => {
      recorder.addEventListener("stop", () => resolve(), { once: true });
      recorder.stop();
    });

    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    const blob = new Blob(chunksRef.current, { type: mime });
    chunksRef.current = [];

    if (blob.size < 400) {
      toast.error("La grabación es muy corta. Habla un poco más.");
      setState("idle");
      return;
    }

    const ext = extensionForMime(mime);
    const filename = `recording.${ext}`;

    try {
      const formData = new FormData();
      formData.append("audio", blob, filename);
      formData.append("contactId", contactId);
      formData.append("contactName", contactName);

      const res = await fetch("/api/voice-context", {
        method: "POST",
        body: formData,
      });

      const raw: unknown = await res.json().catch(() => ({}));
      const payload =
        raw && typeof raw === "object" && raw !== null
          ? (raw as { error?: unknown; extracted?: unknown; transcript?: unknown })
          : {};

      if (!res.ok) {
        const errMsg =
          typeof payload.error === "string" ? payload.error : "Error del servidor";
        toast.error(errMsg);
        setState("idle");
        return;
      }

      const extracted = payload.extracted as ExtractedContext | undefined;
      const transcript =
        typeof payload.transcript === "string" ? payload.transcript : "";

      if (!extracted || transcript.length < 2) {
        toast.error("Respuesta inválida del servidor.");
        setState("idle");
        return;
      }

      onExtracted(extracted, transcript);
      onOpenChange(false);
    } catch {
      toast.error("No pudimos procesar el audio. Intenta de nuevo.");
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

          {/* Info area */}
          <div className="mx-6 mt-5 min-h-[120px] bg-[#faf7f5] rounded-2xl p-4 border border-[#e8e0dc]">
            <p className="text-sm text-[#8a726b] leading-relaxed">
              {state === "analyzing" ? (
                <>
                  <span className="font-medium text-[#56423c]">
                    Transcribiendo con Whisper
                  </span>{" "}
                  y extrayendo datos con IA…
                </>
              ) : state === "recording" ? (
                <>
                  Grabando audio (sin vista previa).{" "}
                  <span className="text-[#1f1b18]">Habla con naturalidad</span> y
                  pulsa detener cuando termines.
                </>
              ) : (
                <>
                  Al grabar enviamos el audio a{" "}
                  <span className="font-medium text-[#56423c]">Whisper</span> para
                  una transcripción fiel; luego Claude organiza la información.
                </>
              )}
            </p>
          </div>

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
              <Loader2
                className="w-4 h-4 text-[#9c3e21] animate-spin"
                strokeWidth={1.5}
              />
              <span className="text-sm font-semibold text-[#56423c]">
                Procesando…
              </span>
            </div>
          )}

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
                disabled={state === "recording" && seconds < 1}
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
                <Loader2
                  className="w-4 h-4 text-[#9c3e21] animate-spin"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
