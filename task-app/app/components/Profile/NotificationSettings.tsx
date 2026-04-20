'use client';

import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Bell, Mail, Smartphone, Clock, CheckCircle } from 'lucide-react';

export default function NotificationSettings({ isLoaded, settings, updateSettings }: any) {
  if (!isLoaded) return <div className="h-48 animate-pulse bg-slate-100 rounded-xl" />;

  const toggleSetting = (key: keyof typeof settings.notifications) => {
    updateSettings('notifications', { [key]: !settings.notifications[key] });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
          <Bell className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Notification Preferences</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Email Reminders */}
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Email Reminders</p>
              <p className="text-sm text-slate-500">Receive daily task summaries and updates.</p>
            </div>
          </div>
          <button 
            role="switch" 
            aria-checked={settings.notifications.emailReminders}
            onClick={() => toggleSetting('emailReminders')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${settings.notifications.emailReminders ? 'bg-orange-500' : 'bg-slate-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.notifications.emailReminders ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* SMS Reminders */}
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Smartphone className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">SMS Reminders</p>
              <p className="text-sm text-slate-500">Get text messages for urgent tasks.</p>
            </div>
          </div>
          <button 
            role="switch" 
            aria-checked={settings.notifications.smsReminders}
            onClick={() => toggleSetting('smsReminders')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${settings.notifications.smsReminders ? 'bg-orange-500' : 'bg-slate-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.notifications.smsReminders ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Conditional Phone Input */}
        {settings.notifications.smsReminders && (
          <div className="ml-8 mt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input 
              type="tel"
              value={settings.notifications.phoneNumber}
              onChange={(e) => updateSettings('notifications', { phoneNumber: e.target.value })}
              className="mt-1 block max-w-sm rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        )}

        {/* Deadline Alerts */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Deadline Alerts</p>
              <p className="text-sm text-slate-500">When should we alert you about an upcoming deadline?</p>
            </div>
          </div>
          <select
            value={settings.notifications.deadlineAlerts}
            onChange={(e) => updateSettings('notifications', { deadlineAlerts: e.target.value })}
            className="mt-1 block max-w-[150px] rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border bg-white"
          >
            <option value="24h">24 hours before</option>
            <option value="6h">6 hours before</option>
            <option value="1h">1 hour before</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* Task Completion */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Task Completion</p>
              <p className="text-sm text-slate-500">Notify when assigned tasks are completed.</p>
            </div>
          </div>
          <button 
            role="switch" 
            aria-checked={settings.notifications.taskCompletion}
            onClick={() => toggleSetting('taskCompletion')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${settings.notifications.taskCompletion ? 'bg-orange-500' : 'bg-slate-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.notifications.taskCompletion ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
