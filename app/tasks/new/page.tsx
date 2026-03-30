'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar } from 'lucide-react';
import { useTasks, TaskPriority } from '../../context/TaskContext';

export default function AddTaskPage() {
  const router = useRouter();
  const { addTask } = useTasks();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Low Priority');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({ title, description, deadline, priority, category: 'Task' });
    router.push('/tasks');
  };

  return (
    <DashboardLayout title="Create New Task">
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Task</h1>
          <p className="text-sm text-slate-500">Fill in the details below to create your next big achievement.</p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Task Title</label>
              <input
                type="text"
                required
                className="block w-full rounded-xl border border-slate-200 py-3.5 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-shadow outline-none"
                placeholder="e.g. Design System Update"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                className="block w-full h-32 rounded-xl border border-slate-200 py-3.5 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-shadow outline-none resize-none"
                placeholder="Briefly describe what needs to be done..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    required
                    className="block w-full rounded-xl border border-slate-200 py-3.5 pl-4 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-shadow outline-none"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                <select
                  className="block w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 pr-8 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-shadow outline-none appearance-none"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <option value="Low Priority">Low Priority</option>
                  <option value="Normal">Normal</option>
                  <option value="Medium Priority">Medium Priority</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex justify-end border-t border-slate-100 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="mr-3 rounded-xl px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
