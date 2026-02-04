"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createModule, createLesson } from "@/app/admin/courses/actions";
import { Plus, Loader2 } from "lucide-react";

export function AddModuleForm({ courseId }: { courseId: string }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    await createModule(courseId, title);
    setTitle("");
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nombre del nuevo módulo..."
        className="bg-black/40 border-white/10 h-12 rounded-xl"
      />
      <Button disabled={loading} className="bg-primary hover:bg-primary/90 rounded-xl h-12 font-bold px-6">
        {loading ? <Loader2 className="animate-spin" /> : <><Plus size={18} className="mr-2"/> Crear Módulo</>}
      </Button>
    </form>
  );
}

export function AddLessonForm({ moduleId, courseId }: { moduleId: string, courseId: string }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    await createLesson(moduleId, courseId, title);
    setTitle("");
    setIsEditing(false);
    setLoading(false);
  };

  if (!isEditing) {
    return (
      <Button variant="ghost" onClick={() => setIsEditing(true)} className="w-full justify-start text-gray-500 hover:text-primary rounded-xl h-12 italic border border-dashed border-white/10 mt-2">
        + Añadir nueva lección...
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 mt-2 p-2 bg-white/5 rounded-xl">
      <Input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la lección..."
        className="bg-black h-10 border-white/10"
        autoFocus
      />
      <Button size="sm" disabled={loading} className="bg-primary">
        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Añadir"}
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>X</Button>
    </form>
  );
}