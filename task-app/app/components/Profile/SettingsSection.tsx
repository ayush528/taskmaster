'use client';

import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Save, AlertTriangle } from 'lucide-react';

export default function SettingsSection() {
  const { settings, updateSettings, isLoaded } = useSettings();

  if (!isLoaded) return <div className="p-8 text-slate-500">Loading settings...</div>;

  const handleSave = () => {
    // Show toast message (simulated with alert or custom toast)
    alert("Settings saved successfully!");
  };

  const currentTheme = settings.appearance?.theme || 'system';
  const currentDensity = settings.appearance?.viewDensity || 'comfortable';

  return (
    <div className="space-y-12 pb-24">
      {/* 1. NOTIFICATIONS */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">1. Notifications</h3>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                checked={settings.notifications?.emailReminders ?? true}
                onChange={(e) => updateSettings('notifications', { emailReminders: e.target.checked })}
              />
              <span className="font-semibold text-slate-700">Email reminders before deadline</span>
            </label>
            
            {(settings.notifications?.emailReminders ?? true) && (
              <div className="mt-3 ml-8 space-y-2 border-l-2 border-slate-100 pl-4">
                {['1 day before', '6 hours before', '1 hour before'].map((timing) => (
                  <label key={timing} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" defaultChecked />
                    <span>{timing}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                checked={settings.notifications?.smsReminders ?? false}
                onChange={(e) => updateSettings('notifications', { smsReminders: e.target.checked })}
              />
              <span className="font-semibold text-slate-700">SMS reminders</span>
            </label>
            {(settings.notifications?.smsReminders) && (
              <div className="mt-3 ml-8">
                <input 
                  type="text" 
                  placeholder="Enter phone number..." 
                  className="w-full max-w-xs text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none"
                />
              </div>
            )}
          </div>

          <label className="flex items-center space-x-3 cursor-pointer">
             <input 
               type="checkbox" 
               className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
               checked={settings.notifications?.taskCompletion ?? true}
               onChange={(e) => updateSettings('notifications', { taskCompletion: e.target.checked })}
             />
             <span className="font-semibold text-slate-700">Show in-app notifications</span>
          </label>
        </div>
      </section>

      {/* 2. APPEARANCE */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">2. Appearance</h3>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Theme Logic</p>
            <div className="flex items-center space-x-6">
              {['light', 'dark', 'system'].map((t) => (
                <label key={t} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="theme"
                    value={t}
                    checked={currentTheme === t}
                    onChange={(e) => updateSettings('appearance', { theme: e.target.value as any })}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-slate-600 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-lg">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Color theme</p>
              <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none">
                <option value="purple">Default (Purple)</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
              </select>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">View Density</p>
              <select 
                value={currentDensity}
                onChange={(e) => updateSettings('appearance', { viewDensity: e.target.value as any })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRIVACY */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">3. Privacy</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
             <input type="checkbox" className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500" defaultChecked />
             <span className="font-semibold text-slate-700">Profile visible to team members</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
             <input type="checkbox" className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500" defaultChecked />
             <span className="font-semibold text-slate-700">Show my progress to others</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
             <input type="checkbox" className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500" defaultChecked />
             <span className="font-semibold text-slate-700">Allow others to share tasks with me</span>
          </label>
        </div>
      </section>

      {/* 4. TASK DEFAULTS */}
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">4. Task Defaults</h3>
        <div className="grid grid-cols-2 gap-6 max-w-lg">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Default Priority</p>
            <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none">
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Default Project</p>
            <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none">
              <option value="">None</option>
              <option value="web-design">Web Design</option>
              <option value="api">Backend API</option>
            </select>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-semibold text-slate-700 mb-2">Default Category Tags</p>
            <input 
              type="text" 
              placeholder="e.g. Frontend, Review..." 
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:outline-none" 
            />
          </div>
        </div>
      </section>

      {/* 5. DANGER ZONE */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-red-200">
        <h3 className="text-lg font-bold text-red-600 flex items-center mb-6">
          <AlertTriangle className="w-5 h-5 mr-2" /> Danger Zone
        </h3>
        
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 border flex-1 md:flex-none border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
            Export my data (JSON)
          </button>
          <button className="px-4 py-2 bg-red-50 flex-1 md:flex-none text-red-700 border border-red-200 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors">
            Delete my account
          </button>
        </div>
      </section>

      <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 flex justify-end px-8 z-40">
        <button onClick={handleSave} className="flex items-center px-6 py-2.5 bg-purple-600 text-white font-bold text-sm rounded-xl shadow-sm hover:bg-purple-700 transition-colors">
          <Save className="w-4 h-4 mr-2" /> Save Settings
        </button>
      </div>
    </div>
  );
}
