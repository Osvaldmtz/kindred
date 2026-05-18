import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import {
  VOICE_CONTEXT_SYSTEM_PROMPT,
  buildVoiceContextPrompt,
  type ExtractedContext,
} from "@/lib/anthropic/prompts";
import { transcribeAudioWithWhisper } from "@/lib/openai/transcribe-audio";
import { z } from "zod";

export const maxDuration = 120;

const requestSchema = z.object({
  transcript: z.string().min(1).max(5000),
  contactId: z.string().uuid(),
  contactName: z.string().min(1).max(200),
});

/** Límite conservador para cuerpo multipart en Vercel (≈4.5 MB en muchos planes). */
const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

const FALLBACK: ExtractedContext = {
  birthday: null,
  context_entries: [],
  note: null,
  contact_name: null,
};

async function runExtraction(
  transcript: string,
  contactName: string
): Promise<ExtractedContext> {
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
      message.content[0]?.type === "text" ? message.content[0].text : "";

    try {
      const clean = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      return JSON.parse(clean) as ExtractedContext;
    } catch {
      return { ...FALLBACK, note: transcript };
    }
  } catch {
    return { ...FALLBACK, note: transcript };
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let transcript: string;
  let contactId: string;
  let contactName: string;

  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
    }

    const audio = form.get("audio");
    const cid = form.get("contactId");
    const cname = form.get("contactName");

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
    }

    const ids = z
      .object({
        contactId: z.string().uuid(),
        contactName: z.string().min(1).max(200),
      })
      .safeParse({
        contactId: typeof cid === "string" ? cid : "",
        contactName: typeof cname === "string" ? cname : "",
      });

    if (!ids.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    contactId = ids.data.contactId;
    contactName = ids.data.contactName;

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "Audio demasiado grande (máx. ~4 MB). Graba una nota más corta." },
        { status: 413 }
      );
    }

    if (audio.size < 256) {
      return NextResponse.json({ error: "Grabación vacía o muy corta" }, { status: 400 });
    }

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
      const buf = await audio.arrayBuffer();
      transcript = await transcribeAudioWithWhisper(
        buf,
        audio.name || "recording.webm",
        audio.type || "audio/webm"
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transcription failed";
      if (msg.includes("OPENAI_API_KEY")) {
        return NextResponse.json(
          {
            error:
              "Transcripción no disponible: falta OPENAI_API_KEY en el servidor.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "No pudimos transcribir el audio. Intenta de nuevo." },
        { status: 502 }
      );
    }

    if (transcript.length < 3) {
      return NextResponse.json(
        { error: "No se detectó habla clara en la grabación." },
        { status: 400 }
      );
    }
  } else {
    const body = await request.json().catch(() => null);
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    transcript = parsed.data.transcript;
    contactId = parsed.data.contactId;
    contactName = parsed.data.contactName;

    const { data: contact } = await supabase
      .from("contacts")
      .select("id")
      .eq("id", contactId)
      .eq("user_id", user.id)
      .single();

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
  }

  const extracted = await runExtraction(transcript, contactName);
  return NextResponse.json({ extracted, transcript });
}
