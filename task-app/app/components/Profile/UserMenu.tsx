'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '../../hooks/useProfile';

export default function UserMenu() {
  const { profile, isLoaded } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const initials = isLoaded && profile.name 
    ? profile.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
    : 'A';

  return (
    <div className="relative flex items-center space-x-3 border-l border-slate-200 pl-6 cursor-pointer" ref={dropdownRef} onClick={() => setIsOpen(!isOpen)}>
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-slate-900 leading-tight">
          {isLoaded ? profile.name : 'Loading...'}
        </p>
        <p className="text-xs font-medium text-slate-500">
          {isLoaded ? profile.role : 'Student'}
        </p>
      </div>
      
      <div className="h-10 w-10 overflow-hidden rounded-full bg-purple-100 flex items-center justify-center text-lg font-bold text-purple-600 ring-2 ring-white shadow-sm hover:ring-purple-200 transition-all">
        {isLoaded && profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
        ) : (
            initials
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 mt-2 w-64 rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 z-[100] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
             <p className="text-sm font-bold text-slate-800 truncate">{profile.name}</p>
             <p className="text-xs text-slate-500 truncate">{profile.email}</p>
          </div>
          
          <div className="py-2">
            <Link href="/profile" className="flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-purple-600 transition-colors">
              <User className="mr-3 h-4 w-4 text-slate-400" />
              Your Profile
            </Link>
            <Link href="/profile" className="flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-purple-600 transition-colors">
              <Settings className="mr-3 h-4 w-4 text-slate-400" />
              Settings
            </Link>
            
            <div className="border-t border-slate-100 my-1"></div>
            
            <button className="flex w-full items-center px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
