import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { User, CreditCard, Calendar, ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Traemos el historial de compras
  const purchases = await db.purchase.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
      {/* HEADER PERFIL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-[2rem] bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
            <User size={40} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">MI PERFIL</h1>
            <p className="text-gray-500 font-medium">{user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* INFO CARD */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
              <ShieldCheck size={14} /> Datos de la cuenta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase mb-1">Email Registrado</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase mb-1">ID de Usuario</p>
                <p className="text-white font-mono text-xs truncate">{user.id}</p>
              </div>
            </div>
          </section>

          {/* TABLA DE COMPRAS */}
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 px-4">Historial de Transacciones</h3>
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden">
              {purchases.length === 0 ? (
                <p className="p-8 text-center text-gray-600 italic">No hay compras registradas.</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl text-gray-400">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase italic tracking-tighter">
                            {purchase.course.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                            <Calendar size={10} />
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">${purchase.amount}</p>
                        <p className="text-[9px] font-black uppercase text-green-500 tracking-widest">{purchase.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* SIDEBAR PERFIL (STATS) */}
        <div className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-[2.5rem] p-8 text-center">
             <Trophy size={32} className="text-primary mx-auto mb-4" />
             <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Cursos Adquiridos</p>
             <p className="text-4xl font-black text-white">{purchases.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icono faltante en los imports del código anterior
import { Trophy } from "lucide-react";