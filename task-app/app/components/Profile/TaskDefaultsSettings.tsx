'use client';

import React from 'react';
import { CheckSquare, ListTodo, Repeat } from 'lucide-react';

export default function TaskDefaultsSettings({ isLoaded, settings, updateSettings }: any) {
  if (!isLoaded) return null;

  const toggleSetting = (key: keyof typeof settings.taskDefaults) => {
    updateSettings('taskDefaults', { [key]: !settings.taskDefaults[key] });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
          <CheckSquare className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Task Defaults</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Default Priority */}
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <ListTodo className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Default Priority</p>
              <p className="text-sm text-slate-500">Initial priority for newly created tasks.</p>
            </div>
          </div>
          <select
            value={settings.taskDefaults.priority}
            onChange={(e) => updateSettings('taskDefaults', { priority: e.target.value })}
            className="mt-1 block w-[120px] rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Auto-complete Recurring */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-start space-x-3">
            <Repeat className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Auto-complete Recurring</p>
              <p className="text-sm text-slate-500">Automatically mark previous instances as done when a new one generates.</p>
            </div>
          </div>
          <button 
            role="switch" 
            aria-checked={settings.taskDefaults.autoCompleteRecurring}
            onClick={() => toggleSetting('autoCompleteRecurring')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${settings.taskDefaults.autoCompleteRecurring ? 'bg-orange-500' : 'bg-slate-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.taskDefaults.autoCompleteRecurring ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
