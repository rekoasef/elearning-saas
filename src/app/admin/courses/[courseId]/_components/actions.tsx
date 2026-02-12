"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { deleteCourse } from "@/app/actions/delete-actions";

interface ActionsProps {
  courseId: string;
}

export const Actions = ({ courseId }: ActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await deleteCourse(courseId);
      
      if (res.success) {
        toast.success("Curso eliminado");
        router.push("/admin/courses");
      } else {
        toast.error("Error al eliminar el curso");
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
        className="p-3.5 bg-red-600/10 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
      >
        <Trash2 size={18} />
      </button>
    </ConfirmModal>
  );
};