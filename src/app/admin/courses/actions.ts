"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CourseSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  price: z.coerce.number().min(0),
  image: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
});

export async function createCourse(values: z.infer<typeof CourseSchema>) {
  // Generar slug básico: "Mi Curso Pro" -> "mi-curso-pro"
  const slug = values.title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  await db.course.create({
    data: {
      ...values,
      slug,
    },
  });

  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}

export async function createModule(courseId: string, title: string) {
  const lastModule = await db.module.findFirst({
    where: { courseId },
    orderBy: { order: "desc" }
  });

  const nextOrder = lastModule ? lastModule.order + 1 : 1;

  await db.module.create({
    data: {
      title,
      courseId,
      order: nextOrder
    }
  });

  revalidatePath(`/admin/courses/${courseId}`);
}

export async function createLesson(moduleId: string, courseId: string, title: string) {
  const lastLesson = await db.lesson.findFirst({
    where: { moduleId },
    orderBy: { order: "desc" }
  });

  const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

  await db.lesson.create({
    data: {
      title,
      moduleId,
      order: nextOrder
    }
  });

  revalidatePath(`/admin/courses/${courseId}`);
}

export async function updateLesson(
  lessonId: string, 
  courseId: string, 
  values: { title: string; videoUrl?: string; content?: string }
) {
  await db.lesson.update({
    where: { id: lessonId },
    data: { ...values }
  });

  revalidatePath(`/admin/courses/${courseId}`);
  // No redirigimos para que el admin pueda seguir editando y guardando
}