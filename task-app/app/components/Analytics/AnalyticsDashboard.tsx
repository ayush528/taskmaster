'use client';

import React from 'react';
import { Download } from 'lucide-react';
import MetricsCards from './MetricsCards';
import CompletionTrendChart from './CompletionTrendChart';
import CompletionStatusChart from './CompletionStatusChart';
import PriorityBreakdownChart from './PriorityBreakdownChart';
import { useAnalytics } from '../../hooks/useAnalytics';

export default function AnalyticsDashboard() {
  const { metrics } = useAnalytics();

  return (
    <div className="w-full space-y-8 mt-12 border-t border-slate-200 pt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Productivity Analytics</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Deep dive into your task execution and activity.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-1 inline-flex">
            {['This week', 'This month', 'Last 90 days'].map((range, i) => (
               <button 
                 key={range} 
                 className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${i === 0 ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
               >
                 {range}
               </button>
            ))}
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-purple-600 transition-colors">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <CompletionTrendChart />
          <PriorityBreakdownChart />
        </div>
        <div className="col-span-1 space-y-6">
          <CompletionStatusChart />
          
          {/* Additional Stats sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-sm font-bold text-slate-800 mb-6">Key Insights</h3>
            
            <div className="space-y-6 flex-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Most Productive Day</p>
                <p className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-2 border border-slate-100 rounded-lg">
                  {metrics.mostProductiveDay}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Most Common Priority</p>
                <p className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-2 border border-slate-100 rounded-lg">
                  {metrics.mostCommonPriority}
                </p>
              </div>
              
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Category Breakdown</p>
                <div className="space-y-2">
                   <div className="flex items-center justify-between text-sm">
                     <span className="font-semibold text-slate-600 flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Work</span>
                     <span className="font-bold text-slate-900">12 completed</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                     <span className="font-semibold text-slate-600 flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Academic</span>
                     <span className="font-bold text-slate-900">8 completed</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                     <span className="font-semibold text-slate-600 flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Personal</span>
                     <span className="font-bold text-slate-900">5 completed</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
