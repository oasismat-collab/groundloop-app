import { useEffect, useState } from 'react';
import { watchProfile, type Profile } from '../lib/api';
import { useAuth } from './useAuth';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => (user ? watchProfile(user.uid, setProfile) : undefined), [user]);
  return { user, profile };
}
