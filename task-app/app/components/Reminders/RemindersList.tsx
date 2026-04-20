'use client';

import React, { useState } from 'react';
import { useReminders } from '../../hooks/useReminders';
import { formatReminderTime } from '../../lib/reminderUtils';
import { Trash2, Edit3, Bell, Clock } from 'lucide-react';

interface RemindersListProps {
  taskId: string;
}

export default function RemindersList({ taskId }: RemindersListProps) {
  const { reminders, deleteReminder, snoozeReminder, isLoaded } = useReminders();
  const [snoozeOpenId, setSnoozeOpenId] = useState<string | null>(null);

  if (!isLoaded) return null;

  const taskReminders = reminders.filter(r => r.taskId === taskId && !r.isDone);

  if (taskReminders.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        No active reminders for this task.
      </div>
    );
  }

  const handleSnooze = (id: string, mins: number) => {
    snoozeReminder(id, mins);
    setSnoozeOpenId(null);
  };

  return (
    <div className="space-y-3">
      {taskReminders.map(r => (
        <div key={r.id} className="relative group bg-white border border-slate-200 rounded-xl p-3 flex items-start justify-between shadow-sm hover:border-blue-300 transition-colors">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
               <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {r.timeOffsetLabel}
              </p>
              <div className="flex items-center text-xs text-slate-500 mt-0.5 font-medium space-x-2">
                 <span>via <span className="uppercase text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-600">{r.type}</span></span>
                 <span>•</span>
                 <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {formatReminderTime(r.triggerTime)}</span>
              </div>
              {r.frequency !== 'one-time' && (
                <span className="inline-block mt-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Repeats {r.frequency}
                </span>
              )}
              {r.snoozedUntil && (
                <span className="inline-block mt-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider ml-2 shadow-sm border border-purple-100">
                  Snoozed to {formatReminderTime(r.snoozedUntil)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
            <div className="relative">
              <button 
                onClick={() => setSnoozeOpenId(snoozeOpenId === r.id ? null : r.id)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" 
                title="Snooze"
              >
                <Clock className="w-4 h-4" />
              </button>
              
              {snoozeOpenId === r.id && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl ring-1 ring-slate-900/5 z-10 py-1">
                  <button onClick={() => handleSnooze(r.id, 5)} className="block w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">5 minutes</button>
                  <button onClick={() => handleSnooze(r.id, 15)} className="block w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">15 minutes</button>
                  <button onClick={() => handleSnooze(r.id, 30)} className="block w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">30 minutes</button>
                </div>
              )}
            </div>

            <button 
              onClick={() => deleteReminder(r.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Delete Reminder"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
