'use client';

import { useState, useEffect } from 'react';

export interface Project {
  id: string | number;
  name: string;
  description: string;
  color: string;
  tasksCount: number;
  members: string[];
  lastUpdated: string;
}

const INITIAL_PROJECTS: Project[] = [
  { id: 1, name: "Web Design", description: "Homepage redesign", color: "purple", tasksCount: 5, members: ["Alex", "Sarah", "Mike"], lastUpdated: "Oct 20" },
  { id: 2, name: "Backend API", description: "REST API for app", color: "blue", tasksCount: 3, members: ["Alex"], lastUpdated: "Oct 18" },
  { id: 3, name: "Documentation", description: "API docs", color: "green", tasksCount: 8, members: ["Sarah", "Mike", "John"], lastUpdated: "Oct 15" }
];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  useEffect(() => {
    const saved = localStorage.getItem('taskmaster_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load projects');
      }
    } else {
      setProjects(INITIAL_PROJECTS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskmaster_projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<Project, 'id' | 'tasksCount' | 'members' | 'lastUpdated'>) => {
    const newProject: Project = {
      ...project,
      id: Math.random().toString(36).substring(7),
      tasksCount: 0,
      members: ["Alex"], // default current user
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string | number, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) } : p));
  };

  const deleteProject = (id: string | number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return { projects, addProject, updateProject, deleteProject };
}
