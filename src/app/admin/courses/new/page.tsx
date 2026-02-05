"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "../actions";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  LayoutGrid, 
  Type, 
  AlignLeft, 
  DollarSign, 
  ImageIcon,
  Loader2,
  PlusCircle
} from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Construimos el objeto respetando el Schema de Zod que tenés en actions.ts
    const values = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      image: formData.get("image") as string || "",
    };

    try {
      //@ts-ignore
      await createCourse(values);
      toast.success("Curso creado con éxito");
      router.refresh();
      router.push("/admin/courses");
    } catch (error) {
      toast.error("Ocurrió un error al crear el curso");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pt-28 md:pt-10 px-4 md:px-6 pb-20">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link 
            href="/admin/courses" 
            className="flex items-center gap-2 text-gray-500 hover:text-white mb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Volver a Cursos
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">
            Nuevo <span className="text-primary">Curso</span>
          </h1>
        </div>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* COLUMNA IZQUIERDA: DATOS BÁSICOS */}
          <div className="space-y-6 bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem]">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <Type size={14} className="text-primary" /> Título del Curso
              </label>
              <input
                name="title"
                type="text"
                required
                placeholder="Ej: Master en Next.js 14"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold placeholder:text-gray-700"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <AlignLeft size={14} className="text-primary" /> Descripción Breve
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Explica de qué trata el curso..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-gray-700 resize-none"
              />
            </div>
          </div>

          {/* COLUMNA DERECHA: PRECIO E IMAGEN */}
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-6">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  <DollarSign size={14} className="text-primary" /> Precio (ARS)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-primary">$</span>
                  <input
                    name="price"
                    type="number"
                    required
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-black text-xl"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  <ImageIcon size={14} className="text-primary" /> URL de Imagen (Miniatura)
                </label>
                <input
                  name="image"
                  type="url"
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm font-medium placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-6 rounded-[2rem] font-black text-lg tracking-tighter italic flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  CREANDO CURSO...
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  CREAR CURSO AHORA
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}