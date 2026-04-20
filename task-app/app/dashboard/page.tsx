'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Plus, RefreshCw } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailsModal from '../components/TaskModal/TaskDetailsModal';
import RemindersWidget from '../components/Reminders/RemindersWidget';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';

export default function DashboardPage() {
  const { tasks, toggleTaskCompletion } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Derived state
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const inProgressTasks = pendingTasks; // Simple logic for demo
  const overdueTasks = 2; // Hardcoded for visual matching

  const todaysTasks = tasks.filter(t => t.status !== 'completed').slice(0, 4); 

  return (
    <DashboardLayout title="Dashboard Overview">
      {/* Welcome Banner */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-slate-500 font-medium">
            You have <span className="text-blue-600 font-semibold">{pendingTasks} tasks</span> due today. Let&apos;s make it a productive day.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
            Add Task
          </button>
          <Link 
            href="/tasks"
            className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            View All Tasks
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="flex items-center rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mr-4">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-900 leading-none">{totalTasks}</p>
          </div>
        </div>
        
        <div className="flex items-center rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 mr-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-slate-900 leading-none">{completedTasks}</p>
          </div>
        </div>

        <div className="flex items-center rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 mr-4">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-slate-900 leading-none">{inProgressTasks}</p>
          </div>
        </div>

        <div className="flex items-center rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 mr-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Overdue</p>
            <p className="text-2xl font-bold text-slate-900 leading-none">{overdueTasks}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Today&apos;s Tasks</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Schedule</button>
          </div>
          
          <div className="space-y-3">
            {todaysTasks.length === 0 ? (
              <p className="text-sm text-slate-500 p-4 text-center border border-dashed rounded-xl border-slate-300">No tasks for today. Great job!</p>
            ) : (
              todaysTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => setSelectedTaskId(task.id)}
                  className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-300 cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="pt-1">
                      <div 
                        onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(task.id); }}
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-slate-300 text-transparent transition-colors hover:border-blue-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                      <div className="flex items-center mt-1 space-x-2 text-xs font-medium text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Due {task.deadline}</span>
                        {task.category && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">{task.category}</span>
                          </>
                        )}
                        {task.recurringRule && (
                          <>
                            <span>•</span>
                            <span className="flex items-center text-purple-600 font-bold" title={`Repeats ${task.recurringRule.frequency}`}>
                               <RefreshCw className="w-3 h-3 mr-1" /> Recurring
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                      task.priority === 'High Priority' ? 'bg-orange-100 text-orange-700' :
                      task.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Medium Priority' ? 'bg-slate-100 text-slate-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reminders Widget */}
        <div className="col-span-1 space-y-8">
          <RemindersWidget />
        </div>
      </div>
      
      {/* Expanded Analytics Dashboard */}
      <AnalyticsDashboard />

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TaskDetailsModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </DashboardLayout>
  );
}
