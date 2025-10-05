
'use client';
import { useState, useEffect, useCallback } from 'react';

type Plan = 'guest' | 'free' | 'pro' | 'business';

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

interface UserState {
  user: User | null;
  plan: Plan;
  scansToday: number;
  login: (plan?: Plan) => void;
  logout: () => void;
  recordScan: () => void;
}

// This is a simulation. In a real app, this would be managed by a proper auth provider and context.
let memoryUser: User | null = null;
let memoryPlan: Plan = 'guest';
let memoryScans = 0;

const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(l => l());
}

export const useUser = (): UserState => {
  const [_, setRender] = useState({});

  useEffect(() => {
    const listener = () => setRender({});
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const login = useCallback((plan: Plan = 'free') => {
    memoryUser = {
      name: 'Shreyas V',
      email: 'shreyas@example.com',
      avatarUrl: 'https://github.com/shreyasvengurlekar.png'
    };
    memoryPlan = plan;
    memoryScans = 0; // Reset scans on login
    notifyListeners();
  }, []);

  const logout = useCallback(() => {
    memoryUser = null;
    memoryPlan = 'guest';
    memoryScans = 0; // Reset scans on logout
    notifyListeners();
  }, []);
  
  const recordScan = useCallback(() => {
    memoryScans++;
    notifyListeners();
  }, []);


  // This effect will run on the client side and can be used to check
  // for a stored session token in a real application.
  useEffect(() => {
    // For simulation, we can add some events to window to allow cross-component interaction
    const loginHandler = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        login(detail?.plan || 'free');
    };
    const logoutHandler = () => logout();

    window.addEventListener('login', loginHandler);
    window.addEventListener('logout', logoutHandler);

    return () => {
        window.removeEventListener('login', loginHandler);
        window.removeEventListener('logout', logoutHandler);
    }
  }, [login, logout]);

  return {
    user: memoryUser,
    plan: memoryPlan,
    scansToday: memoryScans,
    login,
    logout,
    recordScan,
  };
};
