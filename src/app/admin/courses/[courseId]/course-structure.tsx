"use client"

import { useState } from "react";
import { createModule, createLesson } from "../actions";
import { toast } from "sonner";
import { 
  Plus, 
  GripVertical, 
  PlayCircle, 
  FileText, 
  Loader2, 
  Settings2, 
  Network,
  X
} from "lucide-react";
import Link from "next/link";

export function CourseStructure({ courseId, modules }: { courseId: string; modules: any[] }) {
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  
  // Estados para la creación de lecciones
  const [isAddingLesson, setIsAddingLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  
  const [loading, setLoading] = useState<string | null>(null);

  const onAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    setLoading("module");
    try {
      await createModule(courseId, newModuleTitle);
      toast.success("Módulo creado");
      setNewModuleTitle("");
      setIsAddingModule(false);
    } catch (e) {
      toast.error("Error al crear módulo");
    } finally {
      setLoading(null);
    }
  };

  const onAddLesson = async (moduleId: string) => {
    if (!newLessonTitle.trim()) return;
    setLoading(moduleId);
    try {
      await createLesson(moduleId, courseId, newLessonTitle);
      toast.success("Clase agregada");
      setNewLessonTitle("");
      setIsAddingLesson(null);
    } catch (e) {
      toast.error("Error al crear clase");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-8 relative z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black italic uppercase flex items-center gap-3">
          <Network className="text-primary" size={20} /> Estructura de Clases
        </h2>
        <button 
          onClick={() => setIsAddingModule(true)} 
          className="bg-primary p-4 rounded-2xl text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* CREAR MÓDULO */}
      {isAddingModule && (
        <div className="p-6 bg-white/5 rounded-[2rem] border border-primary/30 animate-in fade-in slide-in-from-top-4 duration-200">
          <input 
            autoFocus 
            className="bg-transparent border-b border-white/10 w-full py-2 text-white font-bold outline-none mb-4 placeholder:text-gray-700" 
            placeholder="Título del nuevo módulo..."
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAddModule()}
          />
          <div className="flex justify-end gap-2 text-[10px] font-black uppercase">
            <button onClick={() => setIsAddingModule(false)} className="text-gray-500 p-2">Cancelar</button>
            <button onClick={onAddModule} disabled={loading === "module"} className="bg-primary text-black px-6 py-3 rounded-xl disabled:opacity-50 flex items-center gap-2">
              {loading === "module" && <Loader2 size={12} className="animate-spin" />}
              Guardar Módulo
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden transition-all hover:border-white/10">
            <div className="p-5 flex items-center justify-between bg-white/5 border-b border-white/5">
              <span className="font-black italic text-sm uppercase tracking-tight">{module.title}</span>
              <button 
                onClick={() => setIsAddingLesson(module.id)} 
                className="text-[10px] font-black uppercase bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-black transition-all"
              >
                + Agregar Clase
              </button>
            </div>

            <div className="p-4 space-y-2">
              {/* INPUT PARA NUEVA LECCIÓN (Solo aparece en el módulo seleccionado) */}
              {isAddingLesson === module.id && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <input 
                      autoFocus
                      className="flex-1 bg-transparent border-none text-xs font-bold text-white outline-none placeholder:text-gray-600"
                      placeholder="Nombre de la clase..."
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && onAddLesson(module.id)}
                    />
                    <div className="flex items-center gap-2">
                      <button onClick={() => setIsAddingLesson(null)} className="text-gray-500 hover:text-white">
                        <X size={16} />
                      </button>
                      <button 
                        onClick={() => onAddLesson(module.id)}
                        disabled={loading === module.id}
                        className="bg-primary text-black p-2 rounded-lg"
                      >
                        {loading === module.id ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* LISTA DE LECCIONES */}
              {module.lessons.map((lesson: any) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 group transition-all hover:bg-black/40">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400 group-hover:text-white">
                    {lesson.videoUrl ? <PlayCircle size={14} className="text-primary" /> : <FileText size={14} />}
                    {lesson.title}
                  </div>
                  <Link 
                    href={`/admin/courses/${courseId}/lessons/${lesson.id}`} 
                    className="bg-white/10 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-black"
                  >
                    <Settings2 size={14} />
                  </Link>
                </div>
              ))}
              
              {module.lessons.length === 0 && isAddingLesson !== module.id && (
                <p className="text-[10px] text-gray-700 font-bold uppercase text-center py-4 italic tracking-widest">Módulo vacío</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}