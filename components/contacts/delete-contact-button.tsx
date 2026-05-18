"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteContact } from "@/lib/contacts/queries";
import { toast } from "sonner";

interface DeleteContactButtonProps {
  contactId: string;
  contactName: string;
}

export function DeleteContactButton({
  contactId,
  contactName,
}: DeleteContactButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteContact(contactId);
      } catch {
        toast.error("Error al eliminar el contacto");
      }
    });
  }

  if (showConfirm) {
    return (
      <div className="border border-red-200 rounded-2xl p-5 bg-red-50 space-y-3">
        <p className="text-sm font-semibold text-red-800 text-center">
          ¿Eliminar a <span className="font-bold">{contactName}</span>?
        </p>
        <p className="text-xs text-red-600 text-center">
          Esta acción no se puede deshacer. Se eliminarán también todas sus interacciones e intereses.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="flex-1 border border-[#ddc0b9] rounded-xl py-3 text-sm font-semibold text-[#56423c] hover:bg-[#f5ece8] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
          >
            {isPending ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="w-full flex items-center justify-center gap-2 border border-red-200 rounded-2xl py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
    >
      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
      Eliminar contacto
    </button>
  );
}
