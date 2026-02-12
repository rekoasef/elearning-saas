"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-white transition-colors"
    >
      <LogOut size={16} />
      Cerrar Sesión
    </button>
  );
};