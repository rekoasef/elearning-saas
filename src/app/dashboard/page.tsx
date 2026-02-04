import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, LayoutDashboard, Sparkles, Rocket, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { FadeIn } from "@/components/framer-wrapper";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Traemos los cursos con sus módulos, lecciones y el progreso del usuario actual
  const allCourses = await db.course.findMany({
    include: {
      purchases: { where: { userId: user?.id } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              userProgress: { where: { userId: user?.id } }
            }
          }
        }
      }
    }
  });

  // 2. Filtramos por estado de compra
  const myCourses = allCourses.filter(course => course.purchases.length > 0);
  const recommendedCourses = allCourses.filter(course => course.purchases.length === 0);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      {/* Fondos decorativos con gradientes radiales */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#1e1b4b,transparent_40%)] opacity-40" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,#1e1b4b,transparent_40%)] opacity-20" />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- ENCABEZADO --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4">
              <LayoutDashboard size={14} />
              <span>Panel de Alumno</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter">
              Mi <span className="text-primary">Progreso</span>
            </h1>
          </div>
          
          <div className="flex gap-4 p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
             <div className="px-6 py-3 text-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Mis Cursos</p>
                <p className="text-xl font-black">{myCourses.length}</p>
             </div>
             <div className="w-px bg-white/10 my-2" />
             <div className="px-6 py-3 text-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Completados</p>
                <p className="text-xl font-black">
                  {myCourses.filter(c => {
                    const lessons = c.modules.flatMap(m => m.lessons);
                    return lessons.length > 0 && lessons.every(l => l.userProgress[0]?.isCompleted);
                  }).length}
                </p>
             </div>
          </div>
        </header>

        {/* --- SECCIÓN: MIS CURSOS (ADQUIRIDOS) --- */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <Rocket className="text-primary" size={24} />
            <h2 className="text-3xl font-black tracking-tighter uppercase italic opacity-90">Continuar Aprendiendo</h2>
          </div>

          {myCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myCourses.map((course, index) => {
                // Lógica de cálculo de progreso dinámico
                const allLessons = course.modules.flatMap(m => m.lessons);
                const totalLessons = allLessons.length;
                const completedLessons = allLessons.filter(l => l.userProgress[0]?.isCompleted).length;
                const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                const firstLessonId = allLessons[0]?.id;

                return (
                  <FadeIn key={course.id} delay={index * 0.1}>
                    <div className="group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.06] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
                      <div className="aspect-video w-full relative overflow-hidden">
                        {course.image && (
                            <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      </div>

                      <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight">
                            {course.title}
                          </h3>
                          {progressPercentage === 100 && <CheckCircle2 className="text-green-500" size={24} />}
                        </div>

                        {/* BARRA DE PROGRESO */}
                        <div className="space-y-3 mb-8">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <span>Progreso del curso</span>
                            <span className="text-primary">{progressPercentage}%</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(124,58,237,0.5)]" 
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        <Link href={`/dashboard/courses/${course.slug}/lessons/${firstLessonId}`}>
                          <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all">
                            <Play size={18} fill="currentColor" className="mr-2" /> 
                            {progressPercentage > 0 ? "Continuar" : "Empezar ahora"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          ) : (
            <div className="p-20 border border-dashed border-white/10 rounded-[2.5rem] text-center bg-white/[0.01]">
               <p className="text-gray-500 font-medium">No tienes cursos activos. ¡Explora nuestras recomendaciones abajo!</p>
            </div>
          )}
        </section>

        {/* --- SECCIÓN: RECOMENDADOS (PARA COMPRAR) --- */}
        {recommendedCourses.length > 0 && (
          <section className="pt-16 border-t border-white/5">
            <div className="flex items-center gap-3 mb-10">
              <Sparkles className="text-primary" size={24} />
              <h2 className="text-3xl font-black tracking-tighter uppercase italic opacity-80 text-gray-400">Próximos Desafíos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedCourses.map((course, index) => (
                <FadeIn key={course.id} delay={0.2 + (index * 0.1)}>
                  <div className="group relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-700">
                    <div className="aspect-video w-full bg-white/5 relative overflow-hidden">
                      {course.image && (
                          <img src={course.image} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-black tracking-tight mb-8">{course.title}</h3>
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="outline" className="w-full h-14 border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all">
                          Ver detalles del curso
                        </Button>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}