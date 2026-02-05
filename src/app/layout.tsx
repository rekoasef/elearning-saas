import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevAcademy - Plataforma de E-learning",
  description: "Aprende programación con los mejores cursos prácticos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {/* El Navbar es 'fixed', por lo que no ocupa espacio en el flujo. 
            Todas las páginas deberán tener un padding superior (ej. pt-20) 
            para que el contenido no quede debajo del Navbar.
        */}
        <Navbar />
        
        <main>
          {children}
        </main>

        {/* Notificaciones globales (Toast) */}
        <Toaster 
          position="bottom-right" 
          richColors 
          theme="dark" 
          closeButton
        />
      </body>
    </html>
  );
}