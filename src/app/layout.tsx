import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Navbar />
        {/* El padding-top aquí asegura que ninguna página empiece debajo del navbar */}
        <div className="relative flex min-h-screen flex-col pt-20">
          {children}
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}