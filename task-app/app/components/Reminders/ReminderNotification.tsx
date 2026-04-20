'use client';

import React, { useEffect, useState } from 'react';
import { useReminders, Reminder } from '../../hooks/useReminders';
import { Bell, X, Calendar } from 'lucide-react';
import TaskDetailsModal from '../TaskModal/TaskDetailsModal';

export default function ReminderNotification() {
  const { reminders, markAsDone, isLoaded } = useReminders();
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      const now = new Date();
      
      const triggered = reminders.filter(r => {
        if (r.isDone) return false;
        
        // If snoozed, check snooze time instead of trigger time
        const checkTime = r.snoozedUntil ? new Date(r.snoozedUntil) : new Date(r.triggerTime);
        
        // Trigger if current time is past the checkTime
        return now >= checkTime;
      });

      // Filter out those already active so we don't spam state updates
      const newActive = triggered.filter(t => !activeReminders.some(ar => ar.id === t.id));
      
      if (newActive.length > 0) {
        setActiveReminders(prev => [...prev, ...newActive]);
      }
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, [reminders, isLoaded, activeReminders]);

  const handleDismiss = (id: string) => {
    setActiveReminders(prev => prev.filter(r => r.id !== id));
    markAsDone(id);
  };

  const handleViewTask = (taskId: string, reminderId: string) => {
    setSelectedTaskId(taskId);
    handleDismiss(reminderId);
  };

  if (activeReminders.length === 0 && !selectedTaskId) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full">
        {activeReminders.map(reminder => (
          <div key={reminder.id} className="bg-white border-l-4 border-purple-500 rounded-lg shadow-2xl p-4 animate-in slide-in-from-right-8 relative">
            <button 
              onClick={() => handleDismiss(reminder.id)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div className="pr-6">
                <h4 className="text-sm font-bold text-slate-800">Reminder</h4>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  Task: <span className="font-semibold">{reminder.taskTitle}</span> - Due {reminder.timeOffsetLabel.toLowerCase()}
                </p>
                <button 
                  onClick={() => handleViewTask(reminder.taskId, reminder.id)}
                  className="mt-3 flex items-center text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-md transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5" /> View Task
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTaskId && (
        <TaskDetailsModal 
          taskId={selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
      )}
    </>
  );
}
