import { db } from "@/lib/db";
import { PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function LessonPage({
  params
}: {
  params: { lessonId: string }
}) {
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId },
    include: { module: true }
  });

  if (!lesson) notFound();

  // Convertimos la URL de YouTube común a una de Embed si es necesario
  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  const videoUrl = getEmbedUrl(lesson.videoUrl);

  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-12 space-y-8">
      {/* VIDEO PLAYER */}
      <div className="aspect-video w-full bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-primary/5 relative">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2">
            <PlayCircle size={48} strokeWidth={1} />
            <p className="font-bold text-sm uppercase tracking-widest">Esta lección no tiene video aún</p>
          </div>
        )}
      </div>

      {/* INFO DE LA CLASE */}
      <div className="space-y-6 pb-20">
        <div className="space-y-2">
          <span className="text-primary font-black uppercase text-[10px] tracking-[0.3em]">
            {lesson.module.title}
          </span>
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">
            {lesson.title}
          </h1>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

        {/* CONTENIDO EN TEXTO / MARKDOWN */}
        <div className="prose prose-invert max-w-none text-gray-400 font-medium leading-relaxed">
          {lesson.content ? (
             <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          ) : (
            <p className="italic text-gray-600">Sin descripción adicional para esta clase.</p>
          )}
        </div>
      </div>
    </div>
  );
}