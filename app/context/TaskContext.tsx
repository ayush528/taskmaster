'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'Low Priority' | 'Normal' | 'Medium Priority' | 'High Priority' | 'Urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string; // YYYY-MM-DD or readable string
  priority: TaskPriority;
  status: TaskStatus;
  category?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
}

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize Homepage Design UI',
    deadline: '2023-10-24', // Example
    priority: 'High Priority',
    status: 'pending',
    category: 'Design Project'
  },
  {
    id: '2',
    title: 'Review Q3 Budget Proposals',
    deadline: '2023-10-25',
    priority: 'Medium Priority',
    status: 'completed',
    category: 'Finance'
  },
  {
    id: '3',
    title: 'Update Documentation for API v2',
    deadline: '2023-10-24',
    priority: 'Normal',
    status: 'pending',
    category: 'Backend'
  },
  {
    id: '4',
    title: 'Weekly Team Synchronization',
    deadline: '2023-10-26',
    priority: 'Urgent',
    status: 'pending',
    category: 'Team'
  }
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  // We are asked to use local state, no DB. We can optionally use localStorage.
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local tasks");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(7),
      status: 'pending'
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTaskCompletion }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
