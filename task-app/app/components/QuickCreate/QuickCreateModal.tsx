'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTasks, Task, TaskPriority } from '../../context/TaskContext';
import { useProjects } from '../../hooks/useProjects';
import { useSettings } from '../../hooks/useSettings';
import { applyTemplateToTaskData, Template } from '../../lib/templateUtils';
import TemplateSelector from '../Templates/TemplateSelector';
import { X, Calendar as CalendarIcon, Flag, FolderClosed } from 'lucide-react';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickCreateModal({ isOpen, onClose }: QuickCreateModalProps) {
  const { addTask, deleteTask } = useTasks();
  const { projects } = useProjects();
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('Medium Priority');
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
      
      // Default reset
      setTitle('');
      setDeadline(new Date().toISOString().split('T')[0]);
      
      if (settingsLoaded) {
         const p = settings.taskDefaults.priority;
         setPriority(p === 'high' ? 'High Priority' : p === 'low' ? 'Low Priority' : 'Medium Priority');
         setCategory(settings.taskDefaults.category || '');
      } else {
         setPriority('Medium Priority');
         setCategory('');
      }
    }
  }, [isOpen, settingsLoaded, settings.taskDefaults]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!title.trim()) return;

    const newTask: Omit<Task, 'id' | 'status'> = {
      title,
      description: '',
      deadline,
      priority,
      category,
      tags: [],
    };
    
    // Create task
    addTask(newTask);
    
    // Simulate toast
    alert(`Task created: ${title}`);
    
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && title.trim()) {
      handleCreate();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const setD = (offset: number) => {
    const d = new Date(); d.setDate(d.getDate() + offset);
    setDeadline(d.toISOString().split('T')[0]);
  };
  
  const setNextSun = () => {
    const d = new Date();
    d.setDate(d.getDate() + (7 - d.getDay()));
    setDeadline(d.toISOString().split('T')[0]);
  };

  const applyTemplate = (tpl: Template) => {
    const data = applyTemplateToTaskData(tpl);
    setTitle(data.title);
    setPriority(data.priority);
    setDeadline(data.deadline);
    if (data.category) setCategory(data.category);
  };

  const priorities: { label: string; val: TaskPriority; color: string }[] = [
    { label: 'URGENT', val: 'Urgent', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
    { label: 'HIGH', val: 'High Priority', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { label: 'NORMAL', val: 'Medium Priority', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { label: 'LOW', val: 'Low Priority', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
          <h2 className="text-sm font-bold text-slate-800 tracking-wider uppercase">Quick Create</h2>
          
          <div className="flex items-center space-x-3">
            <TemplateSelector onSelect={applyTemplate} />
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
           <input
             ref={titleInputRef}
             type="text"
             value={title}
             onChange={e => setTitle(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder="What needs to be done?"
             className="w-full text-2xl font-extrabold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 px-0 placeholder-slate-300"
           />

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {/* Due Date */}
             <div>
               <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                 <CalendarIcon className="w-4 h-4 mr-1.5" /> Due Date
               </label>
               <div className="grid grid-cols-2 gap-2 mb-2">
                 <button onClick={() => setD(0)} className="text-[10px] font-bold uppercase py-1.5 border border-slate-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg text-slate-600 transition-colors">Today</button>
                 <button onClick={() => setD(1)} className="text-[10px] font-bold uppercase py-1.5 border border-slate-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg text-slate-600 transition-colors">Tomorrow</button>
                 <button onClick={setNextSun} className="text-[10px] font-bold uppercase py-1.5 border border-slate-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg text-slate-600 transition-colors">This Week</button>
                 <label className="relative flex items-center justify-center cursor-pointer text-[10px] font-bold uppercase py-1.5 border border-slate-200 hover:border-purple-300 hover:bg-purple-50 rounded-lg text-slate-600 transition-colors">
                   Pick Date
                   <input 
                     type="date" 
                     className="absolute inset-0 opacity-0 cursor-pointer" 
                     value={deadline}
                     onChange={(e) => setDeadline(e.target.value)} 
                   />
                 </label>
               </div>
               <div className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-md inline-block">Selected: {deadline}</div>
             </div>

             {/* Priority & Category */}
             <div className="space-y-4">
                <div>
                   <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                     <Flag className="w-4 h-4 mr-1.5" /> Priority
                   </label>
                   <div className="flex flex-wrap gap-2">
                      {priorities.map(p => (
                         <button 
                           key={p.val}
                           onClick={() => setPriority(p.val)}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-colors ${priority === p.val ? p.color + ' ring-2 ring-offset-1 ring-slate-300' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                         >
                           {p.label}
                         </button>
                      ))}
                   </div>
                </div>

                <div>
                   <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                     <FolderClosed className="w-4 h-4 mr-1.5" /> Project
                   </label>
                   <select
                     value={category}
                     onChange={e => setCategory(e.target.value)}
                     className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                   >
                     <option value="">Inbox</option>
                     {projects.map(pr => (
                        <option key={pr.id} value={pr.name}>{pr.name}</option>
                     ))}
                   </select>
                </div>
             </div>
           </div>
        </div>

        <div className="p-6 pt-4 border-t border-slate-100 bg-white flex justify-end">
           <button 
             onClick={handleCreate} 
             disabled={!title.trim()}
             className="w-full sm:w-auto px-8 py-3 bg-purple-600 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-600/20 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
           >
             Create Task
           </button>
        </div>
      </div>
    </div>
  );
}
