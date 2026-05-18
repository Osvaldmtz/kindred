import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to dashboard (or wherever `next` points)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — redirect to login with error hint
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
