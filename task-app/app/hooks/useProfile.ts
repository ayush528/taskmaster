import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin';
  joinedDate: string;
  avatarUrl?: string | null;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  role: 'Student',
  joinedDate: '2023-09-15',
  avatarUrl: null,
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse profile from local storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile };
    setProfile(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
  };

  return { profile, updateProfile, isLoaded };
}
