import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { 
  PlayCircle, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Code2, 
  BrainCircuit,
  Rocket
} from "lucide-react";

export default async function LandingPage() {
  // Consulta segura: quitamos filtros que puedan romper si no están en tu Schema
  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    take: 6 // Solo mostramos los últimos 6 para no saturar
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black overflow-x-hidden">
      
      {/* --- 1. HERO SECTION (REFINADO) --- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} /> IA + Fullstack Edition 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6 uppercase italic">
            Domina el <span className="text-primary">Código</span> <br />
            Lidera con <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Inteligencia</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-gray-400 text-base md:text-lg font-medium leading-relaxed mb-10">
            Aprende a construir software de élite utilizando las herramientas de IA que están definiendo el futuro de la industria.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:opacity-90 active:scale-95"
            >
              Empezar ahora
            </Link>
            <a 
              href="#courses" 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-all"
            >
              Explorar Catálogo
            </a>
          </div>
        </div>
      </section>

      {/* --- 2. IA SECTION (COMPACTA) --- */}
      <section className="py-20 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video md:aspect-square max-h-[400px] rounded-3xl border border-white/10 overflow-hidden bg-zinc-900 flex items-center justify-center">
              <BrainCircuit size={120} className="text-primary/20" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5">
                <p className="text-white text-xs font-bold leading-tight uppercase italic tracking-tight">
                  La IA es tu copiloto, no tu reemplazo.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-primary font-black uppercase text-[9px] tracking-[0.3em]">
                <Cpu size={12} /> El nuevo estándar
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-tight">
                Potencia tu <br /> carrera con <span className="text-primary underline">IA</span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed font-medium">
                Nuestra metodología integra LLMs y Agentes de IA en el flujo de desarrollo Real. No enseñamos teoría, enseñamos productividad extrema.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {["Prompt Engineering para Devs", "Arquitecturas Asistidas", "Debugging con IA"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-300">
                    <Zap size={14} className="text-primary" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. BENTO BOX FEATURES (REFINADA) --- */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] transition-all group">
            <Zap size={24} className="text-primary mb-4" />
            <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">Proyectos de Alto Nivel</h3>
            <p className="text-gray-400 text-sm leading-relaxed">SaaS, E-commerce escalables y Dashboards con arquitecturas modernas. Nada de ejemplos básicos.</p>
          </div>
          
          <div className="bg-primary rounded-3xl p-8 text-black flex flex-col justify-between group">
            <Rocket size={24} className="mb-4" />
            <h3 className="text-xl font-black uppercase italic tracking-tight leading-tight">Acceso <br /> Vitalicio</h3>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] transition-all">
            <Code2 size={24} className="text-primary mb-4" />
            <h3 className="text-lg font-black uppercase italic mb-2 tracking-tight">Stack 2026</h3>
            <p className="text-gray-400 text-xs">Next.js 16, Supabase, AI Agents.</p>
          </div>

          <div className="md:col-span-2 bg-white/[0.02] border border-white/10 rounded-3xl p-8 flex items-center justify-between hover:bg-white/[0.04] transition-all">
            <div className="max-w-xs">
              <h3 className="text-xl font-black uppercase italic mb-2 tracking-tight">Comunidad Pro</h3>
              <p className="text-gray-400 text-sm">Networking real con desarrolladores de toda Latinoamérica.</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
              +5k
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. COURSES GRID (REDUCIDO) --- */}
      <section id="courses" className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
            NUESTROS <span className="text-primary">PROGRAMAS</span>
          </h2>
          <Link href="/courses" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
            Ver catálogo completo <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/course/${course.slug}`} className="group">
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden transition-all hover:border-primary/40 hover:bg-white/[0.04]">
                <div className="relative aspect-video">
                  <Image
                    fill
                    src={course.imageUrl || "/placeholder.jpg"}
                    alt={course.title}
                    className="object-cover opacity-50 group-hover:opacity-80 transition-all"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
                
                <div className="p-6">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary mb-2">Formación Profesional</p>
                  <h3 className="text-lg font-black tracking-tighter uppercase italic mb-6 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xl font-black text-white italic">${course.price || "99"}</span>
                    <PlayCircle size={18} className="text-primary" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- FOOTER (MINIMALISTA) --- */}
      <footer className="py-16 border-t border-white/5 bg-[#050505] text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          <h2 className="text-2xl font-black tracking-tighter uppercase">
            DEV<span className="text-primary italic">ACADEMY</span>
          </h2>
          <div className="flex justify-center gap-8 text-[9px] font-black uppercase tracking-widest text-gray-500">
            <Link href="/courses" className="hover:text-white">Cursos</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/terms" className="hover:text-white">Términos</Link>
          </div>
          <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">
            © 2026 Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}