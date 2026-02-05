import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle, Lock, CheckCircle2 } from "lucide-react";

export default async function LearnLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        include: { lessons: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" }
      },
      purchases: { where: { userId: user.id } }
    }
  });

  // Si no existe el curso o no lo compró, rebota al detalle
  if (!course || course.purchases.length === 0) {
    return redirect(`/courses/${params.slug}`);
  }

  return (
    <div className="flex h-screen bg-[#050505]">
      {/* SIDEBAR DE LECCIONES */}
      <aside className="w-80 border-r border-white/5 flex flex-col bg-black">
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard" className="text-[10px] font-black uppercase text-primary mb-2 block tracking-widest">
            ← Volver al Dashboard
          </Link>
          <h2 className="text-sm font-black uppercase italic leading-tight text-white line-clamp-2">
            {course.title}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {course.modules.map((module) => (
            <div key={module.id} className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-gray-600 px-2 tracking-widest">
                {module.title}
              </h3>
              <div className="space-y-1">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${params.slug}/learn/${lesson.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all hover:bg-white/5 text-gray-400 hover:text-white group"
                  >
                    <PlayCircle size={14} className="group-hover:text-primary transition-colors" />
                    <span className="truncate">{lesson.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* CONTENIDO (VIDEO Y TEXTO) */}
      <main className="flex-1 overflow-y-auto bg-black">
        {children}
      </main>
    </div>
  );
}