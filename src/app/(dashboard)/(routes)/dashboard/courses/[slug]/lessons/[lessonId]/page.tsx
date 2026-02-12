import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { PlayCircle, ChevronLeft, CheckCircle2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ProgressButton } from "@/components/course/progress-button";

export default async function LessonPage({
  params
}: {
  params: { slug: string; lessonId: string }
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Traemos el curso completo para armar el Sidebar
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

  // Buscamos la lección actual
  const currentLesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === params.lessonId);

  if (!currentLesson) notFound();

  // Verificamos compra
  const purchase = await db.purchase.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } }
  });

  if (!purchase || purchase.status !== "approved") {
    redirect(`/course/${params.slug}`);
  }

  const isCompleted = currentLesson.userProgress[0]?.isCompleted || false;

  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
    return url;
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* SIDEBAR IZQUIERDO */}
      <aside className="w-80 border-r border-white/10 bg-[#050505] overflow-y-auto hidden lg:block">
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary mb-4">
            <ChevronLeft size={14} /> Volver al panel
          </Link>
          <h2 className="font-black text-lg tracking-tighter uppercase italic leading-tight">{course.title}</h2>
        </div>
        <div className="p-4 space-y-8">
          {course.modules.map((module) => (
            <div key={module.id}>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 px-2">{module.title}</p>
              <div className="space-y-1">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/dashboard/courses/${params.slug}/lessons/${lesson.id}`}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                      lesson.id === params.lessonId ? "bg-primary text-black" : "hover:bg-white/5 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <PlayCircle size={14} />
                      <span className="truncate">{lesson.title}</span>
                    </div>
                    {lesson.userProgress[0]?.isCompleted && (
                      <CheckCircle2 size={14} className={lesson.id === params.lessonId ? "text-black" : "text-primary"} />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,#1e1b4b,transparent_40%)]">
        <div className="max-w-5xl mx-auto p-6 lg:p-12 space-y-8">
          {/* VIDEO */}
          <div className="aspect-video w-full bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
            <iframe
              src={getEmbedUrl(currentLesson.videoUrl) || ""}
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          {/* HEADER DE LECCIÓN Y BOTÓN */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <span className="text-primary font-black uppercase text-[10px] tracking-[0.3em]">Módulo Actual</span>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">{currentLesson.title}</h1>
            </div>

            {/* AQUÍ ESTÁ EL BOTÓN DE PROGRESO */}
            <ProgressButton 
              lessonId={currentLesson.id}
              slug={params.slug}
              initialCompleted={isCompleted}
            />
          </div>

          {/* CONTENIDO TEXTO */}
          <div className="prose prose-invert max-w-none text-gray-400 font-medium leading-relaxed">
            {currentLesson.content ? (
              <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            ) : (
              <p className="italic text-gray-600">Esta clase no tiene descripción adicional.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}