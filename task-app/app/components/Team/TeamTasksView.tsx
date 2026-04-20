import React from 'react';
import { CheckCircle2, Circle, Clock, FolderClosed } from 'lucide-react';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { Task } from '../../context/TaskContext';

interface TeamTasksViewProps {
  filter: 'All' | 'Completed' | 'In Progress' | 'Overdue';
}

export default function TeamTasksView({ filter }: TeamTasksViewProps) {
  const { members, getTasksForMember } = useTeamMembers();

  // Helper to check if task matches filter
  const taskMatchesFilter = (task: Task) => {
    const isCompleted = task.status === 'completed';
    // For mock purposes, let's pretend "Overdue" is just an example condition.
    // We'll treat all pending tasks as "In Progress" for simplicity unless they have "Urgent" priority, which we'll mock as "Overdue".
    const isOverdue = !isCompleted && task.priority === 'Urgent';
    
    if (filter === 'Completed') return isCompleted;
    if (filter === 'In Progress') return !isCompleted && !isOverdue;
    if (filter === 'Overdue') return isOverdue;
    return true; // "All"
  };

  return (
    <div className="space-y-8">
      {members.map(member => {
        const allTasks = getTasksForMember(member.id);
        const filteredTasks = allTasks.filter(taskMatchesFilter);
        
        if (filteredTasks.length === 0 && filter !== 'All') return null; // Hide empty sections when filtering

        const completedCount = allTasks.filter(t => t.status === 'completed').length;
        const totalCount = allTasks.length;
        const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

        return (
          <div key={member.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Context Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                  {member.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{member.name}</h4>
                  <div className="flex items-center text-xs text-slate-500 font-medium">
                    <span className={member.role === 'Admin' ? 'text-purple-600' : 'text-blue-600'}>
                      {member.role}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{completedCount}/{totalCount} Tasks Completed</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-32 md:w-48 hidden sm:block">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No tasks to display for {member.name}.
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="pt-0.5">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-3 mt-1.5 text-xs font-medium text-slate-500">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {task.deadline}
                          </div>
                          {task.category && (
                            <div className="flex items-center">
                              <FolderClosed className="h-3.5 w-3.5 mr-1" />
                              {task.category}
                            </div>
                          )}
                          <div className={`px-2 py-0.5 rounded-md ${
                            task.priority === 'Urgent' || task.priority === 'High Priority' ? 'bg-red-50 text-red-700' :
                            task.priority === 'Medium Priority' ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {task.priority}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
