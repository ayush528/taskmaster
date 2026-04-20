'use client';

import React, { useState } from 'react';
import { useRecurringTasks } from '../../hooks/useRecurringTasks';
import { Task } from '../../context/TaskContext';

interface RecurrenceOptionsProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onConfirmEdit: (scope: 'single' | 'future' | 'all') => void;
  onConfirmDelete: (scope: 'single' | 'future' | 'all') => void;
  mode: 'edit' | 'delete';
}

export default function RecurrenceOptions({ task, isOpen, onClose, onConfirmEdit, onConfirmDelete, mode }: RecurrenceOptionsProps) {
  const [scope, setScope] = useState<'single' | 'future' | 'all'>('single');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (mode === 'edit') onConfirmEdit(scope);
    if (mode === 'delete') onConfirmDelete(scope);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-6">
         <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{mode === 'edit' ? 'Edit' : 'Delete'} Recurring Task</h3>
            <p className="text-sm font-medium text-slate-500">
              This task is part of a recurring series. Would you like to apply this {mode} to this occurrence only, or to the entire series?
            </p>
         </div>

         <div className="space-y-3">
           <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <input type="radio" checked={scope === 'single'} onChange={() => setScope('single')} className="text-purple-600 focus:ring-purple-500 w-4 h-4" />
              <div className="flex flex-col">
                 <span className="text-sm font-bold text-slate-800">This occurrence only</span>
              </div>
           </label>
           <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <input type="radio" checked={scope === 'future'} onChange={() => setScope('future')} className="text-purple-600 focus:ring-purple-500 w-4 h-4" />
              <div className="flex flex-col">
                 <span className="text-sm font-bold text-slate-800">This and all future occurrences</span>
                 {mode === 'delete' && <span className="text-xs font-semibold text-red-500 mt-1">Warning: Deletes future records</span>}
              </div>
           </label>
           <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <input type="radio" checked={scope === 'all'} onChange={() => setScope('all')} className="text-purple-600 focus:ring-purple-500 w-4 h-4" />
              <div className="flex flex-col">
                 <span className="text-sm font-bold text-slate-800">Entire series</span>
              </div>
           </label>
         </div>

         <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleConfirm} className={`px-5 py-2 text-sm font-bold text-white shadow-md rounded-lg transition-all ${mode === 'delete' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'}`}>
              Confirm {mode === 'delete' ? 'Delete' : 'Edit'}
            </button>
         </div>
      </div>
    </div>
  );
}
