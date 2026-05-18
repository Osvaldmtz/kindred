import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContactForm } from "@/components/contacts/contact-form";
import { createContact } from "@/lib/contacts/queries";

export default function NewContactPage() {
  return (
    <div className="min-h-screen bg-[#9c3e21]">
      {/* Header */}
      <header className="bg-[#9c3e21] text-white pt-12 pb-6 px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/contacts"
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={1.5} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Nuevo contacto</h1>
        </div>
      </header>

      {/* Content panel */}
      <main className="bg-[#fff8f5] rounded-t-3xl -mt-4 relative z-10 min-h-screen">
        <ContactForm action={createContact} submitLabel="Crear contacto" />
      </main>
    </div>
  );
}
