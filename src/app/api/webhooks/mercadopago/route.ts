import { db } from "@/lib/db";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextResponse } from "next/server";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  
  // Mercado Pago envía el ID del pago en la query o en el body
  const paymentId = body.data?.id || searchParams.get("data.id");

  if (body.type === "payment" && paymentId) {
    try {
      const payment = await new Payment(client).get({ id: paymentId });

      if (payment.status === "approved") {
        const { userId, courseId } = payment.metadata;

        // Registramos o actualizamos la compra en Prisma
        await db.purchase.upsert({
          where: {
            userId_courseId: { userId, courseId }
          },
          update: {
            status: "approved",
          },
          create: {
            userId,
            courseId,
            amount: payment.transaction_amount!,
            status: "approved",
          },
        });
        
        console.log(`✅ Pago aprobado: Usuario ${userId} -> Curso ${courseId}`);
      }
    } catch (error) {
      console.error("❌ Error procesando webhook:", error);
      return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}