'use client';

import React from 'react';
import { AlignLeft, CheckCircle2, Clock, Check } from 'lucide-react';
import { TeamMember } from '../../hooks/useTeamMembers';

interface Props {
  members: TeamMember[];
}

export default function TeamTasksSection({ members }: Props) {

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Team Task Progress</h2>
      
      {members.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <AlignLeft className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No members yet</h4>
          <p className="text-xs text-slate-500 mt-1">Add team members to track their progress.</p>
        </div>
      ) : (
        members.map(member => {
          const completionPercentage = member.tasksAssigned > 0 
            ? Math.round((member.tasksCompleted / member.tasksAssigned) * 100) 
            : 0;
            
          const isAllDone = member.tasksAssigned > 0 && member.tasksCompleted === member.tasksAssigned;

          // We use member.memberTasks if populated from context, otherwise empty
          const tasks = (member as any).memberTasks || [];

          return (
            <div key={member.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                     {member.avatar}
                   </div>
                   <h3 className="font-bold text-slate-800">{member.name}</h3>
                </div>
                
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">
                     {member.tasksCompleted} / {member.tasksAssigned}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 ml-1">completed</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 relative overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-1000 ${isAllDone ? 'bg-emerald-500' : 'bg-purple-600'}`} 
                  style={{ width: `${completionPercentage}%` }} 
                />
              </div>

              {isAllDone ? (
                <div className="flex items-center justify-center bg-emerald-50 rounded-xl py-4 border border-emerald-100">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
                   <span className="text-sm font-bold text-emerald-700">All done! Outstanding.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.length > 0 ? (
                    tasks.map((task: any) => (
                      <div key={task.id} className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                         <div className="flex items-center space-x-3 max-w-[70%]">
                           <div className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 ${task.status === 'completed' ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                              {task.status === 'completed' && <Check className="w-3 h-3" strokeWidth={3} />}
                           </div>
                           <p className={`text-sm font-semibold truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                             {task.title}
                           </p>
                         </div>
                         <div className="flex items-center text-xs font-bold space-x-3">
                            <span className="text-slate-500 flex items-center pr-3 border-r border-slate-200"><Clock className="w-3 h-3 mr-1" />{task.deadline}</span>
                            <span className="text-slate-500 uppercase">{task.priority}</span>
                         </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 font-semibold py-2">No tasks assigned dynamically. Using static counts.</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
