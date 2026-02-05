"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// ESQUEMA DE VALIDACIÓN
// Relajamos la validación de 'image' para que acepte strings de cualquier tipo
const CourseSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres").optional().or(z.literal("")),
  price: z.coerce.number().min(0),
  image: z.string().optional().nullable(), 
  isPublished: z.boolean().default(false),
});

// ACTUALIZAR CURSO
export async function updateCourse(courseId: string, values: z.infer<typeof CourseSchema>) {
  try {
    const slug = values.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    
    // Desestructuración para control total del tipado
    const { isPublished, title, description, price, image } = values;

    const updated = await db.course.update({
      where: { id: courseId },
      data: { 
        title,
        description: description || "",
        price,
        image: image || null,
        published: Boolean(isPublished),
        slug 
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    
    return { success: true, data: updated };
  } catch (error) {
    console.error("[UPDATE_COURSE_ERROR]:", error);
    return { error: "No se pudo actualizar el curso. Verifica los campos." };
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
      data: { 
        title, 
        courseId, 
        order: nextOrder 
      }
    });
    
    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[CREATE_MODULE_ERROR]:", error);
    return { error: "Error al crear módulo" };
  }
}

// CREAR LECCIÓN
export async function createLesson(moduleId: string, courseId: string, title: string) {
  try {
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
    return { success: true };
  } catch (error) {
    console.error("[CREATE_LESSON_ERROR]:", error);
    return { error: "Error al crear lección" };
  }
}

// ACTUALIZAR LECCIÓN (Incluye video y contenido)
export async function updateLesson(
  lessonId: string, 
  courseId: string, 
  values: { title: string; videoUrl?: string; content?: string }
) {
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
    console.error("[UPDATE_LESSON_ERROR]:", error);
    return { error: "Error al actualizar lección" };
  }
}