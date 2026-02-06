import Link from "next/link";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  BarChart3,
  PlusCircle
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Vista General", href: "/admin" },
  { icon: BookOpen, label: "Cursos", href: "/admin/courses" },
  { icon: Users, label: "Usuarios", href: "/admin/users" },
  { icon: BarChart3, label: "Ventas", href: "/admin/analytics" },
];

export function AdminSidebar() {
  return (
    <div className="flex flex-col h-full p-4 gap-2">
      <div className="mb-6 px-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
          Administración
        </p>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
          >
            <item.icon size={18} className="group-hover:text-primary transition-colors" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/5">
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
        >
          <PlusCircle size={18} />
          Nuevo Curso
        </Link>
      </div>
    </div>
  );
}