import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/supabase/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth().catch(() => null);
  if (!user) redirect("/login");

  return (
    <div
      className="flex h-screen bg-background"
      data-testid="dashboard-layout"
    >
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main area */}
      <div
        className="flex flex-1 flex-col overflow-hidden"
        data-testid="dashboard-main"
      >
        <Navbar user={user} />
        <main
          className="flex-1 overflow-y-auto p-6"
          data-testid="dashboard-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
