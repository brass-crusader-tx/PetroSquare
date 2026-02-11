"use client";

import { DataPanel, DataPanelProps } from '@petrosquare/ui';
import { useUI } from './LayoutShell';

export function SmartDataPanel(props: DataPanelProps) {
  const { inspectMode } = useUI();
  return <DataPanel {...props} inspectMode={inspectMode} />;
}
