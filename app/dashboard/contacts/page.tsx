import { getContacts } from "@/lib/contacts/queries";
import { ContactsListClient } from "@/components/contacts/contacts-list-client";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await getContacts();
  const dueCount = contacts.filter((c) => c.is_due).length;

  return (
    <div className="min-h-screen bg-[#9c3e21]">
      {/* Top App Bar */}
      <header className="bg-[#9c3e21] text-white pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-1">
          <div className="w-10" /> {/* spacer */}
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <div className="w-10" /> {/* spacer */}
        </div>
        <p className="text-center text-white/70 text-sm font-medium">
          {contacts.length} {contacts.length === 1 ? "persona" : "personas"}
          {dueCount > 0 && (
            <span className="ml-2 text-[#ffdbd1]">· {dueCount} pendiente{dueCount !== 1 ? "s" : ""}</span>
          )}
        </p>
      </header>

      {/* Content panel */}
      <main className="bg-[#fff8f5] rounded-t-3xl -mt-4 relative z-10 min-h-screen">
        <ContactsListClient contacts={contacts} />
      </main>
    </div>
  );
}
