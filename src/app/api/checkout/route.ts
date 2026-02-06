import { createClient } from '@/lib/supabase-server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

const client = new MercadoPagoConfig({ 
  accessToken: accessToken || '' 
})

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("No autorizado", { status: 401 })
    }

    const { courseId, price } = await req.json()

    const course = await db.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return new NextResponse("Curso no encontrado", { status: 404 })
    }

    // Limpiamos la URL de Vercel de tu .env
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000"

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [
          {
            id: course.id,
            title: course.title,
            quantity: 1,
            unit_price: Number(price),
            currency_id: 'ARS',
          }
        ],
        payer: {
          email: user.email, 
        },
        back_urls: {
          success: `${baseUrl}/dashboard`,
          failure: `${baseUrl}/courses/${course.slug}`,
          pending: `${baseUrl}/dashboard`,
        },
        auto_return: "approved",
        external_reference: JSON.stringify({
          userId: user.id,
          courseId: course.id
        }),
        // IMPORTANTE: En producción real con tarjetas reales, 
        // binary_mode: false permite que el pago quede 'en proceso' 
        // si la tarjeta requiere validación, evitando el error fatal.
        binary_mode: false, 
      }
    })

    return NextResponse.json({ url: result.init_point })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: error.status || 500 }
    )
  }
}