'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export async function login(formData: any, redirectTo?: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: "Credenciales inválidas" }
  }

  revalidatePath('/', 'layout')
  
  // Si existe una ruta de redirección (ej: volver al curso), vamos ahí. 
  // Si no, al dashboard por defecto.
  const targetPath = redirectTo || '/dashboard'
  redirect(targetPath)
}

export async function registerUser(data: any) {
  const supabase = createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.name,
      }
    }
  })

  if (authError) return { error: authError.message }

  if (authData.user) {
    try {
      await db.user.create({
        data: {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: "USER"
        }
      })
    } catch (dbError) {
      console.error("Error sincronizando con Prisma:", dbError)
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}