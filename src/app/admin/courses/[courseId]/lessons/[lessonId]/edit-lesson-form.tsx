"use client"

import { useState } from "react";
import { updateLesson } from "../../../actions";
import { toast } from "sonner";
import { Save, Loader2, Video, FileText, Type } from "lucide-react";
import { useRouter } from "next/navigation";

export function EditLessonForm({ lesson, courseId }: { lesson: any, courseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const values = {
      title: formData.get("title") as string,
      videoUrl: formData.get("videoUrl") as string || "",
      content: formData.get("content") as string || "",
    };

    const result = await updateLesson(lesson.id, courseId, values);
    
    if (result?.success) {
      toast.success("Clase actualizada correctamente");
      router.refresh();
    } else {
      toast.error("Error al guardar los cambios");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* COLUMNA IZQUIERDA: CONFIGURACIÓN DE VIDEO */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Type size={14} /> Título de la clase
            </label>
            <input 
              name="title" 
              defaultValue={lesson.title} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/50"
              required 
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Video size={14} /> URL del Video (YouTube/Vimeo)
            </label>
            <input 
              name="videoUrl" 
              defaultValue={lesson.videoUrl || ""} 
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white text-xs outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black italic flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            GUARDAR CLASE
          </button>
        </div>
      </div>

      {/* COLUMNA DERECHA: CONTENIDO DE TEXTO */}
      <div className="lg:col-span-2">
        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] h-full flex flex-col">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4">
            <FileText size={14} /> Contenido escrito / Recursos
          </label>
          <textarea 
            name="content"
            defaultValue={lesson.content || ""}
            placeholder="Escribe aquí el material de la clase, links de descarga, etc."
            className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[400px]"
          />
        </div>
      </div>
    </form>
  );
}