import { useState, useEffect } from 'react';

export interface UserSettings {
  notifications: {
    emailReminders: boolean;
    smsReminders: boolean;
    phoneNumber: string;
    deadlineAlerts: '24h' | '6h' | '1h' | 'none';
    taskCompletion: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    colorTheme: string;
    viewDensity: 'compact' | 'comfortable';
  };
  privacy: {
    visibility: 'public' | 'private';
    shareProgress: boolean;
    shareCalendar: boolean;
  };
  taskDefaults: {
    priority: 'low' | 'medium' | 'high';
    category: string;
    autoCompleteRecurring: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    emailReminders: true,
    smsReminders: false,
    phoneNumber: '',
    deadlineAlerts: '24h',
    taskCompletion: true,
  },
  appearance: {
    theme: 'light',
    colorTheme: 'orange',
    viewDensity: 'comfortable',
  },
  privacy: {
    visibility: 'private',
    shareProgress: false,
    shareCalendar: false,
  },
  taskDefaults: {
    priority: 'medium',
    category: 'General',
    autoCompleteRecurring: false,
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userSettings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse settings from local storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (section: keyof UserSettings, updates: Partial<UserSettings[typeof section]>) => {
    const updated = {
      ...settings,
      [section]: {
        ...settings[section],
        ...updates,
      },
    };
    setSettings(updated);
    localStorage.setItem('userSettings', JSON.stringify(updated));
  };

  return { settings, updateSettings, isLoaded };
}
