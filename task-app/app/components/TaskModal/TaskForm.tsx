'use client';

import React from 'react';
import { Task } from '../../context/TaskContext';

interface TaskFormProps {
  task: Task;
  onChange: (updates: Partial<Task>) => void;
}

export default function TaskForm({ task, onChange }: TaskFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <input
          type="text"
          value={task.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full text-3xl font-extrabold text-slate-900 border-none bg-transparent placeholder-slate-300 focus:outline-none focus:ring-0 px-0 mb-2"
          placeholder="Task Title"
        />
      </div>

      <div>
        <textarea
          value={task.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full min-h-[140px] text-sm text-slate-700 bg-white border border-slate-200 rounded-xl p-4 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-y leading-relaxed shadow-sm"
          placeholder="Add a detailed description..."
        />
      </div>
    </div>
  );
}
