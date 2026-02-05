import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Mail, Calendar, CreditCard, 
  CheckCircle2, Clock, BookOpen, Activity, 
  TrendingUp, Award 
} from "lucide-react";

export default async function UserDetailPage({ 
  params 
}: { 
  params: { userId: string } 
}) {
  const user = await db.user.findUnique({
    where: { id: params.userId },
    include: {
      purchases: { include: { course: true }, orderBy: { createdAt: "desc" } },
      progress: { include: { lesson: true } }
    }
  });

  if (!user) notFound();

  const courses = await db.course.findMany({
    where: { id: { in: user.purchases.map(p => p.courseId) } },
    include: { modules: { include: { lessons: true } } }
  });

  const totalSpent = user.purchases.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="max-w-6xl mx-auto pt-28 md:pt-32 pb-20 px-4 md:px-6">
      {/* BOTÓN VOLVER */}
      <Link href="/admin/users" className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 text-[10px] font-black uppercase tracking-[0.2em] transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver a Alumnos
      </Link>

      {/* HEADER: PERFIL ADAPTABLE */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-16 text-center md:text-left">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary to-purple-900 flex items-center justify-center text-4xl font-black shadow-2xl shadow-primary/40 ring-4 ring-white/5">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{user.name || "Sin nombre"}</h1>
            <div className="flex flex-col md:flex-row items-center gap-3 text-gray-500 text-xs font-bold">
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-primary" /> {user.email}</span>
              <span className="hidden md:block text-white/10">|</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> Miembro desde {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {/* Card de Inversión Movil-Friendly */}
        <div className="w-full md:w-auto bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Lifetime Value (LTV)</p>
          <p className="text-4xl font-black italic tracking-tighter">${totalSpent}</p>
        </div>
      </div>

      {/* GRID DE CONTENIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* COLUMNA IZQUIERDA: PROGRESO DETALLADO (Ocupa 2/3 en Desktop) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase text-[11px] text-gray-500 tracking-[0.2em]">
              <Activity className="text-primary" size={16} /> Rendimiento por Curso
            </h2>
          </div>
          
          <div className="space-y-6">
            {courses.length === 0 && <p className="text-gray-500 italic p-10 border border-dashed border-white/10 rounded-3xl text-center">Este usuario no tiene cursos activos.</p>}
            
            {courses.map((course) => {
              const allLessons = course.modules.flatMap(m => m.lessons);
              const completedCount = user.progress.filter(p => 
                allLessons.some(l => l.id === p.lessonId) && p.isCompleted
              ).length;
              const percent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

              return (
                <div key={course.id} className="bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-[2.5rem] hover:bg-white/[0.04] transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black tracking-tight mb-2 leading-tight">{course.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-primary" /> {completedCount}/{allLessons.length} Clases
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-primary italic tracking-tighter">{percent}%</span>
                  </div>
                  
                  {/* Barra de progreso con Glow effect */}
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-primary shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all duration-1000" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL FINANCIERO */}
        <div className="space-y-8">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase text-[11px] text-gray-500 tracking-[0.2em] px-2">
            <CreditCard className="text-primary" size={16} /> Facturación
          </h2>
          <div className="space-y-4">
            {user.purchases.map((purchase) => (
              <div key={purchase.id} className="p-5 bg-white/[0.02] border border-white/10 rounded-[2rem] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full tracking-widest">Aprobado</span>
                  <span className="text-lg font-black italic tracking-tighter">${purchase.amount}</span>
                </div>
                <p className="text-sm font-bold text-gray-200">{purchase.course.title}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                   <Clock size={10} /> {new Date(purchase.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}