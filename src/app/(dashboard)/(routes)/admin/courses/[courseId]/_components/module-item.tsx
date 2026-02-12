"use client";

import { Trash } from "lucide-react";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { deleteModule } from "@/app/actions/delete-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const ModuleDeleteButton = ({ 
  moduleId, 
  slug 
}: { 
  moduleId: string, 
  slug: string 
}) => {
  const router = useRouter();

  const onDelete = async () => {
    const res = await deleteModule(moduleId, slug);
    if (res.success) {
      toast.success("Módulo eliminado");
      router.refresh();
    } else {
      toast.error("No se pudo eliminar el módulo");
    }
  };

  return (
    <ConfirmModal onConfirm={onDelete}>
      <button className="text-zinc-500 hover:text-red-500 transition-colors">
        <Trash className="h-4 w-4" />
      </button>
    </ConfirmModal>
  );
};