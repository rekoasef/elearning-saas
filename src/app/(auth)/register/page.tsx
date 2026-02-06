"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validations/auth"
import { brandConfig } from "@/config/brand"
import { registerUser } from "../actions"
import { AlertCircle, Loader2, CheckCircle2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)
    
    const result = await registerUser(data)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center bg-background">
        <Card className="w-[400px] border-border bg-card shadow-2xl">
          <CardHeader>
            <div className="flex justify-center mb-4 text-primary">
              <div className="p-3 bg-primary/10 rounded-full animate-pulse">
                <Mail className="h-12 w-12" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-bold">¡Revisá tu email!</CardTitle>
            <CardDescription className="text-center text-white/70">
              Hemos enviado un enlace de confirmación a tu correo electrónico. 
              <br /><br />
              <span className="text-primary font-bold">Es obligatorio confirmar tu cuenta</span> para poder acceder a la plataforma.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
              <Link href="/login">Ir al Login</Link>
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              ¿No recibiste nada? Revisá tu carpeta de Spam.
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-background">
      <Card className="w-[400px] border-border bg-card shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-foreground">
            Crear cuenta en {brandConfig.name}
          </CardTitle>
          <CardDescription className="text-center">
            Completá tus datos para registrarte
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                disabled={isLoading}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message as string}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message as string}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                disabled={isLoading}
                {...register("password")} 
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message as string}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrarse
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline font-bold">
                Iniciá sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}