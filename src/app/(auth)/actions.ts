'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export async function login(formData: any) {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: "Credenciales inválidas" }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function registerUser(data: any) {
  const supabase = createClient()

  // 1. Registro en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  })

  if (authError) return { error: authError.message }

  // 2. Sincronización con nuestra DB (Prisma)
  if (authData.user) {
    try {
      await db.user.create({
        data: {
          id: authData.user.id, // Sincronizamos IDs
          email: data.email,
          name: data.name,
          role: "USER" // Por defecto son Alumnos
        }
      })
    } catch (dbError) {
      console.error("Error sincronizando con Prisma:", dbError)
      // Nota: Aquí podrías manejar si el usuario ya existe en Prisma
    }
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Cuenta creada. Por favor, inicia sesión.')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
