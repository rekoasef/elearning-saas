"use server"

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export async function createPreference(course: { id: string, title: string, price: number, slug: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/courses/${course.slug}`);
  }

  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: course.id,
            title: course.title,
            quantity: 1,
            unit_price: Number(course.price),
            currency_id: 'ARS',
          }
        ],
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        metadata: {
          userId: user.id,
          courseId: course.id
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=pending`,
        },
        auto_return: 'approved',
        binary_mode: true,
      }
    });

    if (result.init_point) {
      return redirect(result.init_point);
    }
  } catch (error) {
    // Si el error es una redirección de Next.js, lo relanzamos para que funcione
    if (isRedirectError(error)) {
      throw error;
    }
    
    console.error("Error real de Mercado Pago:", error);
    throw new Error("No se pudo procesar el pago");
  }
}