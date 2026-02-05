import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { db } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* COLUMNA IZQUIERDA: SIDEBAR */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50">
        <AdminSidebar />
      </aside>

      {/* COLUMNA DERECHA: CONTENIDO */}
      <main className="flex-1 md:pl-72 overflow-y-auto">
        <div className="p-4 md:p-10 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}