import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditCourseForm } from "./edit-course-form";
import { CourseStructure } from "./course-structure"; // Importamos el nuevo componente
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function CourseConfigPage({ 
  params 
}: { 
  params: { courseId: string } 
}) {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      modules: {
        include: {
          lessons: { orderBy: { order: "asc" } }
        },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!course) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
        <div>
          <Link href="/admin/courses" className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2">
            <ArrowLeft size={12} /> Volver a cursos
          </Link>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">
            Configuración del <span className="text-primary">Contenido</span>
          </h1>
        </div>
        <Link 
          href={`/courses/${course.slug}`} 
          target="_blank"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Ver Vista Pública <ExternalLink size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <EditCourseForm course={course} />
        </div>

        <div className="lg:col-span-2">
          {/* Aquí inyectamos la interactividad */}
          <CourseStructure courseId={course.id} modules={course.modules} />
        </div>
      </div>
    </div>
  );
}