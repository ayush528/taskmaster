'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Project } from '../../hooks/useProjects';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: { name: string; description: string; color: string }) => void;
  projectToEdit?: Project | null;
}

const COLORS = [
  { id: 'purple', class: 'bg-purple-500 ring-purple-500' },
  { id: 'blue', class: 'bg-blue-500 ring-blue-500' },
  { id: 'green', class: 'bg-emerald-500 ring-emerald-500' },
  { id: 'orange', class: 'bg-orange-500 ring-orange-500' },
  { id: 'rose', class: 'bg-rose-500 ring-rose-500' },
  { id: 'slate', class: 'bg-slate-500 ring-slate-500' },
];

export default function CreateProjectModal({ isOpen, onClose, onSave, projectToEdit }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('purple');
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
      setColor(projectToEdit.color);
    } else {
      setName('');
      setDescription('');
      setColor('purple');
    }
    setError('');
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    
    onSave({ name: name.trim(), description: description.trim(), color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {projectToEdit ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-md transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Website Redesign"
              className={`w-full text-sm border ${error ? 'border-red-500 ring-red-500' : 'border-slate-200 focus:border-purple-600 focus:ring-purple-600'} rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-1 transition-colors`}
            />
            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the project goals..."
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors resize-none min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Project Color</label>
            <div className="flex items-center space-x-3">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-8 h-8 rounded-full ${c.class} ${color === c.id ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-110'} transition-all`}
                  aria-label={`Select ${c.id} color`}
                >
                  {color === c.id && (
                    <div className="h-2 w-2 bg-white rounded-full mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 shadow-sm transition-colors focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            >
              {projectToEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
