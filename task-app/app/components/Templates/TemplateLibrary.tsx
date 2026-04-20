'use client';

import React, { useState } from 'react';
import { useTemplates } from '../../hooks/useTemplates';
import { useTasks, Task } from '../../context/TaskContext';
import { applyTemplateToTaskData } from '../../lib/templateUtils';
import { Clock, Play, Tag, Trash2, Edit, Plus } from 'lucide-react';
import SaveAsTemplateModal from './SaveAsTemplateModal';

export default function TemplateLibrary() {
  const { templates, deleteTemplate, isLoaded } = useTemplates();
  const { addTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isLoaded) return <div className="p-8 text-slate-500">Loading templates...</div>;

  const handleUseTemplate = (tplId: string) => {
    const tpl = templates.find(t => t.id === tplId);
    if (!tpl) return;
    const newTaskParams = applyTemplateToTaskData(tpl);
    addTask(newTaskParams);
    alert(`Created 1 task from template: ${tpl.name}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map(tpl => (
        <div key={tpl.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all flex flex-col h-full group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{tpl.name}</h3>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
              tpl.priority === 'Urgent' ? 'bg-red-50 text-red-600' :
              tpl.priority === 'High Priority' ? 'bg-orange-50 text-orange-600' :
              tpl.priority === 'Medium Priority' ? 'bg-blue-50 text-blue-600' :
              'bg-slate-100 text-slate-600'
            }`}>
              {tpl.priority}
            </span>
          </div>
          
          <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
            {tpl.description || 'No description provided.'}
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-xs font-semibold text-slate-500">
              <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
              {tpl.dueOffset === 0 ? 'Due same day' : tpl.dueOffset ? `Due ${tpl.dueOffset} days later` : 'No default due date'}
            </div>
            {tpl.projectId && (
              <div className="flex items-center text-xs font-semibold text-slate-500">
                <Tag className="w-3.5 h-3.5 mr-2 text-slate-400" />
                Project: <span className="text-purple-600 ml-1">{tpl.projectId}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
             <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => alert('Edit Template functionality')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                   <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => deleteTemplate(tpl.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                   <Trash2 className="w-4 h-4" />
                </button>
             </div>
             
             <button 
               onClick={() => handleUseTemplate(tpl.id)}
               className="flex items-center px-4 py-2 bg-slate-50 hover:bg-purple-600 hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-all"
             >
               <Play className="w-3.5 h-3.5 mr-1.5" /> Use Template
             </button>
          </div>
        </div>
      ))}
      
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-300 hover:border-purple-400 hover:bg-purple-50 transition-all flex flex-col items-center justify-center h-full min-h-[260px] cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-full bg-slate-200 group-hover:bg-purple-100 flex items-center justify-center mb-4 transition-colors">
           <Plus className="w-6 h-6 text-slate-400 group-hover:text-purple-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-700 group-hover:text-purple-700">Create New Template</h3>
        <p className="text-xs font-medium text-slate-500 mt-2 text-center max-w-[200px]">Save your recurring workflows to save time later.</p>
      </div>

      <SaveAsTemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
