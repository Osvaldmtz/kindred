import {
  MessageSquare,
  MessageCircle,
  RefreshCw,
  Cake,
  Hand,
  type LucideIcon,
} from "lucide-react";
import type { ContactWithStatus } from "@/types/database";

export type ActionType =
  | "birthday"
  | "first_contact"
  | "reconnect"
  | "send_message"
  | "greet";

export type SuggestedAction = {
  label: string;
  icon: LucideIcon;
  action_type: ActionType;
};

/**
 * Returns the most contextually relevant action for a given contact,
 * based on their interaction history and birthday proximity.
 */
export function getSuggestedAction(
  contact: ContactWithStatus,
  daysUntilBirthday?: number
): SuggestedAction {
  // Birthday within 7 days takes precedence
  if (daysUntilBirthday !== undefined && daysUntilBirthday <= 7) {
    return {
      label: "Felicitar por cumpleaños",
      icon: Cake,
      action_type: "birthday",
    };
  }

  const days = contact.days_since_last_interaction;
  const freq = contact.target_frequency_days ?? 30;

  // Never contacted
  if (days === null || contact.total_interactions === 0) {
    return {
      label: "Iniciar conversación",
      icon: MessageCircle,
      action_type: "first_contact",
    };
  }

  // More than 2x overdue → reconnect
  if (days > freq * 2) {
    return {
      label: "Reconectar",
      icon: RefreshCw,
      action_type: "reconnect",
    };
  }

  // Overdue → send message
  if (days > freq) {
    return {
      label: "Enviar mensaje",
      icon: MessageSquare,
      action_type: "send_message",
    };
  }

  // Default
  return {
    label: "Saludar",
    icon: Hand,
    action_type: "greet",
  };
}
