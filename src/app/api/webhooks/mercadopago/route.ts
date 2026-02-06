import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "" 
});

export async function POST(req: Request) {
  // Intentamos obtener el ID tanto del body como de la URL (IPN vs Webhook)
  const body = await req.json();
  const url = new URL(req.url);
  const id = body.data?.id || url.searchParams.get("data.id");

  if (!id) {
    return new NextResponse("ID no encontrado", { status: 400 });
  }

  try {
    const payment = await new Payment(client).get({ id });

    // Verificamos si el pago fue aprobado
    if (payment.status === "approved") {
      // Extraemos la info que guardamos en 'external_reference'
      const { userId, courseId } = JSON.parse(payment.external_reference as string);

      const userIdStr = String(userId);
      const courseIdStr = String(courseId);

      // Los campos 'amount' y 'status' son obligatorios en tu nuevo esquema
      const amount = payment.transaction_amount;
      const status = payment.status;

      await db.purchase.upsert({
        where: {
          userId_courseId: {
            userId: userIdStr,
            courseId: courseIdStr,
          },
        },
        update: {
          status: status, // Actualizamos el estado por si acaso
        }, 
        create: {
          amount: amount as number, // Valor obligatorio
          status: status as string, // Valor obligatorio
          user: {
            connect: { id: userIdStr }
          },
          course: {
            connect: { id: courseIdStr }
          }
        },
      });

      console.log(`✅ Pago aprobado: Curso ${courseId} asignado al usuario ${userId}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Error en Webhook MP:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}