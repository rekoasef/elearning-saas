import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "" 
});

export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] --- WEBHOOK RECIBIDO ---`);
  
  try {
    const text = await req.text();
    if (!text) return new NextResponse("Empty body", { status: 200 });

    const body = JSON.parse(text);
    // Aseguramos que el ID sea un String
    const paymentId = String(body.data?.id || body.id || "");

    if (!paymentId || paymentId === "" || (body.type !== "payment" && body.action?.split('.')[0] !== "payment")) {
      return new NextResponse("Ignored", { status: 200 });
    }

    // --- LÓGICA DE REINTENTOS ---
    let paymentData: any = null; 
    let attempts = 0;

    while (attempts < 3) {
      try {
        const paymentClient = new Payment(client);
        paymentData = await paymentClient.get({ id: paymentId });
        if (paymentData) break; 
      } catch (error) {
        attempts++;
        console.log(`⚠️ Intento ${attempts}: El pago ${paymentId} aún no es consultable.`);
        if (attempts === 3) return new NextResponse("Payment not found", { status: 200 });
        await new Promise(resolve => setTimeout(resolve, 2500)); 
      }
    }

    // Verificamos que tengamos datos antes de seguir
    if (!paymentData) {
      return new NextResponse("No payment data", { status: 200 });
    }

    console.log("Estado Pago:", paymentData.status);
    console.log("External Reference:", paymentData.external_reference);

    if (paymentData.status === "approved" && paymentData.external_reference) {
      try {
        const data = JSON.parse(paymentData.external_reference as string);
        const { userId, courseId } = data;

        if (!userId || !courseId) {
          console.error("❌ IDs faltantes en external_reference");
          return new NextResponse("Missing IDs", { status: 200 });
        }

        const purchase = await db.purchase.upsert({
          where: {
            userId_courseId: {
              userId: String(userId),
              courseId: String(courseId),
            },
          },
          update: { 
            status: "approved" 
          },
          create: {
            userId: String(userId),
            courseId: String(courseId),
            amount: Number(paymentData.transaction_amount),
            status: "approved",
          },
        });

        console.log(`✅ ÉXITO: Compra registrada ID: ${purchase.id}`);
      } catch (e: any) {
        console.error("❌ ERROR EN BASE DE DATOS:", e.message);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.error("❌ ERROR CRÍTICO WEBHOOK:", error.message);
    return new NextResponse("Internal Error", { status: 200 });
  }
}