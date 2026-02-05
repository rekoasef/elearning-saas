"use client"

import { useState } from "react";
import { updateCourse } from "../actions";
import { toast } from "sonner";
import { Save, Loader2, DollarSign, Type, ImageIcon, Eye, EyeOff } from "lucide-react";

export function EditCourseForm({ course }: { course: any }) {
  const [loading, setLoading] = useState(false);
  // Manejamos la visibilidad como un estado de React
  const [isPublished, setIsPublished] = useState(course.isPublished || false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const values = {
      title: formData.get("title") as string,
      description: course.description || "Sin descripción", // Evitamos que Zod falle por falta de desc
      price: Number(formData.get("price")),
      image: formData.get("image") as string || null,
      isPublished: isPublished,
    };

    try {
      const result = await updateCourse(course.id, values);

      if (result?.success) {
        toast.success("¡Cambios guardados con éxito!");
      } else {
        toast.error(result?.error || "Error al guardar");
      }
    } catch (err) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem]">
      <h2 className="text-xl font-black italic tracking-tight mb-4 text-primary uppercase">Configuración</h2>
      
      {/* TÍTULO */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Título</label>
        <input 
          name="title" 
          defaultValue={course.title} 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-primary/50" 
          required 
        />
      </div>

      {/* PRECIO */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Precio (ARS)</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            defaultValue={course.price} 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white font-black text-xl outline-none focus:ring-2 focus:ring-primary/50" 
            required 
          />
        </div>
      </div>

      {/* VISIBILIDAD */}
      <div 
        onClick={() => setIsPublished(!isPublished)}
        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
          isPublished ? "bg-primary/10 border-primary/30" : "bg-white/5 border-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          {isPublished ? <Eye className="text-primary" size={18} /> : <EyeOff className="text-gray-500" size={18} />}
          <span className={`text-[10px] font-black uppercase tracking-widest ${isPublished ? "text-primary" : "text-gray-500"}`}>
            {isPublished ? "Curso Visible" : "Curso Oculto"}
          </span>
        </div>
        <div className={`w-10 h-6 rounded-full relative transition-all ${isPublished ? "bg-primary" : "bg-gray-700"}`}>
          <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${isPublished ? "left-5" : "left-1"}`} />
        </div>
      </div>

      {/* BOTÓN GUARDAR */}
      <button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-primary hover:bg-primary/90 text-black py-4 rounded-2xl font-black italic flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
        GUARDAR CAMBIOS
      </button>
    </form>
  );
}