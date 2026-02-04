// src/app/layout.tsx completo
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from "sonner";

// Añadimos display: 'swap' y fallback
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false // Esto ayuda si hay problemas de timeout
})

export const metadata = {
  title: 'Plataforma E-learning',
  description: 'Aprende programación con proyectos reales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>{children}</body>
      <Toaster position="bottom-right" richColors theme="dark" />
    </html>
  )
}