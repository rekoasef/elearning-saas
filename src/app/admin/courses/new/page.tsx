"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCourse } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, ArrowLeft, Image as ImageIcon, DollarSign, Type, AlignLeft } from "lucide-react";
import Link from "next/link";

// Esquema ajustado para evitar conflictos de tipos con inputs vacíos
const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  image: z.string().default(""), // Forzamos string para que no sea undefined
});

type CourseFormValues = z.infer<typeof formSchema>;

export default function NewCoursePage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<CourseFormValues>({
    //@ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: { 
      title: "", 
      description: "", 
      price: 0, 
      image: "" 
    },
  });

  async function onSubmit(values: CourseFormValues) {
    setLoading(true);
    try {
      await createCourse(values);
    } catch (error) {
      console.error("Error al crear el curso:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20 px-6">
      {/* Navegación superior */}
      <Link 
        href="/admin/courses" 
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-10 text-xs font-bold uppercase tracking-widest group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Volver a la gestión de cursos
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl lg:text-6xl font-black tracking-tighter mb-4">
          Nuevo <span className="text-primary">Curso</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Completa la información para dar de alta tu nueva formación profesional.
        </p>
      </div>

      <form 
      //@ts-ignore
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-10 bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-[3rem] backdrop-blur-3xl shadow-2xl"
      >
        {/* Campo Título */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-400 ml-1">
            <Type size={14} className="text-primary" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em]">Título del Curso</label>
          </div>
          <Input 
            {...form.register("title")} 
            placeholder="Ej: Master en Next.js 14 y Prisma" 
            className="bg-black/40 border-white/10 h-16 rounded-2xl focus:border-primary/50 focus:ring-primary/20 transition-all text-lg" 
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-xs font-bold ml-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Campo Descripción */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-400 ml-1">
            <AlignLeft size={14} className="text-primary" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em]">Descripción Detallada</label>
          </div>
          <Textarea 
            {...form.register("description")} 
            placeholder="Describe qué aprenderán los alumnos..." 
            className="bg-black/40 border-white/10 min-h-[180px] rounded-2xl focus:border-primary/50 focus:ring-primary/20 transition-all text-base leading-relaxed" 
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-xs font-bold ml-1">{form.formState.errors.description.message}</p>
          )}
        </div>

        {/* Grid de Precio e Imagen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400 ml-1">
              <DollarSign size={14} className="text-primary" />
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">Precio (USD)</label>
            </div>
            <Input 
              type="number" 
              step="0.01"
              {...form.register("price")} 
              className="bg-black/40 border-white/10 h-16 rounded-2xl focus:border-primary/50 focus:ring-primary/20" 
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400 ml-1">
              <ImageIcon size={14} className="text-primary" />
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">URL de Portada</label>
            </div>
            <Input 
              {...form.register("image")} 
              placeholder="https://tu-imagen.com/foto.jpg" 
              className="bg-black/40 border-white/10 h-16 rounded-2xl focus:border-primary/50 focus:ring-primary/20" 
            />
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-20 bg-primary hover:bg-primary/90 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-primary/30 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={24} />
                <span>Procesando...</span>
              </div>
            ) : (
              "Crear y Publicar Curso"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}