import { createClient } from '@/lib/supabase-server'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// 1. Sincronización con tu .env
// Usamos el nombre exacto que tienes: MERCADOPAGO_ACCESS_TOKEN
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.error("[MP_ERROR]: Falta MERCADOPAGO_ACCESS_TOKEN en las variables de entorno");
}

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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const preference = new Preference(client)

    // 2. Creación de la preferencia con modo binario para evitar bloqueos de políticas
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
        // El modo binario ayuda a procesar pagos de forma inmediata o fallida,
        // evitando el estado "en proceso" que a veces causa conflictos de políticas.
        binary_mode: true,
      }
    })

    return NextResponse.json({ url: result.init_point })

  } catch (error: any) {
    console.error("[CHECKOUT_ERROR_DETAIL]", {
      status: error.status,
      message: error.message,
    })
    
    // Devolvemos el error detallado para debug
    return NextResponse.json(
      { error: error.message, code: error.code }, 
      { status: error.status || 500 }
    )
  }
}