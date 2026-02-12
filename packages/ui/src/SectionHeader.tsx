import React from 'react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({ title, description, className, children }: SectionHeaderProps) {
  return (
    <div className={`mb-8 flex flex-col md:flex-row md:items-start md:justify-between ${className || ''}`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-sans">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-lg text-muted font-mono">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-4 md:mt-0 md:ml-4">
          {children}
        </div>
      )}
    </div>
  );
}
