import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import {
  VOICE_CONTEXT_SYSTEM_PROMPT,
  buildVoiceContextPrompt,
  type ExtractedContext,
} from "@/lib/anthropic/prompts";
import { z } from "zod";

const requestSchema = z.object({
  transcript: z.string().min(1).max(5000),
  contactId: z.string().uuid(),
  contactName: z.string().min(1).max(200),
});

const FALLBACK: ExtractedContext = {
  birthday: null,
  context_entries: [],
  note: null,
  contact_name: null,
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { transcript, contactId, contactName } = parsed.data;

  // Verify contact belongs to user (RLS double-check)
  const { data: contact } = await supabase
    .from("contacts")
    .select("id")
    .eq("id", contactId)
    .eq("user_id", user.id)
    .single();

  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: VOICE_CONTEXT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildVoiceContextPrompt(transcript, contactName),
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let extracted: ExtractedContext = FALLBACK;
    try {
      const clean = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      extracted = JSON.parse(clean) as ExtractedContext;
    } catch {
      // Return raw transcript as note if JSON parsing fails
      extracted = { ...FALLBACK, note: transcript };
    }

    return NextResponse.json({ extracted });
  } catch {
    return NextResponse.json({ extracted: { ...FALLBACK, note: transcript } });
  }
}
