'use client';

import * as React from 'react';

type HighlightProps = {
  children: string;
  query: string;
};

export function Highlight({ children, query }: HighlightProps) {
  if (!query) {
    return <>{children}</>;
  }

  const parts = children.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === query.toLowerCase()
              ? { backgroundColor: 'hsl(var(--primary) / 0.5)', color: 'hsl(var(--primary-foreground))' }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </>
  );
}