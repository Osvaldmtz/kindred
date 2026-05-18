"use client";

import { useState, useTransition } from "react";
import { Minus, Plus } from "lucide-react";
import { updateFrequency } from "@/lib/contacts/queries";

interface FrequencyCounterProps {
  contactId: string;
  initialDays: number;
  healthPercent: number;
}

export function FrequencyCounter({
  contactId,
  initialDays,
  healthPercent,
}: FrequencyCounterProps) {
  const [days, setDays] = useState(initialDays);
  const [isPending, startTransition] = useTransition();

  function handleChange(newDays: number) {
    const clamped = Math.min(365, Math.max(1, newDays));
    setDays(clamped); // optimistic
    startTransition(async () => {
      await updateFrequency(contactId, clamped);
    });
  }

  const clampedHealth = Math.min(100, Math.max(0, healthPercent));

  return (
    <div className="bg-[#eae1dc]/30 rounded-[20px] p-6 text-left">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#1f1b18]">
          Frecuencia objetivo
        </h3>
        <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-[#9c3e21] border border-[#ddc0b9]">
          Cada {days} día{days !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-center gap-6 mb-5">
        <button
          onClick={() => handleChange(days - 1)}
          disabled={isPending || days <= 1}
          className="w-10 h-10 rounded-full bg-white border border-[#ddc0b9] flex items-center justify-center text-[#9c3e21] disabled:opacity-40 hover:bg-[#ffdbd1] transition-colors"
        >
          <Minus className="w-4 h-4" strokeWidth={2} />
        </button>
        <span className="text-3xl font-bold text-[#1f1b18] tabular-nums w-16 text-center">
          {days}
        </span>
        <button
          onClick={() => handleChange(days + 1)}
          disabled={isPending || days >= 365}
          className="w-10 h-10 rounded-full bg-white border border-[#ddc0b9] flex items-center justify-center text-[#9c3e21] disabled:opacity-40 hover:bg-[#ffdbd1] transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-[#f5ece8] rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-[#9c3e21] rounded-full transition-all duration-500"
          style={{ width: `${clampedHealth}%` }}
        />
      </div>
      <div className="flex justify-between text-sm font-medium text-[#56423c]">
        <span>Salud de conexión</span>
        <span className="text-[#9c3e21] font-bold">{Math.round(clampedHealth)}%</span>
      </div>
    </div>
  );
}
