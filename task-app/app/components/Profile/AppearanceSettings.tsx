'use client';

import React from 'react';
import { Palette, Moon, Sun, Layout, Monitor } from 'lucide-react';

export default function AppearanceSettings({ isLoaded, settings, updateSettings }: any) {
  if (!isLoaded) return null;

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' }
  ];

  const colors = [
    { id: 'orange', class: 'bg-orange-500' },
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'green', class: 'bg-emerald-500' },
    { id: 'purple', class: 'bg-purple-500' },
    { id: 'rose', class: 'bg-rose-500' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
          <Palette className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Appearance Settings</h3>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Theme Mode */}
        <div>
          <h4 className="text-sm font-medium text-slate-900 mb-4">Theme Preference</h4>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => updateSettings('appearance', { theme: t.id })}
                className={`flex flex-col items-center justify-center py-4 px-3 rounded-xl border-2 transition-all ${settings.appearance.theme === t.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
              >
                <t.icon className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Theme */}
        <div>
          <h4 className="text-sm font-medium text-slate-900 mb-4">Primary Color</h4>
          <div className="flex space-x-4">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => updateSettings('appearance', { colorTheme: c.id })}
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-transform ${c.class} ${settings.appearance.colorTheme === c.id ? 'ring-4 ring-offset-2 ring-slate-200 scale-110' : 'hover:scale-110'}`}
              >
                {settings.appearance.colorTheme === c.id && (
                  <div className="h-3 w-3 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* View Density */}
        <div>
          <h4 className="text-sm font-medium text-slate-900 mb-4">View Density</h4>
          <div className="flex space-x-4 bg-slate-50 p-1 rounded-lg w-max">
            {(['comfortable', 'compact'] as const).map((density) => (
              <button
                key={density}
                onClick={() => updateSettings('appearance', { viewDensity: density })}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${settings.appearance.viewDensity === density ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Layout className="h-4 w-4 mr-2" />
                {density.charAt(0).toUpperCase() + density.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
