import { NextRequest, NextResponse } from 'next/server';
import { RiskEngine } from '../../../../../lib/markets/analytics';
import { MarketDataService } from '../../../../../lib/markets/data';
import { AnalyticsResultEnvelope, ProvenanceRef } from '@petrosquare/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { positions, method = 'PARAMETRIC', confidence = 0.95 } = body;

        let totalVaR = 0;

        if (!Array.isArray(positions)) {
             return NextResponse.json({ status: 'error', message: 'positions must be array' }, { status: 400 });
        }

        for (const pos of positions) {
             const { instrumentId, qty } = pos;
             // Get Volatility from historical data
             const series = await MarketDataService.getPriceSeries(instrumentId);

             if (!series || series.length < 10) {
                 // Fallback or skip
                 continue;
             }

             const prices = series.map(p => p.price);
             const returns = [];
             for(let i=1; i<prices.length; i++) returns.push(Math.log(prices[i]/prices[i-1]));

             const currentPrice = prices[prices.length-1];
             const positionValue = qty * currentPrice;

             if (method === 'PARAMETRIC') {
                 const mean = returns.reduce((a,b)=>a+b,0)/returns.length;
                 const variance = returns.reduce((a,b)=>a+Math.pow(b-mean,2),0)/returns.length;
                 const vol = Math.sqrt(variance);

                 const vaR = RiskEngine.computeParametricVaR(Math.abs(positionValue), vol, confidence);
                 totalVaR += vaR;
             } else {
                 // Historical Simulation per position (simplified)
                 const vaRPercent = RiskEngine.computeHistoricalVaR(returns, confidence);
                 totalVaR += Math.abs(positionValue) * vaRPercent;
             }
        }

        const provenance: ProvenanceRef = {
            sourceSystem: 'PetroSquareRisk',
            sourceType: 'INTERNAL',
            ingestedAt: new Date().toISOString(),
            asOf: new Date().toISOString(),
            notes: `VaR (${method}) Confidence ${confidence}`
        };

        const envelope: AnalyticsResultEnvelope<number> = {
            id: crypto.randomUUID(),
            kind: 'VAR',
            asOf: new Date().toISOString(),
            value: totalVaR,
            status: 'OK',
            provenance: [provenance]
        };

        return NextResponse.json(envelope);

    } catch (e) {
        return NextResponse.json({ status: 'error', message: String(e) }, { status: 500 });
    }
}
