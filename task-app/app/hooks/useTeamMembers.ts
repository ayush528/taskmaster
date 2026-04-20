'use client';

import { useState, useEffect, useMemo } from 'react';
import { Task, useTasks } from '../context/TaskContext';

export interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  status: 'active' | 'inactive';
  avatar: string;
  // Computed values
  tasksAssigned: number;
  tasksCompleted: number;
}

const INITIAL_MEMBERS: TeamMember[] = [
  { id: 1, name: "Alice Johnson", email: "alice@college.edu", role: "Admin", tasksAssigned: 0, tasksCompleted: 0, status: "active", avatar: "AJ" },
  { id: 2, name: "Bob Smith", email: "bob@college.edu", role: "Member", tasksAssigned: 0, tasksCompleted: 0, status: "active", avatar: "BS" },
  { id: 3, name: "Carol Lee", email: "carol@college.edu", role: "Member", tasksAssigned: 0, tasksCompleted: 0, status: "inactive", avatar: "CL" },
];

export function useTeamMembers() {
  const { tasks } = useTasks();
  const [membersData, setMembersData] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('taskmaster_team');
    if (saved) {
      try {
        setMembersData(JSON.parse(saved));
      } catch (e) {
        setMembersData(INITIAL_MEMBERS);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('taskmaster_team', JSON.stringify(membersData));
    }
  }, [membersData, isLoaded]);

  // Compute tasks for each member dynamically based on the Tasks context
  // Fallback to their static tasksAssigned if no assignee property perfectly matches
  const computedMembers = useMemo(() => {
    return membersData.map(member => {
      // Assuming tasks have an `assignee` property. If they don't, this will just return 0.
      const memberTasks = tasks.filter((t: any) => t.assignee === member.name);
      
      const computedAssigned = memberTasks.length;
      const computedCompleted = memberTasks.filter(t => t.status === 'completed').length;
      
      // Use dynamic count if there are assigned tasks, otherwise default to static stats for visual testing
      return {
        ...member,
        tasksAssigned: computedAssigned > 0 ? computedAssigned : (member as any)._staticAssigned || 0,
        tasksCompleted: computedAssigned > 0 ? computedCompleted : (member as any)._staticCompleted || 0,
        memberTasks // Attached for the UI
      };
    });
  }, [membersData, tasks]);

  const addMember = (member: Omit<TeamMember, 'id' | 'avatar' | 'tasksAssigned' | 'tasksCompleted'>) => {
    const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) || 'XX';
    const newMember: TeamMember = {
      ...member,
      id: Math.random().toString(36).substring(7),
      avatar: initials,
      tasksAssigned: 0,
      tasksCompleted: 0,
      ...( { _staticAssigned: 0, _staticCompleted: 0 } as any )
    };
    setMembersData(prev => [...prev, newMember]);
  };

  const updateMember = (id: string | number, updates: Partial<TeamMember>) => {
    setMembersData(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMember = (id: string | number) => {
    setMembersData(prev => prev.filter(m => m.id !== id));
  };

  // Stats
  const totalMembers = computedMembers.length;
  const totalTasks = computedMembers.reduce((acc, m) => acc + m.tasksAssigned, 0);
  const totalCompleted = computedMembers.reduce((acc, m) => acc + m.tasksCompleted, 0);
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const deadline = new Date(t.deadline);
    const today = new Date();
    today.setHours(0,0,0,0);
    return deadline < today;
  }).length;

  const getTasksForMember = (memberId: string | number): Task[] => {
    const member = computedMembers.find(m => m.id === memberId);
    if (!member) return [];
    return (member as any).memberTasks || [];
  };

  return {
    members: computedMembers,
    addMember,
    updateMember,
    deleteMember,
    getTasksForMember,
    stats: {
      totalMembers,
      totalTasks,
      completionRate,
      overdueTasks
    },
    tasks // pass original tasks to cross reference easily
  };
}
