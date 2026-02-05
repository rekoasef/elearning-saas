import { db } from "@/lib/db";
import Link from "next/link";
import { User, Mail, Calendar, ChevronRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function UsersAdminPage() {
  const users = await db.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    include: {
      purchases: { where: { status: "approved" } },
      _count: { select: { progress: true } }
    }
  });

  return (
    <div className="space-y-8 px-4 md:px-6 pt-28 md:pt-10 pb-20">
      {/* HEADER CON BUSCADOR RESPONSIVO */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">
            Gestión de <span className="text-primary">Alumnos</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Administra los accesos y visualiza el rendimiento de tu comunidad.
          </p>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <Input 
              placeholder="Buscar por email..." 
              className="pl-10 bg-white/5 border-white/10 rounded-xl h-12"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* CONTENEDOR DE TABLA CON SCROLL HORIZONTAL */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide"> 
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Alumno</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">Inversión</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">Cursos</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Fecha Registro</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">ADN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-black shadow-inner">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-200 group-hover:text-primary transition-colors">
                          {user.name || "Sin nombre"}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="text-sm font-black italic">
                      ${user.purchases.reduce((acc, p) => acc + p.amount, 0)}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-primary italic">
                      {user.purchases.length}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                      <Calendar size={14} className="text-gray-600" />
                      {new Date(user.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <Link href={`/admin/users/${user.id}`}>
                      <button className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-primary transition-all group-hover:scale-110 shadow-lg">
                        <ChevronRight size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
        Fin de la lista - {users.length} alumnos registrados
      </p>
    </div>
  );
}