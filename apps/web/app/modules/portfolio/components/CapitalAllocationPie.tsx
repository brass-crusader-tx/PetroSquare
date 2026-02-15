'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CapitalAllocation } from '@petrosquare/types';

interface CapitalAllocationPieProps {
    allocations: CapitalAllocation[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

export function CapitalAllocationPie({ allocations }: CapitalAllocationPieProps) {
    const data = allocations.slice(0, 7).map((alloc, i) => ({
        name: alloc.asset_id, // Should resolve asset name
        value: alloc.allocation_percentage,
        amount: alloc.allocation_amount
    }));

    // Add "Other" if many allocations
    if (allocations.length > 7) {
        const others = allocations.slice(7).reduce((sum, alloc) => sum + alloc.allocation_percentage, 0);
        data.push({ name: 'Others', value: others, amount: allocations.slice(7).reduce((sum, alloc) => sum + alloc.allocation_amount, 0) });
    }

    return (
        <div className="w-full h-[300px] bg-surface rounded-lg p-4 border border-border">
            <h3 className="text-sm font-medium text-muted mb-4">Capital Allocation (Top Assets)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        isAnimationActive={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} formatter={(value: number) => `${value.toFixed(1)}%`} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
