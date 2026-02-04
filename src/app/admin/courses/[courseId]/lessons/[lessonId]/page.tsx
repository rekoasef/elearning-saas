import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditLessonForm } from "@/components/admin/edit-lesson-form";

export default async function EditLessonPage({ 
  params 
}: { 
  params: { courseId: string, lessonId: string } 
}) {
  // Obtenemos los datos en el servidor
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId }
  });

  if (!lesson) notFound();

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20 px-6">
      <Link href={`/admin/courses/${params.courseId}`} className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 text-xs font-bold uppercase tracking-widest group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Volver a la estructura del curso
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-2 italic">
          Configurar <span className="text-primary">Contenido</span>
        </h1>
        <p className="text-gray-400">Estás editando la lección: <span className="text-white font-bold">{lesson.title}</span></p>
      </div>

      {/* Pasamos los datos iniciales al componente de cliente */}
      <EditLessonForm initialData={lesson} courseId={params.courseId} />
    </div>
  );
}