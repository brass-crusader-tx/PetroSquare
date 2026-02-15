'use client';

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { EfficientFrontierPoint } from '@petrosquare/types';

interface EfficientFrontierChartProps {
    data: EfficientFrontierPoint[];
    currentRisk?: number;
    currentReturn?: number;
}

export function EfficientFrontierChart({ data, currentRisk, currentReturn }: EfficientFrontierChartProps) {
    const formattedData = data.map(point => ({
        x: point.risk * 100, // %
        y: point.return / 1000000, // Millions
        sharpe: point.sharpe_ratio
    }));

    const currentPoint = currentRisk !== undefined && currentReturn !== undefined ? [
        { x: currentRisk * 100, y: currentReturn / 1000000, label: 'Current Portfolio' }
    ] : [];

    return (
        <div className="w-full h-[300px] bg-surface rounded-lg p-4 border border-border">
            <h3 className="text-sm font-medium text-muted mb-4">Efficient Frontier (Risk vs Return)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" dataKey="x" name="Volatility" unit="%" stroke="#9ca3af" />
                    <YAxis type="number" dataKey="y" name="Return (NPV)" unit="M" stroke="#9ca3af" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                    <Scatter name="Frontier" data={formattedData} fill="#3b82f6" line shape="circle" />
                    {currentPoint.length > 0 && (
                        <Scatter name="Current" data={currentPoint} fill="#ef4444" shape="diamond" r={6} />
                    )}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
