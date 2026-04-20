'use client';

import React, { useState } from 'react';
import { Search, Plus, User as UserIcon } from 'lucide-react';
import { TeamMember } from '../../hooks/useTeamMembers';
import TeamMemberCard from './TeamMemberCard';

interface Props {
  members: TeamMember[];
  onAdd: () => void;
  onEdit: (m: TeamMember) => void;
  onDelete: (id: string | number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function TeamMembersSection({ members, onAdd, onEdit, onDelete, sortBy, setSortBy }: Props) {
  const [search, setSearch] = useState('');

  const filteredData = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'tasks') return b.tasksAssigned - a.tasksAssigned;
    if (sortBy === 'completion') {
      const aRate = a.tasksAssigned ? a.tasksCompleted / a.tasksAssigned : 0;
      const bRate = b.tasksAssigned ? b.tasksCompleted / b.tasksAssigned : 0;
      return bRate - aRate;
    }
    return 0;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 space-y-4 xl:space-y-0">
        <h2 className="text-xl font-bold text-slate-900">Directory</h2>
        
        <button 
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-sm w-full xl:w-auto justify-center"
        >
          <Plus className="w-4 h-4 mr-2 text-purple-200" strokeWidth={3} /> Add Member
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-colors"
          />
        </div>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full lg:w-auto px-4 py-2 text-sm font-semibold bg-white border border-slate-200 text-slate-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600 cursor-pointer"
        >
          <option value="name">Sort by Name</option>
          <option value="completion">Sort by Completion %</option>
          <option value="tasks">Sort by Tasks Assigned</option>
        </select>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 flex-1 pb-4">
        {sortedData.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <UserIcon className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No members found</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search filters.</p>
          </div>
        ) : (
          sortedData.map(m => (
            <TeamMemberCard 
              key={m.id} 
              member={m} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
}
