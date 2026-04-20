'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import SearchBar from './Search/SearchBar';
import UserMenu from './Profile/UserMenu';
import { useProfile } from '../hooks/useProfile';
import Link from 'next/link';

export default function Topbar({ title = "Dashboard Overview" }: { title?: string }) {
  const { profile, isLoaded } = useProfile();
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>

      <div className="flex items-center space-x-6">
        <SearchBar />

        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
