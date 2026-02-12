import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Clock, BarChart, Search } from "lucide-react";

export default async function CoursesPage() {
  // Solo traemos los cursos publicados
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER DEL CATÁLOGO */}
        <header className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            Catálogo 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white">
            Todos los <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Programas</span>
          </h1>
          <p className="text-gray-500 max-w-xl font-medium">
            Formaciones diseñadas para llevarte de cero a profesional en tiempo récord con las tecnologías que el mercado exige hoy.
          </p>
        </header>

        {/* GRID DE CURSOS */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-[3rem]">
            <Search className="text-gray-700 mb-4" size={40} />
            <p className="text-gray-500 italic">Próximamente nuevos lanzamientos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const lessonsCount = course.modules.flatMap(m => m.lessons).length;
              
              return (
                <Link key={course.id} href={`/course/${course.slug}`} className="group">
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-primary/50 hover:-translate-y-2 h-full flex flex-col">
                    
                    {/* Imagen del Curso */}
                    <div className="relative aspect-video">
                      <Image
                        fill
                        src={course.imageUrl || "/placeholder.jpg"}
                        alt={course.title}
                        className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                      
                      {/* Badge de Precio Flotante */}
                      <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
                         <span className="text-primary font-black italic text-lg">${course.price}</span>
                      </div>
                    </div>

                    {/* Contenido de la Card */}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-widest text-gray-500">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                          {course.category || "Development"}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black tracking-tighter uppercase italic text-white mb-6 leading-tight group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>

                      <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                          <PlayCircle size={14} className="text-primary" />
                          <span>{lessonsCount} Clases</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                          <BarChart size={14} className="text-primary" />
                          <span>Pro</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}