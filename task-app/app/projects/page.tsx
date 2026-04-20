'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Plus } from 'lucide-react';
import { useProjects, Project } from '../hooks/useProjects';
import ProjectCard from '../components/Projects/ProjectCard';
import CreateProjectModal from '../components/Projects/CreateProjectModal';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const router = useRouter();

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSave = (projectData: { name: string; description: string; color: string }) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this project? All associated tasks will be orphaned.")) {
      deleteProject(id);
    }
  };

  const handleProjectClick = (project: Project) => {
    // Navigate to tasks list filtered by project
    router.push(`/tasks?project=${encodeURIComponent(project.name)}`);
  };

  return (
    <DashboardLayout title="Projects">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Projects</h1>
          <p className="text-slate-500 font-medium">
            Manage your teams and current focus areas.
          </p>
        </div>
        
        <button 
          onClick={handleCreate}
          className="mt-4 md:mt-0 flex items-center rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded-3xl p-12 text-center bg-slate-50/50">
          <div className="mx-auto h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">Get started by creating your first project to organize your tasks better.</p>
          <button 
            onClick={handleCreate}
            className="inline-flex items-center rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      )}

      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        projectToEdit={editingProject}
      />
    </DashboardLayout>
  );
}
