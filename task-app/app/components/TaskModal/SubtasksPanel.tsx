'use client';

import React, { useState } from 'react';
import { Subtask, Task } from '../../context/TaskContext';
import { Plus, GripVertical, Trash2 } from 'lucide-react';

interface SubtasksPanelProps {
  task: Task;
  onChange: (updates: Partial<Task>) => void;
}

export default function SubtasksPanel({ task, onChange }: SubtasksPanelProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const subtasks = task.subtasks || [];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: Math.random().toString(36).substring(7),
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    onChange({ subtasks: [...subtasks, newSubtask] });
    setNewSubtaskTitle('');
  };

  const handleToggle = (id: string) => {
    onChange({
      subtasks: subtasks.map(st => 
        st.id === id ? { ...st, completed: !st.completed } : st
      )
    });
  };

  const handleDelete = (id: string) => {
    onChange({ subtasks: subtasks.filter(st => st.id !== id) });
  };

  // Basic reorder function (move up/down could be added, or drag-and-drop layer)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...subtasks];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onChange({ subtasks: newItems });
  };

  const handleMoveDown = (index: number) => {
    if (index === subtasks.length - 1) return;
    const newItems = [...subtasks];
    [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    onChange({ subtasks: newItems });
  };

  const completedCount = subtasks.filter(st => st.completed).length;
  const progressPercent = subtasks.length === 0 ? 0 : Math.round((completedCount / subtasks.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Subtasks</h3>
        {subtasks.length > 0 && (
          <span className="text-xs font-medium text-slate-500">
            {completedCount} / {subtasks.length} ({progressPercent}%)
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <div className="space-y-2">
        {subtasks.map((st, i) => (
          <div key={st.id} className="group flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg hover:border-slate-300 transition-colors">
            <div className="flex items-center space-x-3 flex-1">
              <input
                type="checkbox"
                checked={st.completed}
                onChange={() => handleToggle(st.id)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className={`text-sm flex-1 ${st.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {st.title}
              </span>
            </div>
            
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
               <div className="flex flex-col mr-1">
                  <button onClick={() => handleMoveUp(i)} disabled={i===0} className="text-slate-400 hover:text-slate-600 disabled:opacity-30 p-0.5">
                    <GripVertical className="w-3 h-3" />
                  </button>
               </div>
              <button onClick={() => handleDelete(st.id)} className="text-slate-400 hover:text-red-500 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="relative mt-2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Plus className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          placeholder="Add a new subtask..."
          className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </form>
    </div>
  );
}
