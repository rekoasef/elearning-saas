import { createClient } from "@/lib/supabase-server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verificamos el rol en nuestra base de datos
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard"); // Si no es admin, lo echamos al dashboard
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar Admin Lateral */}
      <aside className="w-64 border-r border-white/10 p-6 hidden md:block">
        <h2 className="text-xl font-black mb-10 tracking-tighter">Admin <span className="text-primary">Panel</span></h2>
        <nav className="space-y-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gestión</p>
          <a href="/admin/courses" className="block p-3 rounded-xl bg-primary/10 text-primary font-bold border border-primary/20">Cursos</a>
          <a href="/admin/users" className="block p-3 rounded-xl text-gray-400 hover:bg-white/5">Usuarios</a>
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}