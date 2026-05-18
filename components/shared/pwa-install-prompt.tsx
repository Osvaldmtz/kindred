"use client";

import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";

const STORAGE_KEY = "kindred-pwa-prompt-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) && !/CriOS/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<Platform>("other");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (isStandalone()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);

    // Listen for Android Chrome install event
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    // Show prompt after 30 seconds of engagement
    const timer = setTimeout(() => {
      if (detectedPlatform !== "other") {
        setShow(true);
      }
    }, 30_000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        dismiss();
      }
    }
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-[20px] shadow-xl border border-[#f5ece8] p-5 flex gap-4 items-start">
        {/* Icon */}
        <div className="w-12 h-12 rounded-[12px] bg-[#9c3e21] flex items-center justify-center shrink-0">
          {platform === "ios" ? (
            <Share className="w-6 h-6 text-white" strokeWidth={1.5} />
          ) : (
            <Download className="w-6 h-6 text-white" strokeWidth={1.5} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1f1b18] text-sm">Instalar Kindred</p>
          {platform === "ios" ? (
            <p className="text-xs text-[#56423c] mt-1 leading-relaxed">
              Toca el botón{" "}
              <span className="font-semibold">Compartir</span> (
              <span className="font-mono text-[10px] bg-[#f5ece8] px-1 rounded">⬆</span>
              ) y elige{" "}
              <span className="font-semibold">&ldquo;Agregar a pantalla de inicio&rdquo;</span>
            </p>
          ) : (
            <p className="text-xs text-[#56423c] mt-1 leading-relaxed">
              Agrega la app a tu pantalla para acceso rápido sin abrir el browser
            </p>
          )}
          {platform === "android" && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="mt-2.5 h-8 px-4 bg-[#9c3e21] text-white text-xs font-semibold rounded-full"
            >
              Instalar app
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#8a726b] hover:bg-[#f5ece8] transition-colors shrink-0"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
