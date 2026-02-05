import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@/lib/db";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Mercado Pago envía notificaciones por 'payment' o 'merchant_order'
    const topic = body.type || body.topic;

    if (topic === "payment") {
      const paymentId = body.data?.id;
      const payment = await new Payment(client).get({ id: paymentId });

      if (payment.status === "approved") {
        const reference = payment.external_reference; // "userId__courseId"
        if (!reference) return new NextResponse("No reference found", { status: 400 });

        const [userId, courseId] = reference.split("__");

        // GUARDADO EN DB: Coincidiendo con tu schema.prisma
        await db.purchase.upsert({
          where: {
            userId_courseId: { userId, courseId },
          },
          update: {
            status: payment.status,
            amount: Number(payment.transaction_amount),
          },
          create: {
            userId,
            courseId,
            amount: Number(payment.transaction_amount), // Requerido por tu schema
            status: payment.status, // Requerido por tu schema
          },
        });

        console.log(`✅ Acceso liberado: User ${userId} compró ${courseId}`);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[MP_WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}