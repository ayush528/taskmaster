'use client';

import { useTasks, Task, RecurringRule } from '../context/TaskContext';
import { generateInstances } from '../lib/recurrenceUtils';

export function useRecurringTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const generateFutureInstances = (parentTask: Task, count: number = 10) => {
    if (!parentTask.recurringRule) return;

    // Generate dates
    const dates = generateInstances(parentTask.deadline, parentTask.recurringRule, count);
    
    // We already have the parent task representing the first instance (or the master).
    // Let's assume the parent task IS the master, and we auto-generate virtual ones or real ones.
    // Real ones: we add them to the tasks array.
    // For this prompt: "When saving recurring task... Generate future instances on demand"
    
    const existingChildren = tasks.filter(t => t.parentId === parentTask.id);
    const existingDates = new Set(existingChildren.map(t => t.deadline));
    // Also include parent itself
    existingDates.add(parentTask.deadline);

    // Create tasks for any generated dates that don't exist
    dates.forEach(d => {
      const dateStr = d.toISOString().split('T')[0];
      if (!existingDates.has(dateStr)) {
        addTask({
          title: parentTask.title,
          description: parentTask.description,
          priority: parentTask.priority,
          category: parentTask.category,
          deadline: dateStr,
          parentId: parentTask.id,
          recurringRule: parentTask.recurringRule,
        });
      }
    });
  };

  const deleteSeries = (parentId: string) => {
    // Delete parent and all children
    const toDelete = tasks.filter(t => t.id === parentId || t.parentId === parentId);
    toDelete.forEach(t => deleteTask(t.id));
  };

  const updateAllFuture = (currentTask: Task, updates: Partial<Task>) => {
    const parentId = currentTask.parentId || currentTask.id;
    // Find all tasks in series that are >= this task's deadline
    const series = tasks.filter(t => t.id === parentId || t.parentId === parentId);
    
    series.forEach(t => {
      if (new Date(t.deadline) >= new Date(currentTask.deadline)) {
        updateTask(t.id, updates);
      }
    });
  };

  return {
    generateFutureInstances,
    deleteSeries,
    updateAllFuture
  };
}
