'use client';

import React from 'react';
import { Check, Clock, FolderClosed, AlertCircle } from 'lucide-react';
import { Task } from '../../context/TaskContext';

interface DateTaskPanelProps {
  selectedDate: Date;
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
}

export default function DateTaskPanel({ selectedDate, tasks, toggleTaskCompletion }: DateTaskPanelProps) {
  const formattedDateString = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long', 
    day: 'numeric'
  });

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Urgent':
      case 'URGENT':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High Priority':
      case 'HIGH PRIORITY':
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium Priority':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low Priority':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tasks for {formattedDateString}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} scheduled
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No tasks scheduled</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Enjoy your free time, or click another date in the calendar to see more tasks.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 bg-white hover:shadow-sm transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="pt-0.5">
                  <button 
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-colors
                      ${task.status === 'completed' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 text-transparent hover:border-blue-500 group-hover:bg-slate-50'}
                    `}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </div>
                <div>
                  <h3 className={`font-semibold text-slate-900 transition-colors ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center mt-1.5 space-x-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {task.deadline}
                    </div>
                    {task.category && (
                      <div className="flex items-center text-blue-600">
                        <FolderClosed className="w-3.5 h-3.5 mr-1.5" />
                        {task.category}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center pl-4">
                <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getPriorityBadgeClass(task.priority)}`}>
                  {(task.priority as string).toUpperCase() === 'URGENT' ? <AlertCircle className="w-3 h-3 mr-1" /> : null}
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
