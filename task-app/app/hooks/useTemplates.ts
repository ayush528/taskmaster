'use client';

import { useState, useEffect } from 'react';
import { Template, PREPOPULATED_TEMPLATES } from '../lib/templateUtils';

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('taskTemplates');
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (e) {
        setTemplates(PREPOPULATED_TEMPLATES);
      }
    } else {
      setTemplates(PREPOPULATED_TEMPLATES);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('taskTemplates', JSON.stringify(templates));
    }
  }, [templates, isLoaded]);

  const addTemplate = (t: Omit<Template, 'id'>) => {
    const newTpl: Template = { ...t, id: Math.random().toString(36).substring(7) };
    setTemplates(prev => [...prev, newTpl]);
  };

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    isLoaded
  };
}
