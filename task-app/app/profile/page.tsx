'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ProfileSection from '../components/Profile/ProfileSection';
import SettingsSection from '../components/Profile/SettingsSection';
import { User, Settings as SettingsIcon } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');

  return (
    <DashboardLayout title="Account">
      <div className="flex h-full min-h-[500px]">
        {/* Left Side: Tabs Panel */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 p-6 flex-shrink-0">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Account Settings</h2>
          
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' 
                  : 'text-slate-600 hover:bg-white hover:text-purple-600 border border-transparent'
              }`}
            >
              <User className={`w-5 h-5 mr-3 ${activeTab === 'profile' ? 'text-purple-600' : 'text-slate-400'}`} />
              Public Profile
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' 
                  : 'text-slate-600 hover:bg-white hover:text-purple-600 border border-transparent'
              }`}
            >
              <SettingsIcon className={`w-5 h-5 mr-3 ${activeTab === 'settings' ? 'text-purple-600' : 'text-slate-400'}`} />
              App Settings
            </button>
          </div>
        </div>

        {/* Right Side: Content Area */}
        <div className="flex-1 bg-white overflow-y-auto relative">
          <div className="max-w-4xl mx-auto p-8 lg:p-12">
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ProfileSection />
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SettingsSection />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
