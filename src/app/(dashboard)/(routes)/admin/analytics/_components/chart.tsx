"use client";

import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts";

interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

export const Chart = ({ data }: ChartProps) => {
  return (
    <div className="h-[350px] w-full bg-white/[0.01] rounded-3xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          {/* Líneas de guía muy sutiles */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#ffffff10" 
          />
          
          <XAxis 
            dataKey="name" 
            stroke="#666666" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          
          <YAxis 
            stroke="#666666" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value}`} 
          />

          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
            contentStyle={{ 
              backgroundColor: '#111', 
              borderColor: '#333', 
              borderRadius: '16px', 
              fontSize: '12px',
              color: '#fff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
          />

          {/* Barra con color Primario / Blanco para contraste */}
          <Bar 
            dataKey="total" 
            fill="#7c3aed" // Cambia esto por tu variable de color primario (ej: #7c3aed es el violeta de Tailwind)
            radius={[6, 6, 0, 0]} 
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};