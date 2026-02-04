import { db } from "@/lib/db"
import Navbar from "@/components/navbar"
import { CourseCard } from "@/components/course-card"
import { brandConfig } from "@/config/brand"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FadeIn } from "@/components/framer-wrapper" // Importamos el wrapper

export default async function Home() {
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative w-full py-24 lg:py-40 flex flex-col items-center px-4 text-center">
          <div className="absolute top-0 -z-10 h-full w-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_200px,#3d1a78,transparent)] opacity-40" />
          </div>

          {/* Aplicamos FadeIn con diferentes delays */}
          <FadeIn>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white mb-6">
              Domina la <span className="text-primary italic">Programación</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="max-w-[700px] mx-auto text-gray-400 text-lg lg:text-xl mb-10 leading-relaxed">
              {brandConfig.description}
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                <Link href="/register">Empezar ahora</Link>
              </Button>
            </div>
          </FadeIn>
        </section>

        <section id="cursos" className="max-w-7xl mx-auto px-4 pb-32">
          <FadeIn direction="right">
            <div className="flex flex-col mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Cursos <span className="text-primary">Destacados</span>
              </h2>
              <div className="h-1 w-20 bg-primary mt-2 rounded-full" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <FadeIn key={course.id} delay={0.1 * index}> {/* Efecto cascada en el grid */}
                <CourseCard 
                  title={course.title}
                  description={course.description}
                  price={course.price}
                  slug={course.slug}
                  image={course.image || ""}
                />
              </FadeIn>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}