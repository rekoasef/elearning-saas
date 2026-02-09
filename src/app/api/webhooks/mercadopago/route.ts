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
    const paymentId = body.data?.id || body.id;

    if (!paymentId) {
      return new NextResponse("ID no encontrado", { status: 200 });
    }

    // Intentamos obtener el pago de Mercado Pago
    let payment;
    try {
      payment = await new Payment(client).get({ id: paymentId });
    } catch (error) {
      console.log("⚠️ El pago no existe en MP (es normal en pruebas de simulación)");
      return new NextResponse("Pago ficticio recibido correctamente", { status: 200 });
    }

    // Si el pago existe y está aprobado, procesamos la lógica de la base de datos
    if (payment.status === "approved" && payment.external_reference) {
      const { userId, courseId } = JSON.parse(payment.external_reference as string);

      await db.purchase.upsert({
        where: {
          userId_courseId: {
            userId: String(userId),
            courseId: String(courseId),
          },
        },
        update: { status: "approved" },
        create: {
          userId: String(userId),
          courseId: String(courseId),
          amount: Number(payment.transaction_amount),
          status: "approved",
        },
      });

      console.log(`✅ Curso ${courseId} asignado al usuario ${userId}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.error("❌ ERROR EN WEBHOOK:", error.message);
    return new NextResponse("Error interno pero conexión exitosa", { status: 200 });
  }
}