"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { toggleLessonComplete } from "@/app/dashboard/courses/actions";

export function ProgressButton({ 
  lessonId, 
  slug, 
  initialCompleted 
}: { 
  lessonId: string, slug: string, initialCompleted: boolean 
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleLessonComplete(lessonId, slug, !completed);
      setCompleted(!completed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-2xl h-12 px-6 font-bold transition-all ${
        completed 
          ? "bg-green-500/20 text-green-500 border border-green-500/30 hover:bg-green-500/30" 
          : "bg-primary text-white hover:bg-primary/90"
      }`}
    >
      <CheckCircle2 size={18} className="mr-2" />
      {completed ? "Clase Completada" : "Marcar como finalizada"}
    </Button>
  );
}