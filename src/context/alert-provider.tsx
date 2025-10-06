
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AlertOptions = {
  title: string;
  message: string;
  variant?: 'default' | 'destructive';
  onConfirm?: () => void;
};

type AlertContextType = {
  alert: AlertOptions | null;
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  const showAlert = (options: AlertOptions) => {
    setAlert(options);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  const value = {
    alert,
    showAlert,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
