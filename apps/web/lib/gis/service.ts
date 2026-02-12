import { GISAsset, Basin, MapOverlay, AISummary, OverlayType } from '@petrosquare/types';
import { MOCK_BASINS, MOCK_ASSETS, MOCK_OVERLAYS, MOCK_SUMMARIES } from './data';

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
  await new Promise(resolve => setTimeout(resolve, 800)); // AI takes longer

  // Return pre-canned summary if available
  if (MOCK_SUMMARIES[contextId]) {
      return MOCK_SUMMARIES[contextId];
  }

  // Otherwise, return a generic placeholder for assets
  const asset = MOCK_ASSETS.find(a => a.id === contextId);
  if (asset) {
      return {
          context_id: asset.id,
          context_type: 'ASSET',
          generated_at: new Date().toISOString(),
          model_version: 'PetroGPT-3.5-Fast',
          sources: ['Well Files', 'Production History'],
          confidence_score: 0.85,
          summary_markdown: `**Asset Summary for ${asset.name}**\n\n*   **Status**: ${asset.status}\n*   **Breakeven**: $${asset.breakeven_price}/bbl\n*   **Risk**: ${asset.risk_level} (${asset.risk_score}/100)\n\nThis asset is performing ${asset.current_production && asset.current_production > 1000 ? 'above' : 'within'} expectations.`
      };
  }

  return null;
}
