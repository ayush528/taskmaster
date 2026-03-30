'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CheckSquare, FolderClosed, Calendar, Users, CheckCircle2, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Projects', href: '#', icon: FolderClosed },
  { name: 'Calendar', href: '#', icon: Calendar },
  { name: 'Team', href: '#', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Basic local state cleanup could go here
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-slate-200 sticky top-0">
      <div className="p-6 pb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">TaskMaster</h1>
            <p className="text-xs text-slate-500 font-medium">Pro Workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-semibold text-sm ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-semibold text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-500" strokeWidth={2} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
