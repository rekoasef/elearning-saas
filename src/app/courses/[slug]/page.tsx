import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FadeIn } from "@/components/framer-wrapper"
import { CheckCircle, Clock, BookOpen, Star } from "lucide-react"
import { createPreference } from "../checkout-action"

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  // Buscamos el curso por su slug
  const course = await db.course.findUnique({
    where: { slug: params.slug }
  })

  if (!course) {
    notFound()
  }

  // Definimos la acción que llama a Mercado Pago
  const handleCheckout = async () => {
    "use server"
    await createPreference({
      id: course.id,
      title: course.title,
      price: course.price,
      slug: params.slug
    })
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,#1e1b4b,transparent_50%)] opacity-30" />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* COLUMNA IZQUIERDA: Info del Curso */}
          <div className="space-y-8">
            <FadeIn direction="right">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-primary/30">
                  Acceso Inmediato
                </span>
                <div className="flex items-center gap-1 text-yellow-500 ml-2">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tighter">
                {course.title}
              </h1>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                {course.description}
              </p>
            </FadeIn>

            <FadeIn direction="right" delay={0.4}>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Clock className="text-primary h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">A tu ritmo</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <BookOpen className="text-primary h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Proyecto Final</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.6}>
              <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-2xl">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 uppercase font-black tracking-[0.2em] mb-1">Inversión única</p>
                  <p className="text-5xl font-black text-white tracking-tighter">
                    <span className="text-2xl align-top mr-1 font-bold text-primary">$</span>
                    {course.price}
                  </p>
                </div>
                
                <form action={handleCheckout} className="w-full">
                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all hover:scale-[1.02]"
                  >
                    Comenzar ahora
                  </Button>
                </form>
              </div>
            </FadeIn>
          </div>

          {/* COLUMNA DERECHA: Imagen */}
          <FadeIn direction="left" delay={0.3}>
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all duration-700 z-10" />
              <Image
                src={course.image || ""}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
            </div>
          </FadeIn>

        </div>
      </main>
    </div>
  )
}