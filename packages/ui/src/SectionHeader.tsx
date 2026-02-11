import React from 'react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${className || ''}`}>
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-sans">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-lg text-muted font-mono">
          {description}
        </p>
      )}
    </div>
  );
}
