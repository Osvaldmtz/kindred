import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isThisWeek } from "date-fns";
import { es } from "date-fns/locale";
import type { RelationshipType } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: es,
  });
}

export function formatDate(date: string | Date, pattern = "d MMM yyyy"): string {
  return format(new Date(date), pattern, { locale: es });
}

export function isDateThisWeek(date: string | Date): boolean {
  return isThisWeek(new Date(date), { locale: es });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getRelationshipLabel(type: RelationshipType): string {
  const labels: Record<RelationshipType, string> = {
    family: "Familia",
    friend: "Amigo/a",
    client: "Cliente",
    prospect: "Prospecto",
    rotary: "Rotary",
    colleague: "Colega",
    mentor: "Mentor/a",
    other: "Otro",
  };
  return labels[type];
}

export function getDueSeverity(
  daysSince: number | null,
  targetFrequency: number
): "overdue" | "due" | "ok" {
  if (daysSince === null) return "due";
  if (daysSince >= targetFrequency * 1.5) return "overdue";
  if (daysSince >= targetFrequency) return "due";
  return "ok";
}
