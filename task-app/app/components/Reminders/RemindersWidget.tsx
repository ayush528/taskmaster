'use client';

import React, { useState, useEffect } from 'react';
import { useReminders } from '../../hooks/useReminders';
import { formatReminderTime, isReminderActive } from '../../lib/reminderUtils';
import { Bell, Check, Clock, BellOff } from 'lucide-react';

export default function RemindersWidget() {
  const { reminders, markAsDone, snoozeReminder, isLoaded } = useReminders();
  const [now, setNow] = useState(Date.now());

  // Simulate tick for triggering reminders
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  if (!isLoaded) return null;

  // Active or Upcoming reminders (top 5)
  const activeAndUpcoming = reminders
    .filter(r => !r.isDone)
    .sort((a, b) => new Date(a.triggerTime).getTime() - new Date(b.triggerTime).getTime())
    .slice(0, 5);

  if (activeAndUpcoming.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-400">
           <BellOff className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No Upcoming Reminders</h3>
        <p className="text-xs text-slate-500 mt-1">You are all caught up!</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center">
          <Bell className="w-4 h-4 mr-2 text-blue-500 fill-blue-500/20" />
          Upcoming Reminders
        </h3>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{activeAndUpcoming.length}</span>
      </div>

      <div className="divide-y divide-slate-100">
        {activeAndUpcoming.map(r => {
          const isActive = isReminderActive(r.triggerTime, r.snoozedUntil);
          const bgClass = isActive ? 'bg-blue-50/50 hover:bg-blue-50' : 'bg-white hover:bg-slate-50';
          
          return (
            <div key={r.id} className={`p-4 transition-colors ${bgClass}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className={`text-sm font-bold ${isActive ? 'text-blue-900' : 'text-slate-800'} line-clamp-1 flex-1 pr-2`}>
                  {r.taskTitle}
                </h4>
                <span className={`text-[10px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded-md border ${isActive ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                  {isActive ? 'TRIGGERED' : formatReminderTime(r.triggerTime)}
                </span>
              </div>
              
              <div className="flex items-center text-xs text-slate-500 mb-3 font-medium">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {r.timeOffsetLabel} 
                 {r.snoozedUntil && <span className="ml-1 text-purple-600">(Snoozed)</span>}
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => markAsDone(r.id)}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> <span>Mark Done</span>
                </button>
                <button 
                  onClick={() => snoozeReminder(r.id, 15)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Snooze 15m
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
