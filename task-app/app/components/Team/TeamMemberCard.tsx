'use client';

import React, { useState } from 'react';
import { Edit2, Shield, Trash2, User as UserIcon } from 'lucide-react';
import { TeamMember } from '../../hooks/useTeamMembers';

interface Props {
  member: TeamMember;
  onEdit: (m: TeamMember) => void;
  onDelete: (id: string | number) => void;
}

export default function TeamMemberCard({ member, onEdit, onDelete }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  // Derive color consistently from first letter
  const getAvatarColor = (name: string) => {
    const charCode = name.charCodeAt(0) % 5;
    const colors = [
      'bg-purple-100 text-purple-600',
      'bg-blue-100 text-blue-600',
      'bg-emerald-100 text-emerald-600',
      'bg-orange-100 text-orange-600',
      'bg-rose-100 text-rose-600'
    ];
    return colors[charCode];
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getAvatarColor(member.name)}`}>
             {member.avatar}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center">
              {member.name}
              {member.role === 'Admin' && <span title="Admin"><Shield className="w-3.5 h-3.5 ml-1.5 text-orange-500" /></span>}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{member.email}</p>
          </div>
        </div>

        {/* Hover Actions */}
        <div className={`flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <button 
             onClick={() => onEdit(member)} 
             className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
           >
             <Edit2 className="w-4 h-4" />
           </button>
           <button 
             onClick={() => onDelete(member.id)} 
             className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
           >
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          <span className={`text-[11px] font-bold uppercase tracking-wider ${member.status === 'active' ? 'text-emerald-700' : 'text-slate-500'}`}>
            {member.status}
          </span>
        </div>
        
        <span className="text-xs font-semibold text-slate-500">
           {member.tasksAssigned} tasks · {member.tasksCompleted} done
        </span>
      </div>
    </div>
  );
}
