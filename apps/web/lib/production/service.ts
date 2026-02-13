import { AISummary } from '@petrosquare/types';

export const MOCK_PROD_SUMMARIES: Record<string, AISummary> = {
    'US': {
        context_id: 'US',
        context_type: 'REGION' as any, // Using generic string here as types might not have strict enum for REGION yet
        generated_at: new Date().toISOString(),
        model_version: 'PetroGPT-4-Turbo',
        sources: ['EIA Petroleum Supply Monthly', 'Baker Hughes Rig Count'],
        confidence_score: 0.94,
        summary_markdown: `
# US Production Overview

*   **Output Trends**: US crude production is trending upward, reaching **13.2 MMbbl/d**. Permian efficiency gains outweigh rig count declines.
*   **Inventory**: Commercial crude stocks are building slightly (+1.2 MMbbl), suggesting softer refinery demand during maintenance season.
*   **Risks**: Hurricane season forecasting suggests elevated risk for Gulf of Mexico shut-ins in late Q3.
        `
    },
    'CA': {
        context_id: 'CA',
        context_type: 'REGION' as any,
        generated_at: new Date().toISOString(),
        model_version: 'PetroGPT-4-Turbo',
        sources: ['CER Energy Information', 'Alberta AER'],
        confidence_score: 0.91,
        summary_markdown: `
# Canadian Production Update

*   **Oil Sands**: In-situ projects are operating at **98% capacity** following turnaround completion.
*   **Export Capacity**: Pipeline nominations exceed capacity by 12%, keeping differentials wide (-$18.50 WCS/WTI).
*   **Regulatory**: New methane regulations in Alberta may impact marginal conventional wells.
        `
    }
};

export async function getProductionSummary(contextId: string): Promise<AISummary | null> {
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
    return MOCK_PROD_SUMMARIES[contextId] || null;
}
