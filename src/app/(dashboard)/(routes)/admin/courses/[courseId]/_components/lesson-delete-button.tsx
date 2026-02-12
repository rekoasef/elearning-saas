"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { deleteLesson } from "@/app/actions/delete-actions";

interface LessonDeleteButtonProps {
  lessonId: string;
  slug: string;
};

export const LessonDeleteButton = ({ lessonId, slug }: LessonDeleteButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await deleteLesson(lessonId, slug);
      
      if (res.success) {
        toast.success("Lección eliminada");
        router.refresh();
      } else {
        toast.error("Error al eliminar la lección");
      }
    } catch {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ConfirmModal onConfirm={onDelete}>
      <button 
        disabled={isLoading}
        className="text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        <Trash size={16} />
      </button>
    </ConfirmModal>
  )
}