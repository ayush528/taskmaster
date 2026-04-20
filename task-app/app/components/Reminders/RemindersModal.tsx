'use client';

import React, { useState } from 'react';
import { ReminderType, ReminderFrequency, useReminders } from '../../hooks/useReminders';
import { calculateTriggerTime } from '../../lib/reminderUtils';
import { X, Bell, Mail, Smartphone, RefreshCw, Calendar as CalIcon } from 'lucide-react';

interface RemindersModalProps {
  taskId: string;
  taskTitle: string;
  taskDeadline: string; // ISO or readable YYYY-MM-DD
  isOpen: boolean;
  onClose: () => void;
}

export default function RemindersModal({ taskId, taskTitle, taskDeadline, isOpen, onClose }: RemindersModalProps) {
  const { addReminder } = useReminders();
  const [type, setType] = useState<ReminderType>('in-app');
  const [timing, setTiming] = useState('30 minutes before');
  const [customDate, setCustomDate] = useState('');
  const [frequency, setFrequency] = useState<ReminderFrequency>('one-time');

  if (!isOpen) return null;

  const handleSave = () => {
    const triggerTime = calculateTriggerTime(taskDeadline, timing, customDate);

    addReminder({
      taskId,
      taskTitle,
      type,
      timeOffsetLabel: timing === 'Custom' ? 'Custom' : timing,
      triggerTime,
      frequency,
      snoozedUntil: null,
    });
    
    onClose(); // Automatically close on save for simplicity, or we could redirect to list
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" /> Add Reminder
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
            Task: <span className="font-semibold text-slate-700">{taskTitle}</span>
          </p>

          {/* Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Reminder Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'in-app', icon: Bell, label: 'In-app' },
                { id: 'email', icon: Mail, label: 'Email' },
                { id: 'sms', icon: Smartphone, label: 'SMS' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id as ReminderType)}
                  className={`flex flex-col items-center p-3 border-2 rounded-xl transition-colors ${type === t.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
                >
                  <t.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-semibold">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">When</label>
            <select
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            >
              <option value="0 minutes before">On deadline (0 min before)</option>
              <option value="30 minutes before">30 minutes before</option>
              <option value="1 hour before">1 hour before</option>
              <option value="6 hours before">6 hours before</option>
              <option value="1 day before">1 day before</option>
              <option value="2 days before">2 days before</option>
              <option value="1 week before">1 week before</option>
              <option value="Custom">Custom date & time</option>
            </select>
          </div>

          {timing === 'Custom' && (
            <div className="relative">
              <CalIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                 type="datetime-local"
                 value={customDate}
                 onChange={(e) => setCustomDate(e.target.value)}
                 className="w-full text-sm pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          )}

          {/* Frequency */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Repeat Frequency</label>
            <div className="flex space-x-3 bg-slate-50 p-1.5 rounded-xl">
              {[
                { id: 'one-time', label: 'One Time' },
                { id: 'daily', label: 'Daily' },
                { id: 'weekly', label: 'Weekly' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFrequency(f.id as ReminderFrequency)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${frequency === f.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                >
                  {f.id !== 'one-time' && <RefreshCw className="inline h-3 w-3 mr-1 mb-0.5" />}
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg mr-2 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            Create Reminder
          </button>
        </div>
      </div>
    </div>
  );
}
