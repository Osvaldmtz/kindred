import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { getInitials } from "@/lib/utils";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "";
  const initials = getInitials(email.split("@")[0] ?? "");

  return (
    <>
      <Toaster position="top-center" richColors />

      {/* Desktop: sidebar layout */}
      <Sidebar userEmail={email} userInitials={initials} />

      {/* Main content — offset for desktop sidebar */}
      <div className="min-h-screen md:pl-60">
        {children}
      </div>

      {/* Mobile: bottom nav */}
      <BottomNav />
    </>
  );
}
