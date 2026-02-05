"use client"

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  PlusCircle,
  ChevronRight,
  LogOut,
  Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase-client"; // Asegúrate de tener este helper
import { useState } from "react";
import { toast } from "sonner";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Mis Cursos", icon: BookOpen, href: "/admin/courses" },
  { label: "Nuevo Curso", icon: PlusCircle, href: "/admin/courses/new" },
  { label: "Alumnos", icon: Users, href: "/admin/users" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
      toast.success("Sesión cerrada");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-white/5 shadow-2xl">
      <div className="p-8 flex-1">
        <Link href="/admin" className="flex items-center gap-3 mb-12 group">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center font-black italic text-black text-xl">
            A
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase leading-none">
            Admin<br/><span className="text-primary">Panel</span>
          </span>
        </Link>

        <nav className="space-y-2">
          {routes.map((route) => {
            const isActive = pathname === route.href || (route.href !== "/admin" && pathname.startsWith(route.href));
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px]",
                  isActive 
                    ? "bg-primary text-black shadow-lg shadow-primary/20" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <route.icon size={18} />
                  {route.label}
                </div>
                <ChevronRight size={14} className={isActive ? "opacity-100" : "opacity-0"} />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
              RA
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-white">Renzo Asef</p>
              <p className="text-[8px] font-bold text-gray-500 uppercase">Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}