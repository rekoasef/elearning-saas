import { createClient } from "@/lib/supabase-server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle, CheckCircle2, Trophy, Clock } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Buscamos los cursos comprados y el progreso del usuario
  const purchases = await db.purchase.findMany({
    where: { userId: user.id, status: "approved" },
    include: {
      course: {
        include: {
          modules: { include: { lessons: true } }
        }
      }
    }
  });

  const userProgress = await db.userProgress.findMany({
    where: { userId: user.id, isCompleted: true }
  });

  return (
    <div className="min-h-screen bg-black">
      {/* pt-28 en mobile y pt-32 en desktop para compensar el Navbar fixed */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 md:pt-32 pb-20">
        
        {/* Header Adaptable: Centrado en mobile, izquierda en desktop */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Trophy size={12} /> Panel de Estudiante
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              Mis <span className="text-primary italic">Cursos</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto md:mx-0">
              Gestiona tu aprendizaje y visualiza tu progreso en tiempo real.
            </p>
          </div>
          
          <div className="flex gap-4 p-2 bg-white/[0.02] border border-white/10 rounded-[2rem] self-center md:self-end">
             <div className="px-6 py-2 text-center">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Activos</p>
                <p className="text-xl font-black">{purchases.length}</p>
             </div>
             <div className="w-px bg-white/10 my-2" />
             <div className="px-6 py-2 text-center">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Meta</p>
                <p className="text-xl font-black text-primary">100%</p>
             </div>
          </div>
        </header>

        {/* GRID ADAPTABLE: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {purchases.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-gray-500 italic">Aún no tienes cursos. ¡Empieza a aprender hoy!</p>
              <Link href="/courses" className="text-primary font-bold hover:underline mt-4 inline-block">Ver catálogo</Link>
            </div>
          ) : (
            purchases.map(({ course }) => {
              const allLessons = course.modules.flatMap(m => m.lessons);
              const completedCount = userProgress.filter(p => 
                allLessons.some(l => l.id === p.lessonId)
              ).length;
              const percent = allLessons.length > 0 
                ? Math.round((completedCount / allLessons.length) * 100) 
                : 0;

              return (
                <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="group">
                  <div className="relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 h-full transition-all hover:bg-white/[0.04] hover:-translate-y-2">
                    {/* Badge de Progreso */}
                    <div className="absolute top-6 right-6 h-12 w-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center">
                      <span className="text-xs font-black text-primary italic">{percent}%</span>
                    </div>

                    <div className="mb-8">
                      <div className="p-3 bg-primary/10 w-fit rounded-2xl text-primary mb-6 group-hover:scale-110 transition-transform">
                        <PlayCircle size={28} />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight leading-tight mb-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        <Clock size={12} /> {allLessons.length} Clases totales
                      </div>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="space-y-3">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                          {percent === 100 ? "Completado" : "En curso"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}