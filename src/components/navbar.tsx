import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { brandConfig } from "@/config/brand"
import { Button } from "@/components/ui/button"

export default async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-md z-[100]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
          {brandConfig.name}
        </Link>
        
        <div className="flex gap-4 items-center">
          {user ? (
            <Button asChild variant="ghost" className="text-white hover:text-primary">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-white hover:text-primary">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/register">Empezar ahora</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}