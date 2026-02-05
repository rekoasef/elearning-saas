"use client"

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, CreditCard } from "lucide-react";

interface Props {
  courseId: string;
}

export function EnrollmentButton({ courseId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Debes iniciar sesión para comprar");
          window.location.assign("/login");
          return;
        }
        throw new Error();
      }

      const { url } = await response.json();
      
      // Redirigir al Checkout Pro de Mercado Pago
      window.location.assign(url);
      
    } catch (error) {
      toast.error("Hubo un error al procesar el pago");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full bg-primary hover:bg-primary/90 text-black py-5 rounded-2xl font-black italic uppercase transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          <CreditCard size={20} className="group-hover:scale-110 transition-transform" />
          Adquirir Curso Ahora
        </>
      )}
    </button>
  );
}