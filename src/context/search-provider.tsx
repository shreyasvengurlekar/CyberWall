'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [internalQuery, setInternalQuery] = useState('');

  const value = {
    // Pass the real query to consumers like the Header
    searchQuery: internalQuery,
    // Let consumers update the query
    setSearchQuery: setInternalQuery,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
