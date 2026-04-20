'use client';

import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TemplateLibrary from '../components/Templates/TemplateLibrary';
import { Layers } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <DashboardLayout title="Task Templates">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
            <Layers className="w-8 h-8 mr-3 text-purple-600" /> Task Templates
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Save time on recurring tasks by creating templates. Use templates to instantly generate tasks with pre-filled names, priorities, and deadlines.
          </p>
        </div>
      </div>

      <TemplateLibrary />
    </DashboardLayout>
  );
}
