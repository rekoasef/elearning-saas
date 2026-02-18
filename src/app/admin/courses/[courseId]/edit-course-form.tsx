"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCourse } from "../actions";
import { toast } from "sonner";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";

interface EditCourseFormProps {
  course: any;
}

export const EditCourseForm = ({ course }: EditCourseFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [title, setTitle] = useState(course.title);
  const [price, setPrice] = useState(course.price);
  // Aseguramos que tome el valor booleano correcto de la DB
  const [isPublished, setIsPublished] = useState(course.isPublished || course.published || false);

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    try {
      const values = {
        title,
        price: Number(price),
        isPublished: isPublished, 
        description: course.description || "",
        image: course.image || null
      };

      const res = await updateCourse(course.id, values);

      if (res.success) {
        toast.success("Curso actualizado con éxito");
        router.refresh();
      } else {
        toast.error("Error al guardar los cambios");
      }
    } catch (error) {
      toast.error("Algo salió mal");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async () => {
    const newStatus = !isPublished;
    
    // Optimismo UI: cambiamos el estado antes de la petición
    setIsPublished(newStatus);
    setIsLoading(true);

    try {
      const values = {
        title,
        price: Number(price),
        isPublished: newStatus,
        description: course.description || "",
        image: course.image || null
      };
      
      const res = await updateCourse(course.id, values);
      
      if (res.success) {
        toast.success(newStatus ? "Curso ahora es público" : "Curso ocultado");
        router.refresh();
      } else {
        toast.error("No se pudo actualizar la visibilidad");
        setIsPublished(!newStatus); // Revertimos si falla el servidor
      }
    } catch {
      toast.error("Error de conexión");
      setIsPublished(!newStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Título del Curso</label>
          <input
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/50 transition-all font-bold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Precio (ARS)</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold">$</span>
            <input
              type="number"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-4 text-white outline-none focus:border-primary/50 transition-all font-bold"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            {isPublished ? (
              <Eye className="text-primary" size={18} />
            ) : (
              <EyeOff className="text-gray-500" size={18} />
            )}
            <span className="text-xs font-black uppercase italic tracking-tighter text-white">
              {isPublished ? "Curso Público" : "Curso Oculto"}
            </span>
          </div>
          
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none disabled:opacity-50 ${
              isPublished ? "bg-primary" : "bg-zinc-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPublished ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Save size={18} /> Guardar Cambios
            </>
          )}
        </button>
      </form>
    </div>
  );
};