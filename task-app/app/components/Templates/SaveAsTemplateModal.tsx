'use client';

import React, { useState } from 'react';
import { useTemplates } from '../../hooks/useTemplates';
import { TaskPriority } from '../../context/TaskContext';
import { useProjects } from '../../hooks/useProjects';
import { X, FolderClosed, Save } from 'lucide-react';

interface SaveAsTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export default function SaveAsTemplateModal({ isOpen, onClose, initialData }: SaveAsTemplateModalProps) {
  const { addTemplate } = useTemplates();
  const { projects } = useProjects();
  
  const [name, setName] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'Normal');
  const [category, setCategory] = useState(initialData?.category || '');
  const [dueOffset, setDueOffset] = useState<number>(0);

  if (!isOpen) return null;

  const handleSave = () => {
    addTemplate({
      name,
      description,
      priority,
      projectId: category || null,
      dueOffset,
      tags: [],
    });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Save as Template</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Template Name</label>
             <input
               autoFocus
               value={name}
               onChange={e => setName(e.target.value)}
               placeholder="e.g. Weekly Report"
               className="w-full text-sm font-semibold border border-slate-200 rounded-lg px-3 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
             />
           </div>

           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
             <textarea
               value={description}
               onChange={e => setDescription(e.target.value)}
               placeholder="Briefly describe what this workflow is for..."
               className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 min-h-[80px]"
             />
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Days Offset</label>
               <input
                 type="number"
                 value={dueOffset}
                 onChange={e => setDueOffset(parseInt(e.target.value) || 0)}
                 className="w-full text-sm font-semibold border border-slate-200 rounded-lg px-3 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
               />
               <p className="text-[10px] text-slate-400 mt-1">Days from creation date</p>
             </div>
             
             <div>
               <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 mt-[2px]">
                 <FolderClosed className="w-3 h-3 mr-1" /> Project
               </label>
               <select
                 value={category}
                 onChange={e => setCategory(e.target.value)}
                 className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
               >
                 <option value="">None</option>
                 {projects.map(pr => (
                    <option key={pr.id} value={pr.name}>{pr.name}</option>
                 ))}
               </select>
             </div>
           </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={!name.trim()}
            className="flex items-center px-6 py-2 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md"
          >
            <Save className="w-4 h-4 mr-2" /> Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
