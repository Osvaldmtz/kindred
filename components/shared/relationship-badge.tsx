import { cn } from "@/lib/utils";
import type { RelationshipType } from "@/types/database";

interface RelationshipConfig {
  label: string;
  className: string;
}

const RELATIONSHIP_CONFIG: Record<RelationshipType, RelationshipConfig> = {
  family: {
    label: "Familia",
    className: "bg-[#ffdbd1] text-[#802a0d]",
  },
  friend: {
    label: "Amigo",
    className: "bg-[#e0e0dd] text-[#464745]",
  },
  client: {
    label: "Cliente",
    className: "bg-[#ddc0b9] text-[#9c3e21]",
  },
  prospect: {
    label: "Prospecto",
    className: "bg-[#eae1dc] text-[#56423c]",
  },
  rotary: {
    label: "Rotary",
    className: "bg-[#bc5636] text-white",
  },
  colleague: {
    label: "Colega",
    className: "bg-[#e5e2dc] text-[#474743]",
  },
  mentor: {
    label: "Mentor",
    className: "bg-[#1f1b18] text-[#fff8f5]",
  },
  other: {
    label: "Otro",
    className: "bg-[#f5ece8] text-[#56423c]",
  },
};

interface RelationshipBadgeProps {
  type: RelationshipType;
  className?: string;
}

export function RelationshipBadge({ type, className }: RelationshipBadgeProps) {
  const config = RELATIONSHIP_CONFIG[type] ?? RELATIONSHIP_CONFIG.other;

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold tracking-wide inline-block",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function getRelationshipLabel(type: RelationshipType): string {
  return RELATIONSHIP_CONFIG[type]?.label ?? "Otro";
}
