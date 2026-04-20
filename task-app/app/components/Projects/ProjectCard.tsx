'use client';

import React from 'react';
import { MoreVertical, Edit2, Trash2, Folder, CheckSquare } from 'lucide-react';
import { Project } from '../../hooks/useProjects';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string | number) => void;
  onClick: (project: Project) => void;
}

const colorMap: Record<string, string> = {
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
};

const iconColorMap: Record<string, string> = {
  purple: 'text-purple-600',
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  orange: 'text-orange-600',
  rose: 'text-rose-600',
  slate: 'text-slate-600',
};

export default function ProjectCard({ project, onEdit, onDelete, onClick }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Close menu when clicking outside could be added here, simplified for demo

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(project.id);
  };

  return (
    <div 
      onClick={() => onClick(project)}
      className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer flex flex-col h-full relative group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[project.color] || colorMap.purple}`}>
             <Folder className={`w-5 h-5 ${iconColorMap[project.color] || iconColorMap.purple}`} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              {project.name}
            </h3>
            <span className="text-xs font-medium text-slate-400">Updated {project.lastUpdated}</span>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-10">
              <button 
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-2 text-slate-400" /> Edit
              </button>
              <button 
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 mb-6">
        <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
          {project.description || "No description provided."}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e'][i % 5] }}
                title={member}
              >
                {member.substring(0, 2).toUpperCase()}
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        </div>
        
        <div className={`flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${colorMap[project.color] || colorMap.purple}`}>
          <CheckSquare className="w-3.5 h-3.5 mr-1" />
          {project.tasksCount} Tasks
        </div>
      </div>
    </div>
  );
}
