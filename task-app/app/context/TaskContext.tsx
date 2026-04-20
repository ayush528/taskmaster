'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../lib/api';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'Low Priority' | 'Normal' | 'Medium Priority' | 'High Priority' | 'Urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ActivityLog {
  id: string;
  type: 'created' | 'modified' | 'comment';
  content?: string;
  timestamp: string;
}

export interface RecurringRule {
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "custom";
  interval?: number;
  daysOfWeek?: string[]; // If weekly (e.g., 'mo', 'tu')
  endDate?: string;
  occurrenceCount?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string; // YYYY-MM-DD or readable string
  priority: TaskPriority;
  status: TaskStatus;
  category?: string;
  assignee?: string;
  subtasks?: Subtask[];
  tags?: string[];
  activity?: ActivityLog[];
  recurringRule?: RecurringRule;
  parentId?: string; // If this is an instance of a recurring task
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
  const fetchTasks = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
        const backendTasks = await tasksAPI.list();
        // Guard: only map if the response is an actual array
        if (Array.isArray(backendTasks)) {
          const mapped = backendTasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            deadline: t.due_date ? t.due_date.split('T')[0] : '',
            priority: t.priority === 'HIGH' || t.priority === 'URGENT' ? 'High Priority' : 'Normal',
            status: t.status === 'completed' ? 'completed' : t.status === 'in_progress' ? 'in_progress' : 'pending',
            tags: t.tags
          }));
          setTasks(mapped.length > 0 ? mapped : defaultTasks);
        } else {
          // Backend returned an error object (e.g. 401) — fall back to local data
          console.warn("Backend returned non-array response, using local data");
          const saved = localStorage.getItem('tasks');
          setTasks(saved ? JSON.parse(saved) : defaultTasks);
        }
      } else {
        // Not logged in — use localStorage or defaults
        const saved = localStorage.getItem('tasks');
        if (saved) {
          setTasks(JSON.parse(saved));
        }
      }
    } catch (err) {
      console.error("Failed to fetch tasks from backend", err);
      const saved = localStorage.getItem('tasks');
      setTasks(saved ? JSON.parse(saved) : defaultTasks);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('access_token')) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = async (task: Omit<Task, 'id' | 'status'>) => {
    if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
      try {
        const priorityToEnum = task.priority.includes('High') || task.priority === 'Urgent' ? 'HIGH' : 'NORMAL';
        await tasksAPI.create({
          title: task.title,
          description: task.description,
          priority: priorityToEnum,
          due_date: task.deadline ? new Date(task.deadline).toISOString() : null,
          tags: task.tags
        });
        fetchTasks();
      } catch (err) {
        console.error("Failed to add task", err);
      }
    } else {
      const newTask: Task = {
        ...task,
        id: Math.random().toString(36).substring(7),
        status: 'pending'
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (typeof window !== 'undefined' && localStorage.getItem('access_token') && id.length > 20) { // UUID check
      try {
        const payload: any = {};
        if (updates.title) payload.title = updates.title;
        if (updates.description) payload.description = updates.description;
        if (updates.deadline) payload.due_date = new Date(updates.deadline).toISOString();
        if (updates.status) {
          payload.status = updates.status === 'completed' ? 'completed' : updates.status === 'in_progress' ? 'in_progress' : 'not_started';
        }
        await tasksAPI.update(id, payload);
        fetchTasks();
      } catch (err) {
        console.error("Failed to update task", err);
      }
    } else {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  };

  const deleteTask = async (id: string) => {
    if (typeof window !== 'undefined' && localStorage.getItem('access_token') && id.length > 20) {
      try {
        await tasksAPI.delete(id);
        fetchTasks();
      } catch (err) {
        console.error("Failed to delete task", err);
      }
    } else {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const isCompleted = task.status === 'completed';
    const nextStatus = isCompleted ? 'pending' : 'completed';
    
    if (typeof window !== 'undefined' && localStorage.getItem('access_token') && id.length > 20) {
      try {
        await tasksAPI.update(id, {
          status: isCompleted ? 'not_started' : 'completed'
        });
        fetchTasks();
      } catch (err) {
        console.error("Failed to toggle task", err);
      }
    } else {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    }
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
