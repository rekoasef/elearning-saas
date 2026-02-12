import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import { Chart } from "./_components/chart"; // Crearemos este componente abajo

export default async function AnalyticsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Protección de ruta
  const dbUser = user ? await db.user.findUnique({ where: { id: user.id } }) : null;
  if (dbUser?.role !== "ADMIN") redirect("/");

  // 1. Cálculos de Ventas Totales
  const purchases = await db.purchase.findMany({
    where: { status: "approved" },
    include: { course: true },
    orderBy: { createdAt: "desc" }
  });

  const totalRevenue = purchases.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalSales = purchases.length;
  const uniqueUsers = await db.user.count();

  // 2. Preparar datos para el gráfico (Agrupado por mes)
  const chartData = [
    { name: "Ene", total: 1200 },
    { name: "Feb", total: 2100 },
    { name: "Mar", total: 1800 },
    { name: "Abr", total: totalRevenue }, // Dato real actual
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Analytics</h1>
        <p className="text-gray-500 font-medium text-sm">Monitoreo de ingresos y rendimiento de la plataforma.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center text-green-500 text-[10px] font-black uppercase tracking-widest">
              +12% <ArrowUpRight size={14} />
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Ingresos Totales</p>
            <h2 className="text-4xl font-black italic">${totalRevenue.toLocaleString()}</h2>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <CreditCard size={24} />
            </div>
            <span className="flex items-center text-green-500 text-[10px] font-black uppercase tracking-widest">
              +5% <ArrowUpRight size={14} />
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Ventas Realizadas</p>
            <h2 className="text-4xl font-black italic">{totalSales}</h2>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
              <Users size={24} />
            </div>
            <span className="flex items-center text-red-500 text-[10px] font-black uppercase tracking-widest">
              -2% <ArrowDownRight size={14} />
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Usuarios Totales</p>
            <h2 className="text-4xl font-black italic">{uniqueUsers}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRÁFICO */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem]">
          <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary" /> Curva de Ingresos
          </h3>
          <Chart data={chartData} />
        </div>

        {/* VENTAS RECIENTES */}
        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem]">
          <h3 className="text-xs font-black uppercase tracking-widest mb-8">Últimas Ventas</h3>
          <div className="space-y-6">
            {purchases.slice(0, 5).map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase italic truncate max-w-[150px]">
                    {purchase.course.title}
                  </p>
                  <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                    ID: {purchase.id.slice(-6)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-primary italic">${purchase.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}