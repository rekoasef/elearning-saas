import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { ConfettiCelebration } from "@/components/confetti-celebration";

export default async function SuccessPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Buscamos la última compra aprobada para saber qué curso mostrar
  const lastPurchase = await db.purchase.findFirst({
    where: {
      userId: user.id,
      status: "approved"
    },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: { orderBy: { order: "asc" } }
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!lastPurchase) redirect("/dashboard");

  const firstLessonId = lastPurchase.course.modules[0]?.lessons[0]?.id;
  const courseUrl = `/dashboard/courses/${lastPurchase.course.slug}/lessons/${firstLessonId}`;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <ConfettiCelebration />
      
      <div className="max-w-md w-full text-center space-y-8 bg-white/[0.02] border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/20 rounded-full">
            <CheckCircle className="h-16 w-16 text-primary animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.4em]">
            <Sparkles size={12} />
            ¡Pago confirmado!
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            BIENVENIDO A <br />
            <span className="italic uppercase">{lastPurchase.course.title}</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium leading-relaxed">
            Tu acceso ha sido habilitado correctamente. Ya podés empezar a dominar esta disciplina.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href={courseUrl}
            className="flex items-center justify-center gap-2 w-full bg-primary text-black py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:opacity-90 transition-all active:scale-95 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
          >
            Empezar a aprender
            <ArrowRight size={18} />
          </Link>
          
          <Link 
            href="/dashboard"
            className="block mt-6 text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Ir al panel general
          </Link>
        </div>
      </div>
    </div>
  );
}