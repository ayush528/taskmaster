'use client';

import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useProjects } from '../../../hooks/useProjects';
import Link from 'next/link';
import { ChevronLeft, FolderKanban } from 'lucide-react';

interface ProjectTasksPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectTasksPage({ params }: ProjectTasksPageProps) {
  // We use `use(params)` to unwrap params in Next.js 15+ if it's a Promise
  // But wait, it's safer to just handle it dynamically or assume standard App Router page props
  
  // Here we'll just extract the id as Nextjs 14 and earlier or 15
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  
  const { projects } = useProjects();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <DashboardLayout title="Project Tasks">
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
          <Link href="/projects" className="text-purple-600 hover:text-purple-700 font-semibold underline">
            Back to Projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="">
      {/* Top Header Section overriding the empty title */}
      <div className="mb-8">
        <Link href="/projects" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <FolderKanban className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            </div>
            <p className="text-slate-500 font-medium max-w-2xl">{project.description}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Task Board Coming Soon</h3>
        <p className="text-slate-500 max-w-sm mb-6">
          This project currently has {project.tasksCount} tasks. Connect backend API to manage them here.
        </p>
      </div>
    </DashboardLayout>
  );
}
