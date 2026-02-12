import type { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`container mx-auto py-12 px-4 sm:px-6 lg:px-8 ${className || ''}`}>
      {children}
    </div>
  );
}
