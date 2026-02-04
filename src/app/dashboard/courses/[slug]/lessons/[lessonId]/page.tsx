import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle, ChevronLeft, BookOpen, CheckCircle2, Video } from "lucide-react";
import { ProgressButton } from "@/components/course/progress-button";

export default async function LessonPage({ 
  params 
}: { 
  params: { slug: string, lessonId: string } 
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Cargamos el curso, módulos, lecciones y el progreso del usuario
  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { 
            orderBy: { order: "asc" },
            include: {
              userProgress: {
                where: { userId: user.id }
              }
            }
          }
        }
      }
    }
  });

  if (!course) notFound();

  // 2. Verificamos compra aprobada
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: { userId: user.id, courseId: course.id }
    }
  });

  if (!purchase || purchase.status !== "approved") {
    redirect(`/courses/${params.slug}`);
  }

  // 3. Lección actual y su estado de progreso
  const currentLesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === params.lessonId);

  if (!currentLesson) notFound();

  const isCompleted = currentLesson.userProgress[0]?.isCompleted || false;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* SIDEBAR NAVEGACIÓN */}
      <aside className="w-80 border-r border-white/10 bg-[#050505] overflow-y-auto hidden lg:block">
        <div className="p-6 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors mb-4 uppercase tracking-widest">
            <ChevronLeft size={14} /> Volver al panel
          </Link>
          <h2 className="font-black text-xl tracking-tighter leading-tight">{course.title}</h2>
        </div>
        
        <div className="p-4">
          {course.modules.map((module) => (
            <div key={module.id} className="mb-8">
              <div className="flex items-center gap-2 mb-4 px-2">
                <BookOpen size={14} className="text-primary" />
                <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">
                  {module.title}
                </h3>
              </div>
              <div className="space-y-1">
                {module.lessons.map((lesson) => {
                  const lessonIsDone = lesson.userProgress[0]?.isCompleted;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/dashboard/courses/${params.slug}/lessons/${lesson.id}`}
                      className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all group ${
                        lesson.id === params.lessonId 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "hover:bg-white/5 text-gray-500 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <PlayCircle size={18} className={lesson.id === params.lessonId ? "text-primary" : "text-gray-600"} />
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      {lessonIsDone && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ÁREA DE VIDEO Y CONTENIDO */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[radial-gradient(circle_at_top_right,#1e1b4b,transparent_40%)]">
        <div className="w-full bg-black aspect-video shadow-2xl relative border-b border-white/5">
          {currentLesson.videoUrl ? (
            <iframe
              src={currentLesson.videoUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <Video size={48} className="mb-4 opacity-20" />
              <p className="italic text-sm">Video no disponible</p>
            </div>
          )}
        </div>

        <div className="p-10 max-w-5xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-2">
                <span className="w-8 h-[1px] bg-primary/30"></span>
                Lección actual
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
                {currentLesson.title}
              </h1>
            </div>
            
            {/* BOTÓN DE PROGRESO */}
            <ProgressButton 
              lessonId={currentLesson.id} 
              slug={params.slug} 
              initialCompleted={isCompleted} 
            />
          </div>
          
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-inner">
            <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Recursos de la clase</h4>
            <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed text-lg">
              {currentLesson.content || "Sin descripción adicional."}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}