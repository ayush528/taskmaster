'use client';

import { useState, useEffect } from 'react';

export type ReminderType = 'in-app' | 'email' | 'sms';
export type ReminderFrequency = 'one-time' | 'daily' | 'weekly';

export interface Reminder {
  id: string;
  taskId: string;
  taskTitle: string; 
  type: ReminderType;
  timeOffsetLabel: string; // e.g. '30 minutes before' or 'Custom'
  triggerTime: string; // ISO timestamp for next trigger
  frequency: ReminderFrequency;
  snoozedUntil?: string | null; // ISO timestamp
  isDone: boolean;
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('taskReminders');
    if (stored) {
      try {
        setReminders(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse reminders from local storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('taskReminders', JSON.stringify(reminders));
    }
  }, [reminders, isLoaded]);

  const addReminder = (r: Omit<Reminder, 'id' | 'isDone'>) => {
    const newReminder: Reminder = {
      ...r,
      id: Math.random().toString(36).substring(7),
      isDone: false,
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const snoozeReminder = (id: string, minutes: number) => {
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + minutes);
    updateReminder(id, { snoozedUntil: snoozeTime.toISOString() });
  };

  const markAsDone = (id: string) => {
    // If recurring, we would calculate the next trigger time. 
    // For simplicity here, we just mark it as done if it's one-time, 
    // or simulate moving to next schedule if recurring.
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    if (reminder.frequency === 'one-time') {
      updateReminder(id, { isDone: true });
    } else {
      // simulate next trigger time
      const nextTime = new Date(reminder.triggerTime);
      if (reminder.frequency === 'daily') nextTime.setDate(nextTime.getDate() + 1);
      if (reminder.frequency === 'weekly') nextTime.setDate(nextTime.getDate() + 7);
      
      updateReminder(id, { 
        triggerTime: nextTime.toISOString(),
        snoozedUntil: null
      });
    }
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    snoozeReminder,
    markAsDone,
    isLoaded
  };
}
