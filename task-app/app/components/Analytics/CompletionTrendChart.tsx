'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAnalytics } from '../../hooks/useAnalytics';

export default function CompletionTrendChart() {
  const { metrics } = useAnalytics();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[350px]">
      <h3 className="text-sm font-bold text-slate-800 mb-6">Completion Trend (Last 7 Days)</h3>
      <div className="flex-1 w-full ml-[-20px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics.tasksPerDay}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
              domain={[0, 5]} 
              tickCount={6}
            />
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
               itemStyle={{ color: '#0f172a' }}
               cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }}
            />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3b82f6' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
              name="Tasks Completed" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
