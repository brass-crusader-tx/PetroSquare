import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 px-4 md:px-8 pt-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-sans mb-2">{title}</h1>
          {description && <p className="text-muted text-lg max-w-3xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center space-x-3">{actions}</div>}
      </div>
    </div>
  );
}
