import React from 'react';
import { SearchFilters as FiltersType } from '../../lib/searchUtils';
import { X, Calendar } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';

interface SearchFiltersProps {
  filters: FiltersType;
  toggleFilterArray: (key: 'priorities' | 'statuses' | 'projects', value: string) => void;
  setDateFilter: (val: FiltersType['date']) => void;
}

export default function SearchFilters({ filters, toggleFilterArray, setDateFilter }: SearchFiltersProps) {
  const { projects } = useProjects();
  const projectList = projects.map(p => p.name);

  const priorities = ['URGENT', 'HIGH', 'NORMAL', 'LOW'];
  const statuses = ['Not Started', 'In Progress', 'Completed', 'Overdue'];
  const dates: { label: string; value: FiltersType['date'] }[] = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Overdue', value: 'overdue' }
  ];

  return (
    <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col space-y-4 max-h-[40vh] overflow-y-auto">
      <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
        Refine Results
      </div>
      
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-2">Priority</label>
        <div className="flex flex-wrap gap-2">
          {priorities.map(p => {
            const isActive = filters.priorities.includes(p);
            return (
              <button
                key={p}
                onClick={() => toggleFilterArray('priorities', p)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                {p}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-2">Status</label>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => {
            const isActive = filters.statuses.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleFilterArray('statuses', s)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-2">Project</label>
          <select 
             className="w-full text-sm rounded-lg border border-slate-200 p-2 text-slate-700 bg-white"
             onChange={(e) => {
               const val = e.target.value;
               // If val is not empty and not in filters, toggle it.
               if (val) toggleFilterArray('projects', val);
             }}
             value=""
          >
             <option value="" disabled>Select project...</option>
             {projectList.map(p => (
                <option key={p} value={p}>{p}</option>
             ))}
          </select>
          {filters.projects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.projects.map(p => (
                <span key={p} className="inline-flex items-center text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-1 rounded-md">
                  {p}
                  <button onClick={() => toggleFilterArray('projects', p)} className="ml-1 text-purple-400 hover:text-purple-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-2">Due Date</label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <select 
               className="w-full text-sm rounded-lg border border-slate-200 pl-8 pr-2 py-2 text-slate-700 bg-white"
               value={filters.date}
               onChange={(e) => setDateFilter(e.target.value as FiltersType['date'])}
            >
               {dates.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
               ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
