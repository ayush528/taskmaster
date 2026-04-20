'use client';

import React, { useMemo } from 'react';
import { RecurringRule } from '../../context/TaskContext';
import { generateInstances } from '../../lib/recurrenceUtils';

interface RecurrencePreviewProps {
  rule: RecurringRule;
  startDateStr: string;
}

export default function RecurrencePreview({ rule, startDateStr }: RecurrencePreviewProps) {
  const instances = useMemo(() => {
    return generateInstances(startDateStr, rule, 5); // Just preview next 5
  }, [rule, startDateStr]);

  if (!startDateStr) return null;

  return (
    <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Next 5 Occurrences</h3>
      {instances.length === 0 ? (
        <p className="text-sm text-slate-500">Invalid rule or starting bounds.</p>
      ) : (
        <ul className="space-y-2">
          {instances.slice(0, 5).map((d, i) => (
            <li key={i} className="flex items-center text-sm font-medium text-slate-700">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] mr-3">{i + 1}</span>
              {d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </li>
          ))}
        </ul>
      )}
      {instances.length >= 5 && (
         <p className="mt-3 text-xs font-semibold text-purple-600 underline cursor-pointer">Show all future occurrences</p>
      )}
    </div>
  );
}
