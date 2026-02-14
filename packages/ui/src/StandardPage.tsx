"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { AssetHeader, AssetHeaderProps } from './AssetHeader';
import { AIQueryBar, AIQueryBarProps } from './AIQueryBar';
import { PageContainer } from './PageContainer';

export interface StandardPageProps {
  // Header
  header?: AssetHeaderProps;

  // AI
  aiContext?: string;
  onAIQuery?: (query: string) => void;

  // Content
  children: ReactNode;

  // Optional Layout Overrides
  className?: string;
  loading?: boolean;
}

export function StandardPage({
  header,
  aiContext,
  onAIQuery,
  children,
  className = "",
  loading = false
}: StandardPageProps) {

  // If no header provided, we render nothing for header section?
  // Or maybe we enforce header.
  // Let's assume header is optional but recommended.

  return (
    <PageContainer className={className}>
      {/* 1. Header Section */}
      {header && (
        <AssetHeader {...header} />
      )}

      {/* 2. AI Intelligence Layer (Persistent) */}
      <div className="mb-6 sticky top-0 z-20 bg-background/95 backdrop-blur pb-2 pt-1 -mt-1">
        <AIQueryBar
          onQuery={onAIQuery || ((q) => console.log('AI Query:', q))}
          context={aiContext || header?.title}
          loading={loading}
        />
      </div>

      {/* 3. Main Content */}
      <div className="space-y-6 animate-fade-in">
        {children}
      </div>
    </PageContainer>
  );
}
