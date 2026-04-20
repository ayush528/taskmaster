'use client';

import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { CheckCircle2, TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';

export default function MetricsCards() {
  const { metrics } = useAnalytics();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {/* 1. Tasks completed today */}
      <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Today</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-end">
          <p className="text-3xl font-bold text-slate-900 leading-none">{metrics.completedTodayCount}</p>
          {metrics.completionRateTrend === 'up' && (
            <span className="ml-3 flex items-center text-sm font-bold text-emerald-600 mb-0.5">
              <TrendingUp className="w-4 h-4 mr-1" /> +12%
            </span>
          )}
        </div>
      </div>

      {/* 2. This week completion */}
      <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">This Week</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-end space-x-2">
          <p className="text-3xl font-bold text-slate-900 leading-none">
            {metrics.completedThisWeekCount}<span className="text-lg text-slate-400">/{metrics.totalThisWeekCount}</span>
          </p>
          <span className="text-sm font-bold text-slate-500 mb-0.5 px-2 bg-slate-100 rounded-md">
            {Math.round((metrics.completedThisWeekCount / metrics.totalThisWeekCount) * 100)}%
          </span>
        </div>
      </div>

      {/* 3. Average time to complete */}
      <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Time</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-end">
          <p className="text-3xl font-bold text-slate-900 leading-none">{metrics.averageCompletionTimeHours}<span className="text-lg font-semibold text-slate-500 ml-1">h</span></p>
          <span className="ml-3 flex items-center text-sm font-bold text-emerald-600 mb-0.5">
            <TrendingDown className="w-4 h-4 mr-1" /> vs 5.1h
          </span>
        </div>
      </div>

      {/* 4. Overdue Tasks */}
      <div className="flex flex-col justify-center rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Overdue Tasks</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-end">
          <p className="text-3xl font-bold text-red-600 leading-none">{metrics.overdueCount}</p>
          <span className="ml-3 text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider mb-0.5">
            Action Needed
          </span>
        </div>
      </div>
    </div>
  );
}
