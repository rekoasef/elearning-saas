"use server"

import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function toggleLessonComplete(lessonId: string, slug: string, isCompleted: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("No autorizado");

  await db.userProgress.upsert({
    where: {
      userId_lessonId: { userId: user.id, lessonId }
    },
    update: { isCompleted },
    create: {
      userId: user.id,
      lessonId,
      isCompleted
    }
  });

  // Esto refresca la UI automáticamente
  revalidatePath(`/dashboard/courses/${slug}/lessons/${lessonId}`);
}