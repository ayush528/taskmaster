'use client';

import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendarTasks } from '../hooks/useCalendarTasks';
import CalendarGrid from '../components/Calendar/CalendarGrid';
import DateTaskPanel from '../components/Calendar/DateTaskPanel';

export default function CalendarPage() {
  const {
    tasksByDate,
    selectedDateTasks,
    currentDate,
    selectedDate,
    setSelectedDate,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    toggleTaskCompletion,
    year,
    month
  } = useCalendarTasks();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <DashboardLayout title="Calendar">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
             <CalendarIcon className="w-8 h-8 mr-3 text-blue-600" />
             {monthName} {year}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            View and manage your tasks by date.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={handlePrevMonth}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleToday}
            className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors border-x border-slate-100"
          >
            Today
          </button>
          
          <button 
            onClick={handleNextMonth}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid component */}
      <CalendarGrid 
        currentDate={currentDate} 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        tasksByDate={tasksByDate} 
      />

      {/* Bottom Panel displaying tasks for the selected date */}
      <DateTaskPanel 
        selectedDate={selectedDate} 
        tasks={selectedDateTasks} 
        toggleTaskCompletion={toggleTaskCompletion} 
      />
    </DashboardLayout>
  );
}
