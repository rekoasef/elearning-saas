import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { EnrollmentButton } from "./enrollment-button"; 
import { CheckCircle2, PlayCircle, Lock, BookOpen } from "lucide-react";
import Image from "next/image";

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        include: { lessons: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!course) notFound();

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const purchase = user ? await db.purchase.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } }
  }) : null;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <BookOpen size={12} /> Formación Profesional
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              {course.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl font-medium">
              {course.description}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase tracking-tight">Contenido del <span className="text-primary">Programa</span></h3>
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div key={module.id} className="bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden">
                  <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between font-black uppercase text-[10px] tracking-widest text-gray-400">
                    <span>{module.title}</span>
                    <span className="text-primary/50">{module.lessons.length} Clases</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl group transition-all hover:bg-black/40">
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500 group-hover:text-gray-300">
                          <PlayCircle size={16} className="text-primary/40 group-hover:text-primary" />
                          {lesson.title}
                        </div>
                        {!purchase && <Lock size={14} className="text-gray-800" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 space-y-8 backdrop-blur-xl">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
              <Image 
                src={course.image || "/placeholder.jpg"} 
                alt={course.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <div className="space-y-2 text-center">
              <div className="text-5xl font-black italic text-white leading-none">
                ${course.price}
                <span className="text-xs text-gray-600 not-italic font-bold ml-2">ARS</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Pago único con acceso ilimitado</p>
            </div>

            {purchase ? (
              <a 
                href={`/courses/${course.slug}/learn`}
                className="block w-full bg-white text-black text-center py-5 rounded-2xl font-black italic uppercase transition-all hover:bg-primary"
              >
                Ingresar al Player
              </a>
            ) : (
              <EnrollmentButton courseId={course.id} />
            )}

            <div className="grid grid-cols-1 gap-4 pt-6 border-t border-white/5">
              {[
                "Soporte prioritario 24/7",
                "Certificado de finalización",
                "Acceso de por vida",
                "Material descargable"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-500">
                  <CheckCircle2 size={14} className="text-primary" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}