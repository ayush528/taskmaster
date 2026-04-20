'use client';

import React from 'react';
import { Task } from '../../context/TaskContext';
import { 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  isSameDay, 
  formatDate 
} from '../../hooks/useCalendarTasks';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  tasksByDate: Map<string, Task[]>;
}

export default function CalendarGrid({ 
  currentDate, 
  selectedDate, 
  setSelectedDate, 
  tasksByDate 
}: CalendarGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);
  const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

  const today = new Date();

  // Color mapping logic 
  const getDotColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
      case 'URGENT':
        return 'bg-red-500';
      case 'High Priority':
      case 'HIGH PRIORITY':
      case 'HIGH':
        return 'bg-orange-500';
      case 'Medium Priority':
      case 'Normal':
      case 'NORMAL':
        return 'bg-blue-500';
      default:
        return 'bg-slate-400';
    }
  };

  const renderCells = () => {
    const cells = [];
    let currentDay = 1;
    let nextMonthDay = 1;

    for (let i = 0; i < totalCells; i++) {
      let cellDate: Date;
      let isCurrentMonth = false;

      // Determine date for this cell
      if (i < firstDay) {
        cellDate = new Date(year, month - 1, prevMonthDays - firstDay + i + 1);
      } else if (currentDay <= daysInMonth) {
        cellDate = new Date(year, month, currentDay);
        isCurrentMonth = true;
        currentDay++;
      } else {
        cellDate = new Date(year, month + 1, nextMonthDay);
        nextMonthDay++;
      }

      const isToday = isSameDay(cellDate, today);
      const isSelected = isSameDay(cellDate, selectedDate);
      const formattedDate = formatDate(cellDate);
      const dayTasks = tasksByDate.get(formattedDate) || [];
      const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;

      cells.push(
        <div 
          key={i}
          onClick={() => setSelectedDate(cellDate)}
          className={`min-h-[120px] p-2 border border-slate-100 flex flex-col relative cursor-pointer transition-colors
            ${!isCurrentMonth ? 'bg-slate-50 opacity-60 text-slate-400' : isWeekend ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50'}`}
        >
          <div className="flex justify-between items-start mb-1">
            <span 
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
                ${isToday ? 'bg-blue-600 text-white shadow-sm' : isSelected ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}
            >
              {cellDate.getDate()}
            </span>
            {dayTasks.length > 0 && (
               <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                 {dayTasks.length}
               </span>
            )}
          </div>
          
          <div className="mt-2 space-y-1 overflow-hidden flex-1">
            {dayTasks.slice(0, 3).map((t) => (
              <div 
                key={t.id} 
                className="flex items-center space-x-1.5 text-xs text-slate-600 truncate break-normal bg-slate-50 px-1.5 py-1 rounded-md border border-slate-100"
                title={t.title}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${getDotColor(t.priority)}`} />
                <span className="truncate">{t.title}</span>
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="text-xs font-semibold text-slate-400 pl-1 mt-1">
                +{dayTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div 
            key={day} 
            className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 bg-slate-100 gap-[1px]">
        {renderCells()}
      </div>
    </div>
  );
}
