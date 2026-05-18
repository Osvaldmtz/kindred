"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { contactSchema, contactUpdateSchema } from "./schemas";
import type {
  ContactWithStatus,
  Contact,
  Interaction,
  ContactInterest,
} from "@/types/database";
import type { Database } from "@/types/database";
import type { BriefResponse } from "@/lib/anthropic/prompts";

type DBRelationshipType = Database["public"]["Enums"]["relationship_type"];

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getContacts(filters?: {
  relationship_type?: DBRelationshipType;
  search?: string;
}): Promise<ContactWithStatus[]> {
  const supabase = await createClient();

  let query = supabase
    .from("contacts_with_status")
    .select("*")
    .order("is_due", { ascending: false })
    .order("name", { ascending: true });

  if (filters?.relationship_type) {
    query = query.eq("relationship_type", filters.relationship_type);
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data ?? []) as ContactWithStatus[];
}

export async function getContact(id: string): Promise<{
  contact: Contact;
  interests: ContactInterest[];
  recentInteractions: Interaction[];
} | null> {
  const supabase = await createClient();

  const [contactRes, interestsRes, interactionsRes] = await Promise.all([
    supabase.from("contacts").select("*").eq("id", id).single(),
    supabase
      .from("contact_interests")
      .select("*")
      .eq("contact_id", id)
      .order("created_at"),
    supabase
      .from("interactions")
      .select("*")
      .eq("contact_id", id)
      .order("occurred_at", { ascending: false })
      .limit(5),
  ]);

  if (contactRes.error || !contactRes.data) return null;

  return {
    contact: contactRes.data,
    interests: interestsRes.data ?? [],
    recentInteractions: interactionsRes.data ?? [],
  };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createContact(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const raw = {
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    relationship_type: formData.get("relationship_type"),
    company: formData.get("company") ?? "",
    role: formData.get("role") ?? "",
    birthday: formData.get("birthday") ?? "",
    photo_url: formData.get("photo_url") ?? "",
    target_frequency_days: Number(formData.get("target_frequency_days") ?? 30),
    notes: formData.get("notes") ?? "",
    interests: formData.getAll("interests[]").map(String),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const { interests, ...contactData } = parsed.data;

  const { data: contact, error } = await supabase
    .from("contacts")
    .insert({
      ...contactData,
      relationship_type: contactData.relationship_type as DBRelationshipType,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error || !contact) throw new Error(error?.message ?? "Error al crear el contacto");

  // Insert interests if any
  if (interests.length > 0) {
    await supabase.from("contact_interests").insert(
      interests.map((tag) => ({
        contact_id: contact.id,
        user_id: user.id,
        tag,
      }))
    );
  }

  revalidatePath("/dashboard/contacts");
  redirect(`/dashboard/contacts/${contact.id}`);
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateContact(
  id: string,
  formData: FormData
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const raw = {
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    relationship_type: formData.get("relationship_type"),
    company: formData.get("company") ?? "",
    role: formData.get("role") ?? "",
    birthday: formData.get("birthday") ?? "",
    photo_url: formData.get("photo_url") ?? "",
    target_frequency_days: Number(formData.get("target_frequency_days") ?? 30),
    notes: formData.get("notes") ?? "",
    interests: formData.getAll("interests[]").map(String),
  };

  const parsed = contactUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const { interests, ...contactData } = parsed.data;

  const { error } = await supabase
    .from("contacts")
    .update({
      ...contactData,
      ...(contactData.relationship_type
        ? { relationship_type: contactData.relationship_type as DBRelationshipType }
        : {}),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  // Replace interests: delete all then re-insert
  await supabase
    .from("contact_interests")
    .delete()
    .eq("contact_id", id)
    .eq("user_id", user.id);

  if (interests && interests.length > 0) {
    await supabase.from("contact_interests").insert(
      interests.map((tag) => ({
        contact_id: id,
        user_id: user.id,
        tag,
      }))
    );
  }

  revalidatePath(`/dashboard/contacts/${id}`);
  revalidatePath("/dashboard/contacts");
  redirect(`/dashboard/contacts/${id}`);
}

// ─── Update frequency (inline action) ────────────────────────────────────────

export async function updateFrequency(
  contactId: string,
  days: number
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const clampedDays = Math.min(365, Math.max(1, days));

  await supabase
    .from("contacts")
    .update({ target_frequency_days: clampedDays })
    .eq("id", contactId)
    .eq("user_id", user.id);

  revalidatePath(`/dashboard/contacts/${contactId}`);
}

// ─── Cached brief (for detail page SSR) ──────────────────────────────────────

export async function getCachedBrief(
  contactId: string
): Promise<{ brief: BriefResponse; createdAt: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("contact_briefs")
    .select("content, generated_at")
    .eq("contact_id", contactId)
    .eq("user_id", user.id)
    .gt("expires_at", new Date().toISOString())
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();

  if (!data?.content) return null;

  return {
    brief: data.content as BriefResponse,
    createdAt: data.generated_at,
  };
}

// ─── Dashboard queries ────────────────────────────────────────────────────────

export async function getSuggestedActions(
  limit = 10
): Promise<ContactWithStatus[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("contacts_with_status")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_due", true)
    .order("days_since_last_interaction", { ascending: false })
    .limit(limit);

  return (data ?? []) as ContactWithStatus[];
}

export type BirthdayContact = ContactWithStatus & {
  daysUntilBirthday: number;
};

export async function getBirthdaysThisWeek(): Promise<BirthdayContact[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("contacts_with_status")
    .select("*")
    .eq("user_id", user.id)
    .not("birthday", "is", null);

  if (!data?.length) return [];

  const today = new Date();
  const todayMD = today.getMonth() * 100 + today.getDate();

  const results: BirthdayContact[] = [];

  for (const contact of data) {
    if (!contact.birthday) continue;
    const [, monthStr, dayStr] = contact.birthday.split("-");
    const bMonth = parseInt(monthStr, 10) - 1;
    const bDay = parseInt(dayStr, 10);

    // Build birthday date for this year
    const birthdayThisYear = new Date(today.getFullYear(), bMonth, bDay);
    // If birthday already passed this year, check next year
    const bMD = bMonth * 100 + bDay;
    if (bMD < todayMD) {
      birthdayThisYear.setFullYear(today.getFullYear() + 1);
    }

    const diffMs = birthdayThisYear.getTime() - today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 7) {
      results.push({ ...(contact as ContactWithStatus), daysUntilBirthday: diffDays });
    }
  }

  return results.sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
}

export type DashboardStats = {
  total_contacts: number;
  due_count: number;
  birthdays_this_week_count: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { total_contacts: 0, due_count: 0, birthdays_this_week_count: 0 };

  const { data } = await supabase
    .from("contacts_with_status")
    .select("is_due, birthday")
    .eq("user_id", user.id);

  if (!data?.length) return { total_contacts: 0, due_count: 0, birthdays_this_week_count: 0 };

  const today = new Date();
  const todayMD = today.getMonth() * 100 + today.getDate();
  let birthdayCount = 0;

  for (const row of data) {
    if (!row.birthday) continue;
    const [, m, d] = row.birthday.split("-");
    const bMD = (parseInt(m, 10) - 1) * 100 + parseInt(d, 10);
    const diff = bMD >= todayMD ? bMD - todayMD : (12 * 100 + 31) - todayMD + bMD;
    if (diff <= 7) birthdayCount++;
  }

  return {
    total_contacts: data.length,
    due_count: data.filter((r) => r.is_due).length,
    birthdays_this_week_count: birthdayCount,
  };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteContact(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/contacts");
  redirect("/dashboard/contacts");
}
