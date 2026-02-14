import { NextRequest, NextResponse } from 'next/server';
import { EmissionFactor, ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // Mock factors
    const factors: EmissionFactor[] = [
        { commodity: 'CRUDE', process: 'Production', region: 'US', factor: 20, unit: 'kgCO2e/bbl', source: 'EPA', effectiveDate: '2023-01-01' },
        { commodity: 'CRUDE', process: 'Refining', region: 'US', factor: 40, unit: 'kgCO2e/bbl', source: 'EPA', effectiveDate: '2023-01-01' },
        { commodity: 'NATGAS', process: 'Production', region: 'US', factor: 2, unit: 'kgCO2e/MMBtu', source: 'EPA', effectiveDate: '2023-01-01' },
    ];

    const provenance: ProvenanceRef = {
        sourceSystem: 'PetroSquareESG',
        sourceType: 'INTERNAL',
        ingestedAt: new Date().toISOString(),
        asOf: new Date().toISOString(),
        notes: 'Emission Factors'
    };

    return NextResponse.json({
        data: factors,
        status: 'ok',
        provenance: [provenance]
    });
}
