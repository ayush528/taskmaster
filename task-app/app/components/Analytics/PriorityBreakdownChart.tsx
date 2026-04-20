'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '../../hooks/useAnalytics';

export default function PriorityBreakdownChart() {
  const { metrics } = useAnalytics();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[350px]">
      <h3 className="text-sm font-bold text-slate-800 mb-6">Priority Breakdown</h3>
      <div className="flex-1 w-full ml-[-20px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics.priorityBreakdown}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
            />
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
               itemStyle={{ color: '#0f172a' }}
               cursor={{ fill: '#f8fafc' }}
            />
            <Legend 
               verticalAlign="top" 
               height={36} 
               iconType="circle"
               align="right"
               wrapperStyle={{ top: -40 }}
               formatter={(value) => <span style={{ color: '#475569', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{value}</span>}
            />
            <Bar dataKey="completed" name="Completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="pending" name="Pending" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
