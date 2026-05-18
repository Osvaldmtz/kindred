"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { interactionSchema } from "./schemas";
import type { Interaction, InteractionType, ContactWithStatus } from "@/types/database";
import type { Database } from "@/types/database";

type DBInteractionType = Database["public"]["Enums"]["interaction_type"];

export async function createInteraction(data: {
  contact_id: string;
  type: InteractionType;
  note?: string | null;
  occurred_at?: string;
  carnegie_principles?: string[];
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const parsed = interactionSchema.safeParse({
    ...data,
    occurred_at: data.occurred_at ?? new Date().toISOString(),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { error } = await supabase.from("interactions").insert({
    contact_id: parsed.data.contact_id,
    user_id: user.id,
    type: parsed.data.type as DBInteractionType,
    note: parsed.data.note ?? null,
    occurred_at: parsed.data.occurred_at ?? new Date().toISOString(),
    carnegie_principles:
      parsed.data.carnegie_principles && parsed.data.carnegie_principles.length > 0
        ? parsed.data.carnegie_principles
        : null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/contacts/${parsed.data.contact_id}`);
  revalidatePath("/dashboard/contacts");
  revalidatePath("/dashboard");

  return {};
}

export async function getInteractionsByContact(
  contactId: string,
  limit = 10
): Promise<Interaction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interactions")
    .select("*")
    .eq("contact_id", contactId)
    .order("occurred_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deleteInteraction(id: string, contactId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase.from("interactions").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath(`/dashboard/contacts/${contactId}`);
}

export async function getDueContacts(limit = 6): Promise<ContactWithStatus[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts_with_status")
    .select("*")
    .eq("is_due", true)
    .order("days_since_last_interaction", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as ContactWithStatus[];
}
