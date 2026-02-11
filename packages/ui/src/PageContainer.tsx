import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`container mx-auto py-12 px-4 sm:px-6 lg:px-8 ${className || ''}`}>
      {children}
    </div>
  );
}
