import { db } from "@/lib/db";
import { 
  Plus, 
  BookOpen, 
  Settings2, 
  ExternalLink, 
  DollarSign 
} from "lucide-react";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto pt-28 md:pt-10 px-4 md:px-6 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">
            Panel de <span className="text-primary">Cursos</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Gestioná tus contenidos, precios y configuraciones de venta.
          </p>
        </div>

        <Link 
          href="/admin/courses/new"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-[1.5rem] font-black italic flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          CREAR NUEVO CURSO
        </Link>
      </div>

      {/* GRID DE CURSOS */}
      <div className="grid grid-cols-1 gap-4">
        {courses.length === 0 ? (
          <div className="border-2 border-dashed border-white/5 rounded-[2rem] p-20 text-center">
            <p className="text-gray-600 font-bold uppercase tracking-widest">No hay cursos creados todavía</p>
          </div>
        ) : (
          courses.map((course) => (
            <div 
              key={course.id}
              className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 transition-all"
            >
              <div className="flex items-center gap-6 w-full">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <BookOpen size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-green-500 font-black text-sm">
                      <DollarSign size={14} />
                      {course.price}
                    </span>
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
                      ID: {course.id.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link
                  href={`/courses/${course.slug}`}
                  target="_blank"
                  className="flex-1 md:flex-none p-4 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                  title="Ver vista pública"
                >
                  <ExternalLink size={20} />
                </Link>
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="flex-[2] md:flex-none bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Settings2 size={18} />
                  CONFIGURAR
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}