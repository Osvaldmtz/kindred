"use client";

import { useState, useMemo } from "react";
import { Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { ContactListItem } from "./contact-list-item";
import { EmptyState } from "@/components/shared/empty-state";
import type { ContactWithStatus, RelationshipType } from "@/types/database";

const FILTER_CHIPS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "family", label: "Familia" },
  { key: "client", label: "Cliente" },
  { key: "rotary", label: "Rotary" },
  { key: "prospect", label: "Prospecto" },
  { key: "mentor", label: "Mentor" },
];

interface ContactsListClientProps {
  contacts: ContactWithStatus[];
}

export function ContactsListClient({ contacts }: ContactsListClientProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        !search ||
        (c.name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || c.relationship_type === (activeFilter as RelationshipType);
      return matchesSearch && matchesFilter;
    });
  }, [contacts, search, activeFilter]);

  return (
    <>
      {/* Search bar */}
      <div className="px-6 pt-6 pb-3">
        <div className="bg-[#f5ece8] h-14 rounded-xl flex items-center px-4 gap-3">
          <Search className="w-5 h-5 text-[#8a726b] shrink-0" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="bg-transparent border-none outline-none text-sm w-full text-[#1f1b18] placeholder:text-[#8a726b]"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-6 pb-5 no-scrollbar">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setActiveFilter(chip.key)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeFilter === chip.key
                ? "bg-[#9c3e21] text-white"
                : "bg-[#f5ece8] text-[#56423c] hover:bg-[#eae1dc]"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-6 flex flex-col gap-4 pb-32">
        {filtered.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="Sin contactos"
            description={
              search || activeFilter !== "all"
                ? "No hay contactos que coincidan con tu búsqueda."
                : "Agrega tu primer contacto para empezar a cultivar tus relaciones."
            }
            cta={
              !search && activeFilter === "all"
                ? { label: "Agregar contacto", href: "/dashboard/contacts/new" }
                : undefined
            }
          />
        ) : (
          filtered.map((contact) => (
            <ContactListItem key={contact.id ?? ""} contact={contact} />
          ))
        )}
      </div>

      {/* FAB */}
      <Link
        href="/dashboard/contacts/new"
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#9c3e21] text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-[#802a0d] hover:scale-105 active:scale-95 transition-all"
        aria-label="Agregar contacto"
      >
        <UserPlus className="w-6 h-6" strokeWidth={1.5} />
      </Link>
    </>
  );
}
