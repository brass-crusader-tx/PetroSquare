'use client';

import { useEffect } from 'react';
import { useTelemetryStore } from '../stores/telemetryStore';
import { useTimeStore } from '../stores/timeStore';

export const useMockTelemetry = () => {
  const updatePoint = useTelemetryStore((state) => state.updatePoint);
  const isPlaying = useTimeStore((state) => state.isPlaying);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // Mock data points
      const points = [
        { id: 'pump-101-pressure', base: 1200, variance: 50, status: 'RAW' as const },
        { id: 'separator-202-temp', base: 85, variance: 5, status: 'RAW' as const },
        { id: 'well-001-flow', base: 450, variance: 20, status: 'INFERRED' as const },
      ];

      points.forEach((p) => {
        const value = p.base + (Math.random() - 0.5) * p.variance;
        updatePoint(p.id, value, p.status);
      });
    }, 1000); // 1Hz updates

    return () => clearInterval(interval);
  }, [isPlaying, updatePoint]);
};
