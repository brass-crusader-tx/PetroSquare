import { Request, Response } from 'express';
import { CapabilitiesResponse } from '@petrosquare/types';

export const getCapabilities = (req: Request, res: Response<CapabilitiesResponse>) => {
  res.json({
    domains: [
      'PRODUCTION',
      'MARKET',
      'GIS',
      'COST',
      'RISK',
      'INTELLIGENCE'
    ],
    layers: [
      'PRESENTATION',
      'API_INTEGRATION',
      'PROCESSING_ANALYTICS',
      'DATA_STORAGE_MANAGEMENT',
      'AI_ML',
      'SECURITY_COMPLIANCE'
    ],
    modules: [
      'reserves-analytics',
      'market-intelligence',
      'spatial-analytics',
      'production-forecasting'
    ],
    features: {
      aiReady: true,
      analyticsReady: true,
      realtimeReady: true
    }
  });
};
