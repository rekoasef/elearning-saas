import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Image from "next/image";
import EnrollmentButton from "./enrollment-button"; // FIX: Importación por defecto (sin llaves)
import { BookOpen, Clock, BarChart, CheckCircle2 } from "lucide-react";

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        include: {
          lessons: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) notFound();

  const purchase = user ? await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  }) : null;

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{course.title}</h1>
            <p className="text-xl text-gray-400 leading-relaxed">{course.description}</p>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5">
            {/* IMPORTANTE: Si course.image es una URL externa, 
              debés configurarla en next.config.js 
            */}
            <Image
              src={course.image || "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop"} 
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contenido del programa</h2>
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div key={module.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <h3 className="font-bold flex items-center gap-3">
                    <BookOpen className="text-primary" size={20} />
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{module.lessons.length} lecciones</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 p-8 bg-white/5 border border-white/10 rounded-3xl space-y-8 backdrop-blur-xl">
            <div className="space-y-2">
              <p className="text-gray-400 font-medium">Inversión única</p>
              <p className="text-5xl font-black text-primary">${course.price}</p>
            </div>

            <div className="space-y-4">
              {purchase ? (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-500">
                  <CheckCircle2 size={20} />
                  <p className="font-bold text-sm">Ya tienes acceso a este curso</p>
                </div>
              ) : (
                <EnrollmentButton 
                  courseId={course.id} 
                  courseSlug={course.slug}
                  userId={user?.id}
                  price={course.price}
                />
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Clock size={16} className="text-primary" />
                Acceso de por vida
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}