"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

export const ConfirmModal = ({ children, onConfirm }: ConfirmModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-950 border-white/10 text-white rounded-[2rem]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-black uppercase italic text-white">
            ¿Estás completamente seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Esta acción no se puede deshacer. Se eliminarán permanentemente todos los datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="bg-white/5 border-white/10 rounded-xl hover:bg-white/10 hover:text-white border-none">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.stopPropagation(); // Evita que el evento suba
              onConfirm();
            }}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold border-none"
          >
            Eliminar definitivamente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};