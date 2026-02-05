import { db } from "@/lib/db";
import { SalesChart } from "@/components/admin/sales-chart";
import { 
  DollarSign, Users, BookOpen, TrendingUp, 
  Award, Zap, Activity, ArrowRight 
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const purchases = await db.purchase.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "asc" }
  });

  const totalRevenue = purchases.reduce((acc, curr) => acc + curr.amount, 0);
  const totalUsers = await db.user.count({ where: { role: "USER" } });
  const totalCourses = await db.course.count();

  // Lógica de agrupamiento para el gráfico
  const monthlyData = purchases.reduce((acc: any, purchase) => {
    const month = new Date(purchase.createdAt).toLocaleString('es-ES', { month: 'short' });
    if (!acc[month]) acc[month] = 0;
    acc[month] += purchase.amount;
    return acc;
  }, {});
  const chartData = Object.keys(monthlyData).map(month => ({ name: month, total: monthlyData[month] }));

  // Lista de alumnos con progreso real
  const students = await db.user.findMany({
    where: { role: "USER" },
    take: 5,
    include: {
      progress: true,
      purchases: { where: { status: "approved" } }
    }
  });

  return (
    <div className="space-y-10 pb-20 pt-28 md:pt-10 px-4 md:px-6">
      <header className="space-y-2 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">
          Admin <span className="text-primary">MasterPanel</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base italic font-medium">
          Control total de métricas financieras y compromiso educativo.
        </p>
      </header>

      {/* MÉTRICAS TOP: 1 col en mobile, 2 en tablet, 4 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard title="Caja Total" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign className="text-green-500" />} />
        <MetricCard title="Alumnos" value={totalUsers.toString()} icon={<Users className="text-blue-500" />} />
        <MetricCard title="Ticket Promedio" value={`$${totalUsers > 0 ? (totalRevenue / totalUsers).toFixed(0) : 0}`} icon={<Zap className="text-yellow-500" />} />
        <MetricCard title="Cursos" value={totalCourses.toString()} icon={<BookOpen className="text-primary" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRÁFICO: Ocupa todo el ancho en mobile, 2/3 en desktop */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" /> Ventas Mensuales
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <SalesChart data={chartData} />
          </div>
        </div>

        {/* LISTA RÁPIDA DE ALUMNOS */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 backdrop-blur-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
               <Activity size={20} className="text-primary" /> Actividad
            </h2>
            <Link href="/admin/users" className="text-[10px] font-black uppercase text-primary hover:underline">Ver Todos</Link>
          </div>
          
          <div className="space-y-6">
            {students.map((student) => (
              <div key={student.id} className="group">
                <div className="flex justify-between items-end mb-2">
                  <p className="font-bold text-sm text-gray-200 truncate pr-4">{student.name || "Alumno"}</p>
                  <span className="text-[10px] font-black text-primary italic">Activo</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/50 w-[70%]" /> {/* Placeholder de progreso */}
                </div>
              </div>
            ))}
          </div>

          <Link href="/admin/users" className="block mt-10">
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
              Gestionar Alumnos
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white/[0.05] transition-all group">
      <div className="p-3 bg-black/40 w-fit rounded-xl border border-white/5 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl md:text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
}