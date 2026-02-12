"use client"

import React, { useState, useEffect } from "react";
import { createModule, createLesson, updateModuleTitle, updateLessonTitle } from "@/app/admin/courses/actions";
import { deleteModule, deleteLesson } from "@/app/actions/delete-actions";
import { toast } from "sonner";
import { 
  Plus, 
  PlayCircle, 
  FileText, 
  Loader2, 
  Settings2, 
  Network,
  X,
  Trash2,
  Pencil,
  Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export function CourseStructure({ courseId, modules }: { courseId: string; modules: any[] }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // Estados para creación
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [isAddingLesson, setIsAddingLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  
  // Estados para edición inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // --- LOGICA DE EDICIÓN ---
  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setTempTitle(currentTitle);
  };

  const onSaveModuleTitle = async (moduleId: string) => {
    if (!tempTitle.trim()) return setEditingId(null);
    setLoading(moduleId);
    const res = await updateModuleTitle(moduleId, courseId, tempTitle);
    if (res.success) {
      toast.success("Módulo actualizado");
      setEditingId(null);
      router.refresh();
    }
    setLoading(null);
  };

  const onSaveLessonTitle = async (lessonId: string) => {
    if (!tempTitle.trim()) return setEditingId(null);
    setLoading(lessonId);
    const res = await updateLessonTitle(lessonId, courseId, tempTitle);
    if (res.success) {
      toast.success("Clase actualizada");
      setEditingId(null);
      router.refresh();
    }
    setLoading(null);
  };

  // --- LOGICA DE CREACIÓN ---
  const onAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    setLoading("module");
    try {
      const result = await createModule(courseId, newModuleTitle);
      if (result.success) {
        toast.success("Módulo creado");
        setNewModuleTitle("");
        setIsAddingModule(false);
        router.refresh();
      }
    } catch (e) { toast.error("Error"); } finally { setLoading(null); }
  };

  const onAddLesson = async (moduleId: string) => {
    if (!moduleId || !newLessonTitle.trim()) return;
    setLoading(moduleId);
    try {
      const result = await createLesson(moduleId, courseId, newLessonTitle);
      if (result?.success) {
        toast.success("Clase agregada");
        setNewLessonTitle("");
        setIsAddingLesson(null);
        router.refresh();
      }
    } catch (e) { toast.error("Error"); } finally { setLoading(null); }
  };

  // --- LOGICA DE BORRADO ---
  const onDeleteModule = async (moduleId: string) => {
    const res = await deleteModule(moduleId, courseId);
    if (res.success) { toast.success("Módulo eliminado"); router.refresh(); }
  };

  const onDeleteLesson = async (lessonId: string) => {
    const res = await deleteLesson(lessonId, courseId);
    if (res.success) { toast.success("Clase eliminada"); router.refresh(); }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-8 relative z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black italic uppercase flex items-center gap-3 text-white">
          <Network className="text-primary" size={20} /> Estructura de Clases
        </h2>
        <button onClick={() => setIsAddingModule(true)} className="bg-primary p-4 rounded-2xl text-black hover:scale-105 transition-all">
          <Plus size={20} />
        </button>
      </div>

      {isAddingModule && (
        <div className="p-6 bg-white/5 rounded-[2rem] border border-primary/30">
          <input 
            autoFocus 
            className="bg-transparent border-b border-white/10 w-full py-2 text-white font-bold outline-none mb-4" 
            placeholder="Título del nuevo módulo..."
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
          />
          <div className="flex justify-end gap-2 text-[10px] font-black uppercase">
            <button onClick={() => setIsAddingModule(false)} className="text-gray-500 p-2">Cancelar</button>
            <button onClick={onAddModule} disabled={loading === "module"} className="bg-primary text-black px-6 py-3 rounded-xl">
               {loading === "module" ? <Loader2 size={12} className="animate-spin" /> : "Guardar"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden">
            <div className="p-5 flex items-center justify-between bg-white/5 border-b border-white/5">
              
              {editingId === module.id ? (
                <div className="flex items-center gap-2 flex-1 mr-4">
                  <input 
                    autoFocus
                    className="bg-black/40 border border-primary/30 rounded-lg px-3 py-1 text-sm text-white outline-none w-full font-bold"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSaveModuleTitle(module.id)}
                  />
                  <button onClick={() => onSaveModuleTitle(module.id)} className="text-primary"><Check size={18}/></button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500"><X size={18}/></button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="font-black italic text-sm uppercase tracking-tight text-white">{module.title}</span>
                  <button onClick={() => startEditing(module.id, module.title)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-primary transition-all">
                    <Pencil size={12} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <ConfirmModal onConfirm={() => onDeleteModule(module.id)}>
                  <button className="text-gray-600 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                </ConfirmModal>
                <button onClick={() => setIsAddingLesson(module.id)} className="text-[10px] font-black uppercase bg-primary/10 text-primary px-4 py-2 rounded-xl">
                  + Clase
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {isAddingLesson === module.id && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-4">
                  <div className="flex items-center gap-3">
                    <input autoFocus className="flex-1 bg-transparent border-none text-xs font-bold text-white outline-none" value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} placeholder="Nombre de la clase..."/>
                    <button onClick={() => onAddLesson(module.id)} className="bg-primary text-black p-2 rounded-lg"><Plus size={14} /></button>
                  </div>
                </div>
              )}

              {module.lessons.map((lesson: any) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 group transition-all">
                  
                  {editingId === lesson.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-4">
                      <input 
                        autoFocus
                        className="bg-black/40 border border-primary/30 rounded-lg px-3 py-1 text-xs text-white outline-none w-full"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSaveLessonTitle(lesson.id)}
                      />
                      <button onClick={() => onSaveLessonTitle(lesson.id)} className="text-primary"><Check size={16}/></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400 group-hover:text-white">
                      {lesson.videoUrl ? <PlayCircle size={14} className="text-primary" /> : <FileText size={14} />}
                      {lesson.title}
                      <button onClick={() => startEditing(lesson.id, lesson.title)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-primary">
                        <Pencil size={10} />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <ConfirmModal onConfirm={() => onDeleteLesson(lesson.id)}>
                       <button className="p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </ConfirmModal>
                    <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}`} className="bg-white/10 p-3 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-black">
                      <Settings2 size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}