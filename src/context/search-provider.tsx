'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Always pass an empty query to consumers to disable highlighting
  const value = {
    searchQuery: '',
    setSearchQuery,
  }

  // The actual query is managed internally for the search suggestion feature
  const internalValue = {
    searchQuery,
    setSearchQuery,
  }


  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
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
