import React from 'react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({ title, description, className, children }: SectionHeaderProps) {
  return (
    <div className={`mb-8 flex flex-col md:flex-row md:items-start md:justify-between pb-6 border-b border-white/5 ${className || ''}`}>
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-base text-muted/80 leading-relaxed font-sans">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-4 md:mt-0 md:ml-6 flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
