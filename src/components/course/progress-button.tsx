"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { toggleLessonProgress } from "@/app/actions/progress";
import { useRouter } from "next/navigation";

interface ProgressButtonProps {
  lessonId: string;
  slug: string;
  initialCompleted: boolean;
}

export const ProgressButton = ({
  lessonId,
  slug,
  initialCompleted,
}: ProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(initialCompleted);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const newStatus = !completed;
      
      await toggleLessonProgress(lessonId, slug, newStatus);
      
      setCompleted(newStatus);
      router.refresh(); // Esto actualiza el Sidebar instantáneamente
    } catch {
      console.log("Error al actualizar progreso");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isLoading ? Loader2 : completed ? CheckCircle2 : Circle;

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
        completed 
          ? "bg-green-500/10 text-green-500 border border-green-500/20" 
          : "bg-primary text-black hover:opacity-90 shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
      }`}
    >
      <Icon className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      {completed ? "Lección Completada" : "Marcar como Finalizada"}
    </button>
  );
};