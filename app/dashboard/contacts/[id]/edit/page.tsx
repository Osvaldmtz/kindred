import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getContact } from "@/lib/contacts/queries";
import { ContactForm } from "@/components/contacts/contact-form";
import { DeleteContactButton } from "@/components/contacts/delete-contact-button";
import { updateContact } from "@/lib/contacts/queries";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditContactPage({ params }: Props) {
  const { id } = await params;
  const data = await getContact(id);

  if (!data) notFound();

  const { contact, interests } = data;

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateContact(id, formData);
  }

  return (
    <div className="min-h-screen bg-[#9c3e21]">
      {/* Header */}
      <header className="bg-[#9c3e21] text-white pt-12 pb-6 px-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/contacts/${id}`}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={1.5} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Editar contacto</h1>
        </div>
      </header>

      {/* Content panel */}
      <main className="bg-[#fff8f5] rounded-t-3xl -mt-4 relative z-10 min-h-screen">
        <ContactForm
          action={handleUpdate}
          defaultValues={contact}
          defaultInterests={interests}
          submitLabel="Guardar cambios"
        />

        {/* Delete section */}
        <div className="px-5 pb-12">
          <DeleteContactButton contactId={id} contactName={contact.name} />
        </div>
      </main>
    </div>
  );
}
