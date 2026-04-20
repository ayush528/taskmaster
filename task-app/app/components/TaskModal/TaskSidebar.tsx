'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../../context/TaskContext';
import { Calendar, AlertCircle, Tag, User, FolderClosed, CheckCircle, RefreshCw } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import RemindersList from '../Reminders/RemindersList';
import RecurrenceModal from '../RecurringTasks/RecurrenceModal';

interface TaskSidebarProps {
  task: Task;
  onChange: (updates: Partial<Task>) => void;
  onRemind: () => void;
}

export default function TaskSidebar({ task, onChange, onRemind }: TaskSidebarProps) {
  const { projects } = useProjects();
  const { members } = useTeamMembers();
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [isRecurrenceModalOpen, setIsRecurrenceModalOpen] = useState(false);

  const handleStatusChange = (status: TaskStatus) => {
    onChange({ status });
    if (status === 'completed') {
      setShowCheckmark(true);
      setTimeout(() => setShowCheckmark(false), 2000);
    }
  };

  const handleTagToggle = (tag: string) => {
    const defaultTags = task.tags || [];
    const newTags = defaultTags.includes(tag) 
      ? defaultTags.filter(t => t !== tag) 
      : [...defaultTags, tag];
    onChange({ tags: newTags });
  };

  const availableTags = ['marketing', 'design', 'urgent', 'bug', 'feature'];

  return (
    <div className="space-y-6">
      {/* Due Date */}
      <div>
        <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <Calendar className="w-4 h-4 mr-1.5" /> Due Date
        </label>
        <input
          type="date"
          value={task.deadline}
          onChange={(e) => onChange({ deadline: e.target.value })}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
        <div className="flex space-x-2 mt-2">
           {/* Quick buttons */}
           <button onClick={() => {
             const d = new Date();
             onChange({ deadline: d.toISOString().split('T')[0] });
           }} className="text-[10px] font-bold uppercase border border-slate-200 rounded px-2 py-1 text-slate-500 hover:bg-slate-100">Today</button>
           <button onClick={() => {
             const d = new Date(); d.setDate(d.getDate() + 1);
             onChange({ deadline: d.toISOString().split('T')[0] });
           }} className="text-[10px] font-bold uppercase border border-slate-200 rounded px-2 py-1 text-slate-500 hover:bg-slate-100">Tomorrow</button>
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <AlertCircle className="w-4 h-4 mr-1.5" /> Priority
        </label>
        <select
          value={task.priority}
          onChange={(e) => onChange({ priority: e.target.value as TaskPriority })}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          <option value="Urgent">URGENT</option>
          <option value="High Priority">HIGH</option>
          <option value="Medium Priority">NORMAL</option>
          <option value="Low Priority">LOW</option>
        </select>
      </div>

      {/* Status */}
      <div className="relative">
        <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Status
        </label>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          className={`w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors ${task.status === 'completed' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : ''}`}
        >
          <option value="pending">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        {/* Animated Checkmark */}
        {showCheckmark && (
           <div className="absolute right-8 top-8 text-emerald-500 animate-bounce">
             <CheckCircle className="w-5 h-5" />
           </div>
        )}
      </div>
      
      {/* Project */}
      <div>
        <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <FolderClosed className="w-4 h-4 mr-1.5" /> Project
        </label>
        <select
          value={task.category || ''}
          onChange={(e) => onChange({ category: e.target.value })}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          <option value="">No Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Assigned To */}
      <div>
        <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <User className="w-4 h-4 mr-1.5" /> Assigned to
        </label>
        <select
          value={task.assignee || ''}
          onChange={(e) => onChange({ assignee: e.target.value })}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          <option value="">Unassigned</option>
          {members.map(m => (
            <option key={m.id} value={m.name}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <Tag className="w-4 h-4 mr-1.5" /> Tags/Labels
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => {
            const isSelected = (task.tags || []).includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                  isSelected 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recurrence Settings */}
      <div>
         <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <RefreshCw className="w-4 h-4 mr-1.5" /> Recurrence
            </label>
            <button 
              onClick={() => setIsRecurrenceModalOpen(true)}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-1 rounded-md transition-colors"
            >
              {task.recurringRule ? 'Edit' : 'Enable'}
            </button>
         </div>
         {task.recurringRule ? (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
               <span className="flex items-center text-xs font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                  Repeats {task.recurringRule.frequency}
                  {task.recurringRule.interval && task.recurringRule.interval > 1 ? ` (every ${task.recurringRule.interval})` : ''}
               </span>
               <button 
                  onClick={() => onChange({ recurringRule: undefined })}
                  className="mt-2 text-[10px] font-bold text-red-600 hover:underline"
               >
                 Remove rule
               </button>
            </div>
         ) : (
            <p className="text-xs text-slate-400">Task does not repeat.</p>
         )}
         
         <RecurrenceModal 
           isOpen={isRecurrenceModalOpen} 
           onClose={() => setIsRecurrenceModalOpen(false)}
           onSave={(rule) => onChange({ recurringRule: rule || undefined })}
           initialRule={task.recurringRule}
           startDateStr={task.deadline}
         />
      </div>

      {/* Reminders List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reminders</h3>
          <button onClick={onRemind} type="button" className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-1 rounded-md">Add</button>
        </div>
        <RemindersList taskId={task.id} />
      </div>
    </div>
  );
}
