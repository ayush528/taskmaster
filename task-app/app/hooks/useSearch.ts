'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { performFuzzySearch, applySearchFilters, SearchFilters, SearchResult } from '../lib/searchUtils';

export function useSearch() {
  const { tasks } = useTasks();
  
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    priorities: [],
    statuses: [],
    projects: [],
    date: 'all'
  });
  
  const [history, setHistory] = useState<string[]>([]);
  
  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save specific query to history
  const addToHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    setHistory(prev => {
      const filtered = prev.filter(h => h.toLowerCase() !== term.toLowerCase());
      const newHistory = [term, ...filtered].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Convert raw tasks to SearchResult format
  const searchItems = useMemo<SearchResult[]>(() => {
    return tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || '',
      project: t.category || 'Uncategorized',
      tags: t.tags || [],
      priority: t.priority,
      dueDate: t.deadline,
      status: t.status === 'completed' ? 'completed' : 'not_started' // Default simplification
    }));
  }, [tasks]);

  // Run Search + Filters
  const results = useMemo(() => {
    // 1. Fuzzy match first
    let matched = performFuzzySearch(searchItems, debouncedQuery);
    // 2. Filter remaining
    matched = applySearchFilters(matched, filters);
    
    // limit 8
    return matched.slice(0, 8);
  }, [searchItems, debouncedQuery, filters]);

  const toggleFilterArray = (key: 'priorities' | 'statuses' | 'projects', value: string) => {
    setFilters(prev => {
      const curr = prev[key];
      const next = curr.includes(value) ? curr.filter(v => v !== value) : [...curr, value];
      return { ...prev, [key]: next };
    });
  };

  const setDateFilter = (val: SearchFilters['date']) => {
    setFilters(prev => ({ ...prev, date: val }));
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    filters,
    toggleFilterArray,
    setDateFilter,
    history,
    addToHistory,
    clearHistory: () => {
      setHistory([]);
      localStorage.removeItem('searchHistory');
    }
  };
}
