import { createClient } from "@/lib/supabase-server";
import { db } from "@/lib/db";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Menu, 
  BookOpen, 
  Users, 
  BarChart3, 
  User, 
  Settings, 
  LogOut 
} from "lucide-react";
import { LogoutButton } from "./navbar/logout-button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const dbUser = user ? await db.user.findUnique({ where: { id: user.id } }) : null;

  const isAdmin = dbUser?.role === "ADMIN";

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter">
          DEV<span className="text-primary italic">ACADEMY</span>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-3 p-1 pr-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-black text-black">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-white">
                      {dbUser?.name || "Alumno"}
                    </p>
                    <p className="text-[9px] text-gray-500 font-bold leading-none">
                      {isAdmin ? "ADMINISTRADOR" : "ESTUDIANTE"}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-black border-white/10 text-white rounded-2xl p-2 shadow-2xl" align="end">
                <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                
                <Link href="/dashboard">
                  <DropdownMenuItem className="rounded-xl p-3 gap-3 focus:bg-white/10 cursor-pointer">
                    <LayoutDashboard size={18} className="text-primary" /> 
                    <span className="font-bold text-sm text-gray-200">Mi Panel</span>
                  </DropdownMenuItem>
                </Link>

                <Link href="/dashboard/profile">
                  <DropdownMenuItem className="rounded-xl p-3 gap-3 focus:bg-white/10 cursor-pointer">
                    <User size={18} className="text-primary" /> 
                    <span className="font-bold text-sm text-gray-200">Mi Perfil</span>
                  </DropdownMenuItem>
                </Link>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary">Gestión Admin</DropdownMenuLabel>
                    <Link href="/admin">
                      <DropdownMenuItem className="rounded-xl p-3 gap-3 focus:bg-primary/10 cursor-pointer">
                        <ShieldCheck size={18} className="text-primary" /> 
                        <span className="font-bold text-sm text-gray-200">Dashboard Admin</span>
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                
                <DropdownMenuSeparator className="bg-white/5" />
                <div className="p-1">
                  <LogoutButton />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <button className="bg-primary hover:bg-primary/90 text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                Iniciar Sesión
              </button>
            </Link>
          )}
        </div>

        {/* --- MOBILE NAV --- */}
        <div className="md:hidden flex items-center gap-4">
          <Sheet>
            <SheetTrigger className="p-2 bg-white/5 rounded-xl border border-white/10">
              <Menu size={20} className="text-white" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-white/10 w-[85%] p-6 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-10 mt-10">
                
                {/* Alumno */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Plataforma</p>
                  <div className="grid gap-6">
                    <Link href="/dashboard" className="flex items-center gap-4 text-2xl font-black italic hover:text-primary transition-colors">
                      <LayoutDashboard size={24} /> MI PANEL
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-4 text-2xl font-black italic hover:text-primary transition-colors">
                      <User size={24} /> MI PERFIL
                    </Link>
                  </div>
                </div>

                {/* Admin */}
                {isAdmin && (
                  <div className="pt-10 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Administración</p>
                    <div className="grid gap-6">
                      <Link href="/admin" className="flex items-center gap-4 text-xl font-bold hover:text-primary transition-colors">
                        <ShieldCheck size={20} /> Dashboard
                      </Link>
                      <Link href="/admin/courses" className="flex items-center gap-4 text-xl font-bold hover:text-primary transition-colors">
                        <BookOpen size={20} /> Cursos
                      </Link>
                      <Link href="/admin/users" className="flex items-center gap-4 text-xl font-bold hover:text-primary transition-colors">
                        <Users size={20} /> Usuarios
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Mobile */}
              <div className="pt-6 border-t border-white/5">
                {user ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-black text-black">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-black text-white uppercase tracking-tighter truncate">{dbUser?.name || "Alumno"}</p>
                        <p className="text-[10px] text-gray-500 font-medium truncate">{user.email}</p>
                      </div>
                    </div>
                    <LogoutButton />
                  </div>
                ) : (
                  <Link href="/login" className="block w-full bg-primary py-4 text-center rounded-2xl font-black text-black uppercase tracking-widest text-xs">
                    INICIAR SESIÓN
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}