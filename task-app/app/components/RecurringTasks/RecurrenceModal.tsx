'use client';

import React, { useState, useEffect } from 'react';
import { RecurringRule } from '../../context/TaskContext';
import { X, Calendar } from 'lucide-react';
import RecurrencePreview from './RecurrencePreview';

interface RecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: RecurringRule | null) => void;
  initialRule?: RecurringRule;
  startDateStr: string;
}

export default function RecurrenceModal({ isOpen, onClose, onSave, initialRule, startDateStr }: RecurrenceModalProps) {
  const [isRecurring, setIsRecurring] = useState(!!initialRule);
  const [frequency, setFrequency] = useState<RecurringRule['frequency']>(initialRule?.frequency || 'weekly');
  const [interval, setIntervalCount] = useState<number>(initialRule?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(initialRule?.daysOfWeek || ['MO']);
  const [endType, setEndType] = useState<'never' | 'count' | 'date'>(
    initialRule?.endDate ? 'date' : initialRule?.occurrenceCount ? 'count' : 'never'
  );
  const [endDate, setEndDate] = useState<string>(initialRule?.endDate || new Date().toISOString().split('T')[0]);
  const [count, setCount] = useState<number>(initialRule?.occurrenceCount || 10);

  useEffect(() => {
    if (isOpen) {
      setIsRecurring(!!initialRule);
      if (initialRule) {
        setFrequency(initialRule.frequency);
        setIntervalCount(initialRule.interval || 1);
        setDaysOfWeek(initialRule.daysOfWeek || []);
        if (initialRule.endDate) {
          setEndType('date');
          setEndDate(initialRule.endDate);
        } else if (initialRule.occurrenceCount) {
          setEndType('count');
          setCount(initialRule.occurrenceCount);
        } else {
          setEndType('never');
        }
      }
    }
  }, [isOpen, initialRule]);

  if (!isOpen) return null;

  const currentRule: RecurringRule = {
    frequency,
    interval,
    daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
    endDate: endType === 'date' ? endDate : undefined,
    occurrenceCount: endType === 'count' ? count : undefined,
  };

  const handleSave = () => {
    onSave(isRecurring ? currentRule : null);
    onClose();
  };

  const toggleDay = (day: string) => {
    setDaysOfWeek(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const daysOpts = [
    { label: 'S', val: 'SU' }, { label: 'M', val: 'MO' }, { label: 'T', val: 'TU' },
    { label: 'W', val: 'WE' }, { label: 'T', val: 'TH' }, { label: 'F', val: 'FR' },
    { label: 'S', val: 'SA' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recurrence Settings</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className={`w-12 h-6 rounded-full transition-colors relative ${isRecurring ? 'bg-purple-600' : 'bg-slate-300'}`}>
               <input type="checkbox" className="sr-only" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} />
               <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isRecurring ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-sm font-bold text-slate-800">Make this task recurring</span>
          </label>

          {isRecurring && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              {/* Frequency Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Repeat Frequency</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['daily', 'weekly', 'biweekly', 'monthly'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f as any)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border capitalize transition-colors ${frequency === f ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Days Selection */}
              {frequency === 'weekly' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Repeat on</label>
                  <div className="flex space-x-2">
                    {daysOpts.map(d => (
                      <button
                        key={d.val}
                        onClick={() => toggleDay(d.val)}
                        className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${daysOfWeek.includes(d.val) ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* End Date */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ends</label>
                <div className="space-y-3">
                   <label className="flex items-center space-x-3 cursor-pointer">
                     <input type="radio" checked={endType === 'never'} onChange={() => setEndType('never')} className="text-purple-600 focus:ring-purple-500 w-4 h-4" />
                     <span className="text-sm text-slate-700 font-medium">Never</span>
                   </label>
                   
                   <label className="flex items-center space-x-3 cursor-pointer">
                     <input type="radio" checked={endType === 'date'} onChange={() => setEndType('date')} className="text-purple-600 focus:ring-purple-500 w-4 h-4" />
                     <span className="text-sm text-slate-700 font-medium whitespace-nowrap">On Date</span>
                     {endType === 'date' && (
                       <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="ml-2 px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-purple-500 outline-none" />
                     )}
                   </label>

                   <label className="flex items-center space-x-3 cursor-pointer">
                     <input type="radio" checked={endType === 'count'} onChange={() => setEndType('count')} className="text-purple-600 focus:ring-purple-500 w-4 h-4" />
                     <span className="text-sm text-slate-700 font-medium whitespace-nowrap">After occurrences</span>
                     {endType === 'count' && (
                       <div className="flex items-center ml-2 border border-slate-200 rounded overflow-hidden">
                         <input type="number" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} className="w-16 px-2 py-1 text-xs border-none focus:ring-1 focus:ring-purple-500 outline-none" min={1} />
                       </div>
                     )}
                   </label>
                </div>
              </div>

              <RecurrencePreview rule={currentRule} startDateStr={startDateStr} />
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-700 transition-all shadow-md">
            Save Rule
          </button>
        </div>
      </div>
    </div>
  );
}
