import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CourseCardProps {
  title: string
  description: string
  price: number
  image: string
  slug: string
}

export function CourseCard({ title, description, price, image, slug }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:bg-white/[0.05] hover:shadow-[0_0_30px_-10px_rgba(124,58,237,0.3)] hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden">
        {/* Overlay de color al hacer hover */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        <Image
          src={image || "/placeholder-course.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl font-black text-white">${price}</span>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Link href={`/courses/${slug}`}>Ver curso</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}