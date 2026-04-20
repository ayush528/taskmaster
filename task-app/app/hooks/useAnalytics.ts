import { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { generateAnalytics } from '../lib/analyticsUtils';

export function useAnalytics() {
  const { tasks } = useTasks();

  const metrics = useMemo(() => {
    return generateAnalytics(tasks);
  }, [tasks]);

  return {
    metrics,
    tasks
  };
}
