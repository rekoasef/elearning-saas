"use client"

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada correctamente");
    router.push("/");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all w-full"
    >
      <LogOut size={14} />
      Cerrar Sesión
    </button>
  );
}