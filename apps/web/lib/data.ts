import { Capability } from '@petrosquare/types';

export const CAPABILITIES: Capability[] = [
    {
      domain: 'Upstream',
      layers: [
        {
          name: 'Production & Reserves',
          description: 'Decline curve analysis, reservoir modeling, and ultimate recovery.',
          modules: [
            { id: 'production', name: 'Production', description: 'Production forecasting and monitoring', status: 'active', path: '/modules/production', category: 'upstream' },
            { id: 'reserves', name: 'Reserves', description: 'Reserve estimation and reporting', status: 'beta', path: '/modules/reserves', category: 'upstream' },
          ]
        },
        {
          name: 'GIS & Asset',
          description: 'Spatial analytics and infrastructure mapping.',
          modules: [
             { id: 'gis', name: 'GIS Hub', description: 'Asset mapping and spatial analysis', status: 'active', path: '/modules/gis', category: 'upstream' },
          ]
        }
      ]
    },
    {
      domain: 'Commercial',
      layers: [
        {
          name: 'Market & Trading',
          description: 'Pricing, benchmarks, and derivatives.',
          modules: [
            { id: 'markets', name: 'Market Analytics', description: 'Price curves and arbitrage', status: 'active', path: '/modules/markets', category: 'upstream' },
          ]
        },
        {
          name: 'Economics',
          description: 'Cash flow and project economics.',
          modules: [
            { id: 'economics', name: 'Economics', description: 'Valuation and cash flow modeling', status: 'active', path: '/modules/economics', category: 'finance' },
          ]
        }
      ]
    },
    {
      domain: 'Compliance',
      layers: [
        {
          name: 'Risk & Regulatory',
          description: 'Geopolitics and environmental compliance.',
          modules: [
            { id: 'risk', name: 'Risk Monitor', description: 'Geopolitical and regulatory risk', status: 'active', path: '/modules/risk', category: 'esg' },
          ]
        }
      ]
    }
  ];
