import { TaskPriority } from '../context/TaskContext';

export interface Template {
  id: string;
  name: string;
  description: string;
  dueOffset?: number; // days from today
  dueTime?: string;
  priority: TaskPriority;
  projectId?: string | null;
  tags: string[];
}

export const PREPOPULATED_TEMPLATES: Template[] = [
  {
    id: 'tpl-1',
    name: 'Study Session',
    description: 'Set aside focused time for studying your current material.',
    dueOffset: 0,
    priority: 'Medium Priority',
    projectId: 'Academic',
    tags: ['study', 'academic'],
  },
  {
    id: 'tpl-2',
    name: 'Assignment Submission',
    description: 'Finalize and submit course assignment.',
    dueOffset: 1, // Tomorrow
    dueTime: '23:59',
    priority: 'High Priority',
    projectId: 'Academic',
    tags: ['assignment', 'deadline'],
  },
  {
    id: 'tpl-3',
    name: 'Weekly Review',
    description: 'Review the past week and plan for the coming one.',
    dueOffset: 0, // usually Sunday, but just default 0
    priority: 'Medium Priority',
    projectId: 'Personal',
    tags: ['review', 'weekly'],
  },
  {
    id: 'tpl-4',
    name: 'Meeting Prep',
    description: 'Prepare notes and materials for an upcoming meeting.',
    dueOffset: 0,
    priority: 'High Priority',
    projectId: 'Work',
    tags: ['meeting', 'prep'],
  }
];

export function applyTemplateToTaskData(template: Template) {
  const result: any = {
    title: template.name,
    description: template.description,
    priority: template.priority,
    category: template.projectId || undefined,
    tags: [...template.tags],
  };

  if (template.dueOffset !== undefined) {
    const d = new Date();
    d.setDate(d.getDate() + template.dueOffset);
    result.deadline = d.toISOString().split('T')[0];
  } else {
    // default to today
    result.deadline = new Date().toISOString().split('T')[0];
  }

  // Not doing fully robust time mapping since original Task only holds "2024-10-24" strings mostly.
  return result;
}
