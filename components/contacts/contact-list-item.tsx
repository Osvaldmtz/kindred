import Link from "next/link";
import { AvatarWithColor } from "@/components/shared/avatar-with-color";
import { getRelationshipLabel } from "@/components/shared/relationship-badge";
import type { ContactWithStatus } from "@/types/database";

interface ContactListItemProps {
  contact: ContactWithStatus;
}

export function ContactListItem({ contact }: ContactListItemProps) {
  const isOverdue = contact.is_due;
  const daysSince = contact.days_since_last_interaction;

  function getStatusLabel(): string {
    if (isOverdue) return "Atrasado";
    if (daysSince === null) return "Sin contacto";
    if (daysSince === 0) return "Hoy";
    if (daysSince === 1) return "Hace 1 día";
    return `Hace ${daysSince} días`;
  }

  const statusLabel = getStatusLabel();

  return (
    <Link
      href={`/dashboard/contacts/${contact.id}`}
      className="bg-[#f5ece8] p-5 rounded-[20px] flex items-center justify-between hover:bg-[#efe6e2] transition-colors active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-4">
        <AvatarWithColor
          name={contact.name ?? ""}
          photoUrl={contact.photo_url}
          size="md"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-[18px] leading-6 text-[#1f1b18] truncate">
            {contact.name}
          </h3>
          <p className="text-[14px] text-[#8a726b] font-medium">
            {getRelationshipLabel(
              contact.relationship_type as Parameters<
                typeof getRelationshipLabel
              >[0]
            )}
          </p>
        </div>
      </div>

      {isOverdue ? (
        <span className="bg-[#FFEBB2] text-[#806200] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0">
          Atrasado
        </span>
      ) : (
        <span className="bg-[#ddc0b9]/30 text-[#56423c] px-3 py-1 rounded-full text-xs font-medium shrink-0">
          {statusLabel}
        </span>
      )}
    </Link>
  );
}
