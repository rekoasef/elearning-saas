import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Aquí NO va el Navbar. Solo el contenido y las notificaciones */}
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}