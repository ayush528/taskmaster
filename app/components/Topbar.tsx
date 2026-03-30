'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Topbar({ title = "Dashboard Overview" }: { title?: string }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-64 rounded-xl border-none bg-slate-100 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow"
            placeholder="Search tasks..."
          />
        </div>

        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 leading-tight">Alex Rivera</p>
            <p className="text-xs font-medium text-slate-500">Product Designer</p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full bg-orange-100">
            {/* Using a generic SVG for avatar */}
            <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
              <mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
              </mask>
              <g mask="url(#mask__beam)">
                <rect width="36" height="36" fill="#f59e0b"></rect>
                <rect x="0" y="0" width="36" height="36" transform="translate(6 6) rotate(104 18 18) scale(1)" fill="#d97706" rx="36"></rect>
                <g transform="translate(-2 -4) rotate(-4 18 18)">
                  <path d="M15 19c2 1 4 1 6 0" stroke="#000000" strokeWidth="1" strokeLinecap="round"></path>
                  <rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
                  <rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
