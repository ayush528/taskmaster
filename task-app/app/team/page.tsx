'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useTeamMembers, TeamMember } from '../hooks/useTeamMembers';
import { Users, CheckCircle, Clock } from 'lucide-react';
import TeamMembersSection from '../components/Team/TeamMembersSection';
import TeamTasksSection from '../components/Team/TeamTasksSection';
import AddMemberModal from '../components/Team/AddMemberModal';

export default function TeamPage() {
  const { members, stats, addMember, updateMember, deleteMember } = useTeamMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [sortBy, setSortBy] = useState('name');

  const handleAddClick = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string | number) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      deleteMember(id);
    }
  };

  const handleSaveMember = (data: Partial<TeamMember>) => {
    if (editingMember) {
      updateMember(editingMember.id, data);
    } else {
      addMember(data as any);
    }
  };

  return (
    <DashboardLayout title="Team Management">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Team Management</h1>
        <p className="text-slate-500 font-medium">
          Manage your colleagues, overview task assignments, and track weekly progress.
        </p>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Members</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.totalMembers}</h3>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Team Tasks</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.totalTasks}</h3>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4 flex-1">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-500 mb-1 flex justify-between">
                <span>Completion Rate</span>
                <span className="font-bold text-emerald-600">{stats.completionRate}%</span>
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                 <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }} />
              </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 relative">
              <Clock className="w-6 h-6" />
              {stats.overdueTasks > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Overdue Tasks</p>
              <h3 className={`text-2xl font-bold ${stats.overdueTasks > 0 ? 'text-red-600' : 'text-slate-900'}`}>{stats.overdueTasks}</h3>
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,450px] gap-8 h-full min-h-[500px]">
        {/* Left Section: Team Members Directory */}
        <TeamMembersSection 
          members={members} 
          onAdd={handleAddClick} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Right Section: Team Task Progress */}
        <TeamTasksSection members={members} />
      </div>

      <AddMemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMember}
        editingMember={editingMember}
      />
    </DashboardLayout>
  );
}
