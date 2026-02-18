"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const CourseSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0),
  image: z.string().optional().nullable(), 
  isPublished: z.boolean().default(false),
});

// ACTUALIZAR CURSO - CORREGIDO
export async function updateCourse(courseId: string, values: z.infer<typeof CourseSchema>) {
  try {
    // Generamos un slug limpio basado en el título actual
    const slug = values.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Quita caracteres especiales
      .replace(/[\s_-]+/g, '-')  // Reemplaza espacios y guiones bajos por guiones
      .replace(/^-+|-+$/g, '');   // Quita guiones al inicio o final

    const updated = await db.course.update({
      where: { id: courseId },
      data: { 
        title: values.title,
        description: values.description || "",
        price: values.price,
        image: values.image || null,
        isPublished: values.isPublished,
        published: values.isPublished, 
        slug: slug // <--- IMPORTANTE: Actualizamos el slug
      },
    });

    // Limpiamos caché de todo el sitio para que los links nuevos funcionen
    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath(`/courses/${slug}`);
    revalidatePath(`/admin/courses/${courseId}`);
    
    return { success: true, data: updated };
  } catch (error) {
    console.error("[UPDATE_COURSE_ERROR]:", error);
    return { error: "Error al actualizar el curso" };
  }
}

// CREAR CURSO
export async function createCourse(values: z.infer<typeof CourseSchema>) {
  try {
    const slug = values.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    await db.course.create({
      data: { 
        ...values, 
        description: values.description || "",
        slug 
      },
    });
    revalidatePath("/admin/courses");
    redirect("/admin/courses");
  } catch (error) {
    console.error("[CREATE_COURSE_ERROR]:", error);
    return { error: "Error al crear el curso." };
  }
}

// CREAR MÓDULO
export async function createModule(courseId: string, title: string) {
  try {
    const lastModule = await db.module.findFirst({
      where: { courseId },
      orderBy: { order: "desc" }
    });
    const nextOrder = lastModule ? lastModule.order + 1 : 1;
    await db.module.create({
      data: { title, courseId, order: nextOrder }
    });
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    return { error: "Error al crear módulo" };
  }
}

// CREAR LECCIÓN
export async function createLesson(moduleId: string, courseId: string, title: string) {
  try {
    const moduleExists = await db.module.findUnique({ where: { id: moduleId } });
    if (!moduleExists) return { error: "El módulo no existe." };

    const lastLesson = await db.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: "desc" }
    });
    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;
    const lesson = await db.lesson.create({
      data: { title, moduleId, order: nextOrder }
    });
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, lesson };
  } catch (error) {
    return { error: "Error al crear lección" };
  }
}

// ACTUALIZAR LECCIÓN
export async function updateLesson(lessonId: string, courseId: string, values: { title: string; videoUrl?: string; content?: string }) {
  try {
    await db.lesson.update({
      where: { id: lessonId },
      data: { 
        title: values.title,
        videoUrl: values.videoUrl || null,
        content: values.content || null
      }
    });
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar lección" };
  }
}

// ACTUALIZAR TITULO MÓDULO
export async function updateModuleTitle(moduleId: string, courseId: string, title: string) {
  try {
    await db.module.update({
      where: { id: moduleId },
      data: { title }
    });
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// ACTUALIZAR TITULO LECCIÓN
export async function updateLessonTitle(lessonId: string, courseId: string, title: string) {
  try {
    await db.lesson.update({
      where: { id: lessonId },
      data: { title }
    });
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}