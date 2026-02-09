import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "" 
});

export async function POST(req: Request) {
  console.log("--- WEBHOOK RECIBIDO ---");
  
  try {
    const body = await req.json();
    console.log("Body del Webhook:", JSON.stringify(body));

    // Mercado Pago envía el ID en body.data.id para Webhooks
    const paymentId = body.data?.id || body.id;

    if (!paymentId || body.type !== "payment") {
      console.log("No es una notificación de pago válida, ignorando...");
      return new NextResponse("Ignored", { status: 200 });
    }

    const payment = await new Payment(client).get({ id: paymentId });
    console.log("Estado del pago en MP:", payment.status);

    if (payment.status === "approved") {
      const { userId, courseId } = JSON.parse(payment.external_reference as string);

      // Usamos el ID de pago de MP como ID de la transacción para evitar duplicados
      await db.purchase.upsert({
        where: {
          userId_courseId: {
            userId: String(userId),
            courseId: String(courseId),
          },
        },
        update: {
          status: "approved",
        },
        create: {
          userId: String(userId),
          courseId: String(courseId),
          amount: Number(payment.transaction_amount),
          status: "approved",
        },
      });

      console.log(`✅ ÉXITO: Curso ${courseId} asignado al usuario ${userId}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.error("❌ ERROR CRÍTICO EN WEBHOOK:", error.message);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}