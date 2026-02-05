import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/lib/supabase-server";
import { db } from "@/lib/db";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { courseId } = await req.json();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) return new NextResponse("Not Found", { status: 404 });

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: course.id,
            title: course.title,
            quantity: 1,
            unit_price: Number(course.price),
            currency_id: "ARS",
          },
        ],
        // CLAVE: Esto vincula al usuario y al curso en el Webhook
        external_reference: `${user.id}__${course.id}`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?success=true`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?error=true`,
        },
        auto_return: "approved",
        notification_url: `${process.env.MP_WEBHOOK_URL}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({ url: preference.init_point });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}