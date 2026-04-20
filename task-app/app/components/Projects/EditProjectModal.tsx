'use client';

import React, { useState, useEffect } from 'react';
import { X, Edit2, Users } from 'lucide-react';
import { Project } from '../../hooks/useProjects';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdate: (id: string, updatedFields: Partial<Project>) => void;
}

export default function EditProjectModal({ isOpen, onClose, project, onUpdate }: EditProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [membersStr, setMembersStr] = useState('');

  useEffect(() => {
    if (project && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(project.name);
      setDescription(project.description);
      setMembersStr(project.members.join(', '));
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const members = membersStr.split(',').map(m => m.trim()).filter(Boolean);
    onUpdate(project.id as string, { name, description, members });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-[600px] overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white shadow-sm">
              <Edit2 className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-slate-900">TaskMaster Projects</span>
          </div>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Edit Project</h2>
          <p className="text-sm text-slate-500 mb-8">Update the details for <strong>{project.name}</strong>.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name</label>
              <input
                type="text"
                required
                className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-shadow outline-none"
                placeholder="e.g. Website Redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea
                className="block w-full h-28 rounded-xl border border-slate-200 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-shadow outline-none resize-none"
                placeholder="Briefly describe the project goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Team Members (Comma separated)</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-xl border border-slate-200 py-3 pl-4 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-shadow outline-none"
                  placeholder="e.g. Alex, Sarah, Mike"
                  value={membersStr}
                  onChange={(e) => setMembersStr(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
