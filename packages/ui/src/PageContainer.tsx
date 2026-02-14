import type { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`mx-auto max-w-7xl px-6 py-8 md:py-12 ${className || ''}`}>
      {children}
    </div>
  );
}
