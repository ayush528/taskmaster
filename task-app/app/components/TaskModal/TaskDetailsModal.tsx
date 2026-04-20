'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Trash2, Bell, Save } from 'lucide-react';
import { useTasks, Task } from '../../context/TaskContext';
import TaskForm from './TaskForm';
import SubtasksPanel from './SubtasksPanel';
import ActivityTimeline from './ActivityTimeline';
import TaskSidebar from './TaskSidebar';
import RemindersModal from '../Reminders/RemindersModal';
import RecurrenceOptions from '../RecurringTasks/RecurrenceOptions';

interface TaskDetailsModalProps {
  taskId: string | null;
  onClose: () => void;
}

export default function TaskDetailsModal({ taskId, onClose }: TaskDetailsModalProps) {
  const { tasks, updateTask, deleteTask, addTask } = useTasks();
  const [localTask, setLocalTask] = useState<Task | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isRecurrenceOptionsOpen, setIsRecurrenceOptionsOpen] = useState<'edit' | 'delete' | null>(null);

  useEffect(() => {
    if (taskId) {
      const found = tasks.find(t => t.id === taskId);
      if (found) {
        setLocalTask({ ...found }); // Create local copy for editing
      } else {
        onClose();
      }
    } else {
      setLocalTask(null);
    }
  }, [taskId, tasks, onClose]);

  if (!localTask || !taskId) return null;


  const handleUpdate = (updates: Partial<Task>) => {
    setLocalTask(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleSave = () => {
    if (localTask) {
      if (localTask.recurringRule || localTask.parentId) {
         // Show options for edit
         setIsRecurrenceOptionsOpen('edit');
      } else {
         updateTask(localTask.id, localTask);
         onClose();
      }
    }
  };

  const handleDelete = () => {
    if (localTask?.recurringRule || localTask?.parentId) {
       setIsRecurrenceOptionsOpen('delete');
    } else {
      if (window.confirm("Are you sure you want to delete this task?")) {
        deleteTask(localTask!.id);
        onClose();
      }
    }
  };

  const handleDuplicate = () => {
    const { id, status, ...rest } = localTask;
    addTask({ ...rest, title: `${rest.title} (Copy)` });
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 pt-10 sm:p-6 transition-all"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="w-full max-w-5xl h-[90vh] flex flex-col rounded-[2rem] bg-white shadow-2xl overflow-hidden shadow-purple-900/10">
          
          {/* Default Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 bg-white shrink-0 z-10 sticky top-0 shadow-sm">
            <h2 className="text-sm font-bold text-slate-400 tracking-widest uppercase">Task Details</h2>
            <button onClick={onClose} className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-200 rounded-full transition-colors flex items-center justify-center">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Grid Layout taking full remaining height */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr,320px]">
            {/* Left Side: Forms & Content */}
            <div className="p-8 lg:p-10 border-r border-slate-100 overflow-y-auto w-full pb-20 scrollbar-hide">
              <TaskForm task={localTask} onChange={handleUpdate} />
              
              <div className="mt-8">
                <SubtasksPanel task={localTask} onChange={handleUpdate} />
              </div>
              
              <div className="mt-12 pt-8 border-t border-slate-100">
                <ActivityTimeline task={localTask} onChange={handleUpdate} />
              </div>

              {/* Comments mock section (minimal requirements) */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Comments</h3>
                <textarea className="w-full text-sm font-medium bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-colors" placeholder="Add a comment..."></textarea>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-purple-100 hover:text-purple-700 transition">Post Comment</button>
              </div>
            </div>

            {/* Right Side: Sidebar Metadata */}
            <div className="p-6 lg:p-8 bg-slate-50/50 flex flex-col overflow-y-auto">
               <TaskSidebar task={localTask} onChange={handleUpdate} onRemind={() => setIsReminderOpen(true)} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 px-8 py-5 flex justify-between bg-white shrink-0">
             <div className="flex space-x-3">
               <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 text-sm font-bold hover:bg-red-100 transition-colors">
                 Delete Task
               </button>
             </div>
             <div className="flex space-x-3">
               <button onClick={handleDuplicate} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                 Duplicate
               </button>
               <button onClick={() => setIsReminderOpen(true)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                 Add Reminder
               </button>
               <button onClick={handleSave} className="px-8 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all flex items-center">
                 <Save className="w-4 h-4 mr-2" /> Save Changes
               </button>
             </div>
          </div>
        </div>
      </div>
      
      <RemindersModal 
        isOpen={isReminderOpen} 
        onClose={() => setIsReminderOpen(false)}
        taskId={localTask.id}
        taskTitle={localTask.title}
        taskDeadline={localTask.deadline}
      />
      
      {isRecurrenceOptionsOpen && (
         <RecurrenceOptions
           task={localTask}
           isOpen={isRecurrenceOptionsOpen !== null}
           mode={isRecurrenceOptionsOpen}
           onClose={() => setIsRecurrenceOptionsOpen(null)}
           onConfirmEdit={(scope: 'single' | 'future' | 'all') => {
              if (scope === 'single') {
                 updateTask(localTask.id, localTask);
              } else {
                 // Mocking apply future / all logic inside context in real app, simply updating parent here
                 alert(`Applying changes to ${scope} recurring instances`);
                 updateTask(localTask.id, localTask);
              }
              onClose();
           }}
           onConfirmDelete={(scope: 'single' | 'future' | 'all') => {
              if (scope === 'single') {
                 deleteTask(localTask.id);
              } else {
                 alert(`Deleting ${scope} recurring instances`);
                 deleteTask(localTask.id);
              }
              onClose();
           }}
         />
      )}
    </>
  );
}
