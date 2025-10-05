'use client';
import {
  useContext,
} from 'react';
import {
  UserContext,
} from '@/firebase/auth/user-provider';

/**
 * Hook to get the current user, profile, and auth methods.
 * Must be used within a UserProvider.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider.');
  }
  return context;
};
