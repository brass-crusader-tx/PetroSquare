import { GISAsset, Basin, MapOverlay, AISummary, OverlayType } from '@petrosquare/types';
import { MOCK_BASINS, MOCK_ASSETS, MOCK_OVERLAYS, MOCK_SUMMARIES } from './data';
import { generateInsight } from '../ai';

export async function getBasins(): Promise<Basin[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_BASINS;
}

export async function getAssets(filters?: {
  basin_id?: string;
  operator_id?: string;
  type?: string;
}): Promise<GISAsset[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  let assets = MOCK_ASSETS;

  if (filters?.basin_id) {
    assets = assets.filter(a => a.basin_id === filters.basin_id);
  }
  if (filters?.operator_id) {
    assets = assets.filter(a => a.operator_id === filters.operator_id);
  }
  if (filters?.type) {
    assets = assets.filter(a => a.type === filters.type);
  }

  return assets;
}

export async function getAssetById(id: string): Promise<GISAsset | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_ASSETS.find(a => a.id === id) || null;
}

export async function getOverlays(): Promise<MapOverlay[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return MOCK_OVERLAYS;
}

export async function getAISummary(contextId: string): Promise<AISummary | null> {

  // 1. Identify Context
  const basin = MOCK_BASINS.find(b => b.id === contextId);
  let asset: GISAsset | null = null;
  let contextType: 'BASIN' | 'ASSET' = 'ASSET';
  let prompt = '';

  if (basin) {
      contextType = 'BASIN';
      prompt = `You are a petroleum engineering assistant. Provide a concise executive summary for the ${basin.name} (${basin.code}). Include production outlook, infrastructure status, and economic key performance indicators. Use markdown with bold headers.`;
  } else {
      // Try Asset
      asset = MOCK_ASSETS.find(a => a.id === contextId) || null;
      if (asset) {
          contextType = 'ASSET';
           prompt = `You are a petroleum engineering assistant. Provide an operational summary for asset ${asset.name} (Type: ${asset.type}). Location: ${asset.latitude}, ${asset.longitude}. Operator: ${asset.operator_id}. Status: ${asset.status}. Include risk assessment and production efficiency. Use markdown with bold headers.`;
      }
  }

  // 2. Try AI Generation (if prompt is valid)
  if (prompt) {
       const insight = await generateInsight(prompt);
       if (insight) {
           return {
               context_id: contextId,
               context_type: contextType,
               summary_markdown: insight.text,
               confidence_score: 0.95,
               generated_at: new Date().toISOString(),
               model_version: insight.model,
               sources: ['Internal Data Lake', 'Market Feeds', 'SCADA History']
           };
       }
  }

  // 3. Fallback (Simulate network latency for mock)
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return pre-canned summary if available
  if (MOCK_SUMMARIES[contextId]) {
      return MOCK_SUMMARIES[contextId];
  }

  // Otherwise, return a generic placeholder for assets
  if (asset) {
      return {
          context_id: asset.id,
          context_type: 'ASSET',
          generated_at: new Date().toISOString(),
          model_version: 'PetroGPT-3.5-Fast (Mock)',
          sources: ['Well Files', 'Production History'],
          confidence_score: 0.85,
          summary_markdown: `**Asset Summary for ${asset.name}**\n\n*   **Status**: ${asset.status}\n*   **Breakeven**: $${asset.breakeven_price}/bbl\n*   **Risk**: ${asset.risk_level} (${asset.risk_score}/100)\n\nThis asset is performing ${asset.current_production && asset.current_production > 1000 ? 'above' : 'within'} expectations.`
      };
  }

  return null;
}
