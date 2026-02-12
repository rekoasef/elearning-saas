import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function CourseHomePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Buscamos el curso y su primera lección
  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } }
        }
      }
    }
  });

  if (!course) redirect("/dashboard");

  const firstLesson = course.modules[0]?.lessons[0];

  // Si tiene lecciones, lo mandamos directo a la primera para evitar el 404
  if (firstLesson) {
    redirect(`/dashboard/courses/${params.slug}/lessons/${firstLesson.id}`);
  }

  return (
    <div className="flex h-screen items-center justify-center text-white">
      <p>Este curso aún no tiene lecciones publicadas.</p>
    </div>
  );
}