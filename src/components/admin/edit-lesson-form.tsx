"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateLesson } from "@/app/admin/courses/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Video, FileText } from "lucide-react";
import { toast } from "sonner";

const lessonSchema = z.object({
  title: z.string().min(3, "Título muy corto"),
  videoUrl: z.string().url("URL inválida").or(z.literal("")),
  content: z.string().optional(),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface EditLessonFormProps {
  initialData: {
    id: string;
    title: string;
    videoUrl: string | null;
    content: string | null;
  };
  courseId: string;
}

export function EditLessonForm({ initialData, courseId }: EditLessonFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: initialData.title || "",
      videoUrl: initialData.videoUrl || "",
      content: initialData.content || "",
    },
  });

  async function onSubmit(values: LessonFormValues) {
    setLoading(true);
    try {
      await updateLesson(initialData.id, courseId, values);
      toast.success("Cambios guardados correctamente");
    } catch (error) {
      toast.error("Error al actualizar la lección");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white/[0.02] border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Título de la lección</label>
        <Input {...form.register("title")} className="bg-black/40 border-white/10 h-14 rounded-2xl" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400 ml-1">
          <Video size={14} className="text-primary" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em]">URL del Video (Embed)</label>
        </div>
        <Input {...form.register("videoUrl")} placeholder="https://www.youtube.com/embed/..." className="bg-black/40 border-white/10 h-14 rounded-2xl font-mono text-sm" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400 ml-1">
          <FileText size={14} className="text-primary" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em]">Contenido / Apuntes</label>
        </div>
        <Textarea {...form.register("content")} className="bg-black/40 border-white/10 min-h-[300px] rounded-2xl text-base" />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all">
        {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" size={20} /> Guardar Lección</>}
      </Button>
    </form>
  );
}