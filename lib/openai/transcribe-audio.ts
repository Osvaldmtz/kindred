/**
 * Whisper API (OpenAI) — solo servidor. Nunca exponer OPENAI_API_KEY al cliente.
 */
export async function transcribeAudioWithWhisper(
  buffer: ArrayBuffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const fileBlob = new Blob([buffer], { type: mimeType || "application/octet-stream" });
  const form = new FormData();
  form.append("file", fileBlob, filename);
  form.append("model", "whisper-1");
  form.append("language", "es");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Whisper API error ${res.status}: ${errText}`);
  }

  const data: unknown = await res.json();
  if (typeof data !== "object" || data === null || !("text" in data)) {
    throw new Error("Invalid Whisper API response");
  }
  const text = (data as { text: unknown }).text;
  if (typeof text !== "string") {
    throw new Error("Whisper returned no text");
  }

  return text.trim();
}
