import React from 'react';
import { SearchResult } from '../../lib/searchUtils';
import { Clock, Folder, CheckCircle, AlertCircle, Search as SearchIcon } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  hasFilters: boolean;
  onSelect: (taskId: string) => void;
}

export default function SearchResults({ results, query, hasFilters, onSelect }: SearchResultsProps) {
  
  if (results.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
         <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-3">
            <SearchIcon className="w-6 h-6" />
         </div>
         <p className="text-sm font-bold text-slate-800">No matching tasks found.</p>
         <p className="text-xs text-slate-500 mt-1 max-w-[250px] mx-auto">
           {hasFilters 
             ? "Try adjusting your filters or search terms." 
             : `We couldn't find anything matching "${query}".`}
         </p>
      </div>
    );
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-red-50 text-red-700 border-red-200"><AlertCircle className="inline w-3 h-3 mr-0.5" /> URGENT</span>;
      case 'HIGH PRIORITY':
      case 'HIGH':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-orange-50 text-orange-700 border-orange-200">HIGH</span>;
      case 'LOW PRIORITY':
      case 'LOW':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">LOW</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">NORMAL</span>;
    }
  };

  return (
    <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
      {results.map((result) => (
        <button 
          key={result.id}
          onClick={() => onSelect(result.id)}
          className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex flex-col group"
        >
          <div className="flex items-start justify-between mb-1.5">
             <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 line-clamp-1 flex-1 pr-3">
                {result.title}
             </h4>
             <div className="shrink-0 flex items-center">
               {getPriorityBadge(result.priority)}
             </div>
          </div>
          
          <div className="flex items-center text-xs font-semibold text-slate-500 space-x-3">
             <span className="flex items-center text-blue-600">
               <Folder className="w-3.5 h-3.5 mr-1" />
               <span className="truncate max-w-[120px]">{result.project}</span>
             </span>
             <span className="flex items-center">
               <Clock className="w-3.5 h-3.5 mr-1" />
               {result.dueDate}
             </span>
             {result.status === 'completed' && (
                <span className="flex items-center text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Done
                </span>
             )}
          </div>
        </button>
      ))}
    </div>
  );
}
