'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Clock } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import { useRouter } from 'next/navigation';
import TaskDetailsModal from '../TaskModal/TaskDetailsModal';

export default function SearchBar() {
  const { 
    query, 
    setQuery, 
    results, 
    filters,
    toggleFilterArray,
    setDateFilter,
    history,
    addToHistory,
    clearHistory
  } = useSearch();

  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    // Keep open so they can see history or filters
  };

  const handleSelectTask = (taskId: string) => {
    addToHistory(query);
    setSelectedTaskId(taskId);
    setIsOpen(false);
    setShowFilters(false);
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addToHistory(query);
    }
  };

  const hasActiveFilters = 
    filters.priorities.length > 0 || 
    filters.statuses.length > 0 || 
    filters.projects.length > 0 || 
    filters.date !== 'all';

  return (
    <div className="relative z-50 w-full max-w-[600px]" ref={wrapperRef}>
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search tasks, projects, or tags... (Cmd/Ctrl + K)"
          className={`w-full pl-10 pr-24 py-2.5 text-sm bg-slate-100/80 border ${isOpen ? 'border-blue-500 bg-white ring-4 ring-blue-500/10' : 'border-transparent'} rounded-xl focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800`}
        />

        <div className="absolute right-2 flex items-center space-x-1">
          {query && (
            <button 
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-md transition-colors ${showFilters || hasActiveFilters ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
            title="Search Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
          
          {showFilters && (
            <SearchFilters 
              filters={filters}
              toggleFilterArray={toggleFilterArray}
              setDateFilter={setDateFilter}
            />
          )}

          {query.trim() === '' && !hasActiveFilters ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                 <span>Recent Searches</span>
                 {history.length > 0 && <button onClick={clearHistory} className="hover:text-red-500">Clear</button>}
              </div>

              {history.length === 0 ? (
                 <p className="text-sm text-slate-400 font-medium py-3 text-center bg-slate-50 rounded-lg">No recent searches</p>
              ) : (
                <div className="space-y-1">
                  {history.map((h, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleHistoryClick(h)}
                      className="w-full flex items-center text-left text-sm font-semibold text-slate-700 p-2.5 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <Clock className="w-4 h-4 mr-3 text-slate-400" /> {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <SearchResults 
              results={results}
              query={query}
              hasFilters={hasActiveFilters}
              onSelect={handleSelectTask}
            />
          )}

          <div className="border-t border-slate-100 p-3 bg-slate-50/50 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400">
               {results.length} results matching criteria
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center">
               powered by Fuse.js
            </span>
          </div>
        </div>
      )}
      
      {/* Detail Modal triggered from Search */}
      <TaskDetailsModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  );
}
