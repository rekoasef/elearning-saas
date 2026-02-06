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
    // h-[calc(100vh-5rem)] porque el Navbar ocupa 5rem (h-20)
    <div className="flex h-[calc(100vh-5rem)] bg-[#050505] overflow-hidden">
      
      {/* SIDEBAR ESCRITORIO: Oculto en móviles (hidden) */}
      <aside className="hidden md:flex w-72 flex-col fixed left-0 top-20 bottom-0 z-40 border-r border-white/5 bg-[#050505]">
        <AdminSidebar />
      </aside>

      {/* CONTENIDO PRINCIPAL: pl-0 en móvil, pl-72 en escritorio */}
      <main className="flex-1 md:pl-72 overflow-y-auto">
        <div className="p-4 md:p-10 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}