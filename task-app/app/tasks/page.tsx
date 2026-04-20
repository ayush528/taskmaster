'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Calendar, ChevronDown, Check, FolderClosed, Clock, Trash2, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailsModal from '../components/TaskModal/TaskDetailsModal';

export default function TasksPage() {
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const PriorityDot = ({ priority }: { priority: string }) => {
    switch (priority) {
      case 'High Priority':
      case 'Urgent':
        return <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5" />;
      case 'Medium Priority':
        return <div className="h-2 w-2 rounded-full bg-amber-500 mr-1.5" />;
      case 'Normal':
      case 'Low Priority':
        return <div className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500 mr-1.5" />;
    }
  };

  const PriorityPill = ({ priority }: { priority: string }) => {
    let colorClass = 'bg-blue-50 text-blue-700';
    if (priority === 'High Priority' || priority === 'Urgent') colorClass = 'bg-red-50 text-red-700';
    if (priority === 'Medium Priority') colorClass = 'bg-amber-50 text-amber-700';
    if (priority === 'Low Priority' || priority === 'Normal') colorClass = 'bg-emerald-50 text-emerald-700';

    return (
      <div className={`flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${colorClass}`}>
        <PriorityDot priority={priority} />
        {priority}
      </div>
    );
  };

  return (
    <DashboardLayout title="">
      {/* Top Header Section overriding the empty title */}
      <div className="flex items-center justify-between mb-6 border-b border-transparent">
        <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
        <div className="flex items-center text-sm font-medium text-slate-500">
          <Calendar className="mr-2 h-4 w-4" />
          {currentDate}
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
            All Tasks
          </button>
          <button className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            Priority
            <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
          </button>
          <button className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            Deadline
            <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
          </button>
          <button className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            Status
            <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
          </button>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
          Add New Task
        </button>
      </div>

      <div className="space-y-4 mb-12">
        {pendingTasks.map(task => (
          <div 
            key={task.id} 
            onClick={() => setSelectedTaskId(task.id)}
            className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-slate-300 cursor-pointer"
          >
            <div className="flex items-start space-x-5 relative w-full">
              <div className="pt-0.5">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(task.id); }}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 text-transparent hover:border-blue-600 transition-colors group-hover:bg-slate-50"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{task.title}</h3>
                <div className="flex items-center mt-2 space-x-4 text-xs font-medium text-slate-500">
                  <PriorityPill priority={task.priority} />
                  <div className="flex items-center text-slate-400">
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    Due {task.deadline}
                  </div>
                  {task.category && (
                    <div className="flex items-center text-slate-400">
                      <FolderClosed className="mr-1.5 h-3.5 w-3.5" />
                      {task.category}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {pendingTasks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            All caught up! No tasks left.
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-4">
          {completedTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => setSelectedTaskId(task.id)}
              className="group flex items-center justify-between rounded-2xl border border-transparent bg-transparent p-5 transition-all hover:bg-white hover:shadow-sm hover:border-slate-100 opacity-70 cursor-pointer"
            >
              <div className="flex items-start space-x-5 relative w-full">
                <div className="pt-0.5">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(task.id); }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 border-2 border-blue-600 text-white transition-opacity hover:opacity-80"
                  >
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-500 text-base line-through group-hover:text-blue-600 transition-colors">{task.title}</h3>
                  <div className="flex items-center mt-1 text-xs font-medium text-slate-400">
                    Completed
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 relative"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TaskDetailsModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </DashboardLayout>
  );
}
