import Link from "next/link";
import { AvatarWithColor } from "@/components/shared/avatar-with-color";
import { getRelationshipLabel } from "@/components/shared/relationship-badge";
import { getSuggestedAction } from "@/lib/contacts/suggested-action";
import type { ContactWithStatus, RelationshipType } from "@/types/database";

interface SuggestedActionCardProps {
  contact: ContactWithStatus;
  daysUntilBirthday?: number;
}

function daysLabel(days: number | null): string {
  if (days === null) return "Sin contacto aún";
  if (days === 0) return "Hoy";
  if (days === 1) return "Hace 1 día";
  return `Hace ${days} días`;
}

export function SuggestedActionCard({
  contact,
  daysUntilBirthday,
}: SuggestedActionCardProps) {
  const action = getSuggestedAction(contact, daysUntilBirthday);
  const ActionIcon = action.icon;
  const relLabel = getRelationshipLabel(
    contact.relationship_type as RelationshipType
  );

  return (
    <Link
      href={`/dashboard/contacts/${contact.id}`}
      className="bg-[#f5ece8] rounded-[20px] p-4 flex items-center gap-4 hover:bg-[#efe6e2] active:scale-[0.98] transition-all"
    >
      {/* Avatar */}
      <AvatarWithColor
        name={contact.name ?? ""}
        photoUrl={contact.photo_url}
        size="md"
      />

      {/* Info stack */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[18px] leading-6 text-[#1f1b18] truncate">
          {contact.name}
        </p>
        <p className="text-sm text-[#8a726b] mt-0.5">
          {relLabel}
        </p>
        {/* Suggested action */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <ActionIcon
            className="w-3.5 h-3.5 text-[#9c3e21] shrink-0"
            strokeWidth={2}
          />
          <span className="text-sm font-semibold text-[#9c3e21]">
            {action.label}
          </span>
        </div>
      </div>

      {/* Time badge */}
      <span className="text-xs font-medium text-[#8a726b] whitespace-nowrap shrink-0">
        {daysLabel(contact.days_since_last_interaction)}
      </span>
    </Link>
  );
}
