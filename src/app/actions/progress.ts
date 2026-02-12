"use server";

import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function toggleLessonProgress(
  lessonId: string,
  slug: string,
  isCompleted: boolean
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("No autorizado");

    // Guardamos o actualizamos el progreso
    await db.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        },
      },
      update: {
        isCompleted: isCompleted,
      },
      create: {
        userId: user.id,
        lessonId: lessonId,
        isCompleted: isCompleted,
      },
    });

    // Esto limpia el caché de la página para que los checks se actualicen
    revalidatePath(`/dashboard/courses/${slug}/lessons/${lessonId}`);
    
    return { success: true };
  } catch (error) {
    console.error("[PROGRESS_ACTION]", error);
    return { success: false };
  }
}