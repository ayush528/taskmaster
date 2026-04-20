'use client';

import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { Camera, Mail, Key } from 'lucide-react';

export default function ProfileSection() {
  const { profile, updateProfile, isLoaded } = useProfile();
  
  // Local state for editing fields
  const [name, setName] = useState('');
  
  // Initial sync once loaded
  React.useEffect(() => {
    if (isLoaded) {
      setName(profile.name);
    }
  }, [isLoaded, profile.name]);

  if (!isLoaded) return <div className="p-8 text-slate-500">Loading profile...</div>;

  const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

  const handleNameSave = () => {
    updateProfile({ name });
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden pb-8">
       <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-500 w-full relative"></div>
       
       <div className="px-8 flex flex-col items-center md:items-start md:flex-row relative">
         {/* Avatar */}
         <div className="-mt-16 mb-4 md:mb-0 md:mr-6 shrink-0 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md relative overflow-hidden group text-4xl font-black text-slate-400">
               {profile.avatarUrl ? (
                 <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : initials}
               
               <button className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="w-6 h-6 mb-1" />
                 <span className="text-[10px] uppercase font-bold tracking-wider">Change Avatar</span>
               </button>
            </div>
         </div>

         <div className="pt-4 flex-1 w-full text-center md:text-left">
           <div className="flex flex-col md:flex-row items-center justify-between mb-2">
             <div className="w-full max-w-sm">
               <input 
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 onBlur={handleNameSave}
                 className="text-2xl font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none bg-transparent w-full text-center md:text-left transition-colors"
                 placeholder="Your Name"
               />
             </div>
             
             <span className="inline-block mt-3 md:mt-0 font-bold text-xs uppercase tracking-wider px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
               {profile.role || 'Student'}
             </span>
           </div>

           <p className="text-slate-500 font-medium mb-1">
             <Mail className="inline w-4 h-4 mr-1.5" />
             {profile.email}
           </p>
           
           <p className="text-slate-400 text-sm">Member since October 20, 2024</p>
         </div>
       </div>

       <div className="px-8 mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center p-4 border border-slate-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-purple-200 flex items-center justify-center mr-3 text-slate-500 group-hover:text-purple-700 transition-colors">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-slate-800">Change Avatar</p>
              <p className="text-xs text-slate-500">Upload a new photo</p>
            </div>
          </button>

          <button className="flex items-center justify-center p-4 border border-slate-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-purple-200 flex items-center justify-center mr-3 text-slate-500 group-hover:text-purple-700 transition-colors">
              <Key className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-slate-800">Change Password</p>
              <p className="text-xs text-slate-500">Update security</p>
            </div>
          </button>
          
          <button className="col-span-1 md:col-span-2 flex items-center justify-center p-4 border border-slate-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-purple-200 flex items-center justify-center mr-3 text-slate-500 group-hover:text-purple-700 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-slate-800">Update Email</p>
              <p className="text-xs text-slate-500">Require verification to switch</p>
            </div>
          </button>
       </div>
    </div>
  );
}
