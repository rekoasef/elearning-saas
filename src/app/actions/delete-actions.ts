"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ELIMINAR CURSO
export async function deleteCourse(courseId: string) {
  try {
    await db.course.delete({
      where: { id: courseId }
    });
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el curso" };
  }
}

// ELIMINAR MÓDULO
export async function deleteModule(moduleId: string, slug: string) {
  try {
    await db.module.delete({
      where: { id: moduleId }
    });
    revalidatePath(`/admin/courses/${slug}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// ELIMINAR LECCIÓN
export async function deleteLesson(lessonId: string, slug: string) {
  try {
    await db.lesson.delete({
      where: { id: lessonId }
    });
    revalidatePath(`/admin/courses/${slug}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}