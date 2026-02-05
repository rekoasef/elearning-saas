import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditLessonForm } from "./edit-lesson-form"; // Componente que crearemos abajo
import { ArrowLeft, Video, FileText, Layout } from "lucide-react";
import Link from "next/link";

export default async function LessonEditPage({
  params
}: {
  params: { courseId: string; lessonId: string }
}) {
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId }
  });

  if (!lesson) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
        <div>
          <Link 
            href={`/admin/courses/${params.courseId}`} 
            className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2"
          >
            <ArrowLeft size={12} /> Volver a la estructura
          </Link>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">
            Editar <span className="text-primary">Clase</span>
          </h1>
          <p className="text-gray-500 text-xs font-medium mt-1">Configura el video y el material de estudio.</p>
        </div>
      </div>

      <EditLessonForm 
        lesson={lesson} 
        courseId={params.courseId} 
      />
    </div>
  );
}