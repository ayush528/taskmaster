'use client';

import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useTasks } from '../context/TaskContext';

export default function ProgressPage() {
  const { tasks } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <DashboardLayout title="Progress">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Productivity</h1>
        <p className="text-slate-500 font-medium">
          Track and analyze your task completion rates over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Overall Progress</h2>
          <div className="flex items-center justify-center py-8">
            <div className="relative h-64 w-64">
              {/* Circular progress dummy */}
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-blue-600 transition-all duration-1000 ease-out"
                  strokeDasharray={`${progressPercentage}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-900">{progressPercentage}%</span>
                <span className="text-sm font-semibold text-slate-500 mt-1">Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Task Statistics</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Total Tasks Created</span>
              <span className="text-xl font-bold text-slate-900">{totalTasks}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
              <span className="font-semibold text-blue-700">Tasks Completed</span>
              <span className="text-xl font-bold text-blue-900">{completedTasks}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50 border border-orange-100">
              <span className="font-semibold text-orange-700">Tasks Pending</span>
              <span className="text-xl font-bold text-orange-900">{pendingTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
