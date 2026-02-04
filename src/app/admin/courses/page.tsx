import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
        _count: { select: { modules: true, purchases: true } }
    }
  });

  return (
    <div className="max-w-6xl mx-auto pt-20">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black tracking-tighter">Gestionar Cursos</h1>
        <Link href="/admin/courses/new">
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl h-12 px-6 font-bold">
            <Plus className="mr-2" size={20} /> Nuevo Curso
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{course.title}</h3>
              <p className="text-sm text-gray-500">
                {course._count.modules} Módulos • {course._count.purchases} Ventas
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/courses/${course.id}`}>
                <Button variant="outline" className="rounded-xl border-white/10">
                  <Edit size={18} />
                </Button>
              </Link>
              <Button variant="destructive" className="rounded-xl">
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}