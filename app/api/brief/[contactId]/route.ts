import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import {
  BRIEF_SYSTEM_PROMPT,
  FALLBACK_BRIEF,
  buildBriefUserPrompt,
  type BriefResponse,
  type ContactContext,
} from "@/lib/anthropic/prompts";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 1024;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  const { contactId } = await params;
  const supabase = await createClient();

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse optional force-regenerate flag
  const body = await req.json().catch(() => ({})) as { force?: boolean };
  const force = body.force === true;

  // Check cache (unless forced)
  if (!force) {
    const { data: cached } = await supabase
      .from("contact_briefs")
      .select("content, generated_at")
      .eq("contact_id", contactId)
      .eq("user_id", user.id)
      .gt("expires_at", new Date().toISOString())
      .order("generated_at", { ascending: false })
      .limit(1)
      .single();

    if (cached?.content) {
      console.log(`[Brief] Cache hit for contact ${contactId}`);
      return NextResponse.json({
        brief: cached.content as BriefResponse,
        cached: true,
        generated_at: cached.generated_at,
      });
    }
  }

  // Load contact data (verify ownership via RLS)
  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .eq("user_id", user.id)
    .single();

  if (contactError || !contact) {
    console.error("[Brief] Contact not found:", contactError?.message);
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  // Load interests
  const { data: interests } = await supabase
    .from("contact_interests")
    .select("tag")
    .eq("contact_id", contactId);

  // Load recent interactions (last 5)
  const { data: interactions } = await supabase
    .from("interactions")
    .select("type, note, occurred_at")
    .eq("contact_id", contactId)
    .order("occurred_at", { ascending: false })
    .limit(5);

  // Build context
  const ctx: ContactContext = {
    name: contact.name,
    relationshipType: contact.relationship_type ?? "friend",
    company: contact.company,
    role: contact.role,
    birthday: contact.birthday,
    interests: (interests ?? []).map((i) => i.tag),
    notes: contact.notes,
    recentInteractions: (interactions ?? []).map((i) => ({
      occurredAt: i.occurred_at,
      type: i.type,
      note: i.note,
    })),
  };

  // Generate brief with Anthropic
  let brief: BriefResponse;
  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: BRIEF_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildBriefUserPrompt(ctx) }],
    });

    const rawText =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    // Strip markdown fences if present
    const jsonText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(jsonText) as BriefResponse;

    // Validate shape
    if (!parsed.summary || !Array.isArray(parsed.connection_points)) {
      throw new Error("Invalid brief shape from AI");
    }

    brief = parsed;
    console.log(`[Brief] Generated for ${contact.name} (${contactId})`);
  } catch (err) {
    console.error("[Brief] AI generation failed:", err);
    brief = FALLBACK_BRIEF;
  }

  // Save to cache (upsert: delete old + insert new)
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await supabase
      .from("contact_briefs")
      .delete()
      .eq("contact_id", contactId)
      .eq("user_id", user.id);

    await supabase.from("contact_briefs").insert({
      contact_id: contactId,
      user_id: user.id,
      content: brief,
      expires_at: expiresAt,
    });
  } catch (cacheErr) {
    console.error("[Brief] Failed to save cache:", cacheErr);
    // Non-fatal — return brief anyway
  }

  return NextResponse.json({ brief, cached: false });
}
