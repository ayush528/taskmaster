'use client';

import React from 'react';
import { Shield, Eye, Users, Calendar } from 'lucide-react';

export default function PrivacySettings({ isLoaded, settings, updateSettings }: any) {
  if (!isLoaded) return null;

  const toggleSetting = (key: keyof typeof settings.privacy) => {
    updateSettings('privacy', { [key]: !settings.privacy[key] });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
          <Shield className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Privacy & Security</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Profile Visibility */}
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Eye className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Profile Visibility</p>
              <p className="text-sm text-slate-500">Who can see your profile details?</p>
            </div>
          </div>
          <select
            value={settings.privacy.visibility}
            onChange={(e) => updateSettings('privacy', { visibility: e.target.value })}
            className="mt-1 block w-[120px] rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border bg-white"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="team">Team Only</option>
          </select>
        </div>

        {/* Share Progress */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Share Progress</p>
              <p className="text-sm text-slate-500">Allow other students in your courses to see your task progress.</p>
            </div>
          </div>
          <button 
            role="switch" 
            aria-checked={settings.privacy.shareProgress}
            onClick={() => toggleSetting('shareProgress')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${settings.privacy.shareProgress ? 'bg-orange-500' : 'bg-slate-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.privacy.shareProgress ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Share Calendar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Share Calendar</p>
              <p className="text-sm text-slate-500">Let team members view your availability and schedule.</p>
            </div>
          </div>
          <button 
            role="switch" 
            aria-checked={settings.privacy.shareCalendar}
            onClick={() => toggleSetting('shareCalendar')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${settings.privacy.shareCalendar ? 'bg-orange-500' : 'bg-slate-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.privacy.shareCalendar ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
