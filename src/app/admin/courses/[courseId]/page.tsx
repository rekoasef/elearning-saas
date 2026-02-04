import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers, PlayCircle } from "lucide-react";
import { AddModuleForm, AddLessonForm } from "@/components/admin/admin-forms";

export default async function EditCoursePage({ params }: { params: { courseId: string } }) {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } }
      }
    }
  });

  if (!course) notFound();

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-20 px-6">
      <Link href="/admin/courses" className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} /> Volver a la lista
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-4">{course.title}</h1>
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded-3xl">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Estructura del curso</p>
          <AddModuleForm courseId={course.id} />
        </div>
      </div>

      <div className="space-y-8">
        {course.modules.map((module) => (
          <div key={module.id} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Layers size={20} /></div>
                <h3 className="text-xl font-black tracking-tight">{module.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-2">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group">
                  <div className="flex items-center gap-4">
                    <PlayCircle size={18} className="text-primary/50" />
                    <span className="font-medium text-gray-300">{lesson.title}</span>
                  </div>
                  <Link href={`/admin/courses/${course.id}/lessons/${lesson.id}`}>
                    <button className="text-[10px] font-black uppercase text-primary hover:underline">Editar Contenido</button>
                  </Link>
                </div>
              ))}
              {/* Formulario para añadir lección al módulo actual */}
              <AddLessonForm moduleId={module.id} courseId={course.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}