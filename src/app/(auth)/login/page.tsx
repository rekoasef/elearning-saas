"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation" // Agregamos useSearchParams
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validations/auth"
import { brandConfig } from "@/config/brand"
import { login } from "../actions"
import { AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Obtenemos el valor de "next" de la URL (ej: /courses/python)
  const redirectTo = searchParams.get("next") || "/dashboard"

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)
    
    const result = await login(data)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.refresh()
      // Redirigimos a la página que guardamos en "redirectTo"
      router.push(redirectTo)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center bg-black">
      <Card className="w-full max-w-[400px] border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-white">{brandConfig.name}</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Ingresá para continuar
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                className="bg-white/5 border-white/10 text-white"
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
            </div>
            <div className="grid gap-2">
              <Label className="text-white">Contraseña</Label>
              <Input 
                type="password" 
                className="bg-white/5 border-white/10 text-white"
                disabled={isLoading}
                {...register("password")} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Iniciar Sesión"}
            </Button>
            <p className="text-sm text-center text-gray-400">
              ¿No tenés cuenta? <Link href="/register" className="text-primary hover:underline">Registrate</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}