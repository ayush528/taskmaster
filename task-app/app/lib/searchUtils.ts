import Fuse from 'fuse.js';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  project: string;
  tags?: string[];
  priority: string;
  dueDate: string;
  status: string;
}

export interface SearchFilters {
  priorities: string[];
  statuses: string[];
  projects: string[];
  date: 'all' | 'today' | 'this_week' | 'this_month' | 'overdue';
}

export function performFuzzySearch(items: SearchResult[], query: string): SearchResult[] {
  if (!query.trim()) return items;
  
  const fuse = new Fuse(items, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'description', weight: 1 },
      { name: 'project', weight: 1.5 },
      { name: 'tags', weight: 1 }
    ],
    threshold: 0.3,
    ignoreLocation: true,
  });
  
  return fuse.search(query).map(result => result.item);
}

export function applySearchFilters(items: SearchResult[], filters: SearchFilters): SearchResult[] {
  return items.filter(item => {
    // 1. Priority Filter
    if (filters.priorities.length > 0) {
      const match = filters.priorities.some(p => item.priority.toUpperCase().includes(p.toUpperCase()));
      if (!match) return false;
    }

    // 2. Status Filter
    if (filters.statuses.length > 0) {
      const isCompleted = item.status === 'completed';
      const isInProgress = item.status === 'in_progress';
      const isNotStarted = !isCompleted && !isInProgress;
      
      const statusFiltersLower = filters.statuses.map(s => s.toLowerCase());
      
      const statusMatched = 
        (statusFiltersLower.includes('completed') && isCompleted) ||
        (statusFiltersLower.includes('in progress') && isInProgress) ||
        (statusFiltersLower.includes('not started') && isNotStarted);
        
      if (!statusMatched) return false;
    }

    // 3. Project Filter
    if (filters.projects.length > 0) {
      if (!item.project || !filters.projects.includes(item.project)) {
        return false;
      }
    }

    // 4. Date Filter
    if (filters.date !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const taskDate = new Date(item.dueDate);
      if (isNaN(taskDate.getTime())) return false; // Skip invalid dates if filtered
      taskDate.setHours(0, 0, 0, 0);

      if (filters.date === 'overdue' && taskDate < today && item.status !== 'completed') {
        // match
      } else if (filters.date === 'today' && taskDate.getTime() === today.getTime()) {
        // match
      } else if (filters.date === 'this_week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        if (taskDate < today || taskDate > nextWeek) return false;
      } else if (filters.date === 'this_month') {
        if (taskDate.getMonth() !== today.getMonth() || taskDate.getFullYear() !== today.getFullYear()) return false;
      } else {
         return false;
      }
    }

    return true;
  });
}
