"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShoppingCart } from "lucide-react"

interface EnrollmentButtonProps {
  courseId: string
  courseSlug: string
  userId: string | undefined
  price: number
}

export default function EnrollmentButton({ 
  courseId, 
  courseSlug,
  userId, 
  price 
}: EnrollmentButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleEnrollment = async () => {
    // Si no hay usuario, redirigimos al login con el parámetro 'next'
    if (!userId) {
      router.push(`/login?next=/courses/${courseSlug}`)
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, price }),
        })

        const data = await response.json()

        if (data.url) {
          // Redirección a Mercado Pago
          window.location.href = data.url
        }
      } catch (error) {
        console.error("Error en el checkout:", error)
      }
    })
  }

  return (
    <Button 
      onClick={handleEnrollment}
      disabled={isPending}
      className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-black italic gap-3 rounded-2xl shadow-lg shadow-primary/20"
    >
      {isPending ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <>
          <ShoppingCart size={22} />
          ADQUIRIR CURSO POR ${price}
        </>
      )}
    </Button>
  )
}