import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "" 
});

// Log de inicialización (se ve una vez cuando Vercel levanta la instancia)
console.log("🚀 RUTA WEBHOOK INICIALIZADA");

export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] --- WEBHOOK RECIBIDO ---`);
  
  try {
    // BLINDAJE 1: Manejo de body vacío o mal formado
    const text = await req.text();
    if (!text) {
      console.log("⚠️ Notificación recibida sin cuerpo (ping de validación)");
      return new NextResponse("Empty body", { status: 200 });
    }

    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      console.error("❌ Error parseando JSON:", text);
      return new NextResponse("Invalid JSON", { status: 200 }); // Retornamos 200 para que MP no reintente algo roto
    }

    // Mercado Pago envía el ID en data.id para eventos de pago
    const paymentId = body.data?.id || body.id;

    if (!paymentId) {
      console.log("⚠️ No se encontró ID de pago en el body");
      return new NextResponse("ID no encontrado", { status: 200 });
    }

    // BLINDAJE 2: Validación del tipo de notificación
    // Solo procesamos pagos para evitar errores con otros eventos (merchant_order, etc.)
    if (body.type !== "payment" && body.action?.split('.')[0] !== "payment") {
      console.log(`ℹ️ Notificación de tipo ${body.type || body.action} ignorada`);
      return new NextResponse("Ignored type", { status: 200 });
    }

    // Intentamos obtener el pago de los servidores de Mercado Pago
    let payment;
    try {
      payment = await new Payment(client).get({ id: paymentId });
    } catch (error) {
      console.log("⚠️ El pago no existe en MP (es normal en pruebas de simulación)");
      return new NextResponse("Test notification OK", { status: 200 });
    }

    // BLINDAJE 3: Verificación de estado y referencia externa
    if (payment.status === "approved" && payment.external_reference) {
      try {
        const { userId, courseId } = JSON.parse(payment.external_reference as string);

        if (!userId || !courseId) {
          throw new Error("userId o courseId ausentes en external_reference");
        }

        // Operación en Base de Datos
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

        console.log(`✅ ÉXITO TOTAL: Curso ${courseId} asignado al usuario ${userId}`);
      } catch (parseError) {
        console.error("❌ Error procesando external_reference:", payment.external_reference);
      }
    } else {
      console.log(`ℹ️ Pago recibido con estado: ${payment.status}. No se requiere acción.`);
    }

    return new NextResponse("OK", { status: 200 });

  } catch (error: any) {
    console.error("❌ ERROR CRÍTICO EN WEBHOOK:", error.message);
    // Siempre retornamos 200 si la conexión fue exitosa para evitar que MP se quede en bucle de reintentos
    return new NextResponse("Error interno procesado", { status: 200 });
  }
}