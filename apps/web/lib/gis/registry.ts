import { GISLayer, GISFeature, GISQueryOptions } from './types';
import { MOCK_ASSETS, MOCK_BASINS } from './data';
import { pointInBBox, clusterPoints, pointInPolygon, haversineDistance } from './spatial';
import { fetchPipelines } from './pipelines';
import { getCachedFeatures, setCachedFeatures } from './cache';
import { log } from './observability';

// In-memory Store
export const LAYERS: GISLayer[] = [
  {
    id: 'l-wells',
    org_id: 'org-1',
    name: 'Production Wells',
    type: 'POINT',
    source_type: 'internal_geojson',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'l-basins',
    org_id: 'org-1',
    name: 'Sedimentary Basins',
    type: 'POLYGON',
    source_type: 'internal_geojson',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'l-pipelines',
    org_id: 'org-1',
    name: 'Pipelines (EIA)',
    type: 'LINE',
    source_type: 'external_arcgis',
    source_url: 'https://services7.arcgis.com/...',
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const FEATURES: GISFeature[] = [];

// Initialize Mock Data
// 1. Wells
MOCK_ASSETS.forEach(a => {
  FEATURES.push({
    id: a.id,
    org_id: 'org-1',
    layer_id: 'l-wells',
    geometry: a.geometry,
    properties: {
      ...a
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
});

// 2. Basins
MOCK_BASINS.forEach(b => {
  FEATURES.push({
    id: b.id,
    org_id: 'org-1',
    layer_id: 'l-basins',
    geometry: b.geometry as GeoJSON.Geometry,
    properties: {
      name: b.name,
      code: b.code,
      description: b.description
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
});

// --- Registry API ---

export const GISRegistry = {
  getLayers: async (orgId: string): Promise<GISLayer[]> => {
    return LAYERS.filter(l => l.org_id === orgId || l.is_public);
  },

  getLayer: async (id: string): Promise<GISLayer | undefined> => {
    return LAYERS.find(l => l.id === id);
  },

  addLayer: async (layer: GISLayer): Promise<void> => {
    LAYERS.push(layer);
  },

  getFeatures: async (layerId: string, options: GISQueryOptions = {}): Promise<GISFeature[]> => {
    const layer = await GISRegistry.getLayer(layerId);
    if (!layer) return [];

    const startTime = Date.now();

    // Cache Key
    const cacheKey = `features:${layerId}:${JSON.stringify(options)}`;
    const cached = getCachedFeatures(cacheKey);
    if (cached) {
      log('info', 'Cache hit', { layerId, options, duration: Date.now() - startTime });
      return cached;
    }

    // Handle External Sources (Limited query support)
    if (layer.source_type === 'external_arcgis' && layerId === 'l-pipelines') {
        const bboxStr = options.bbox ? options.bbox.join(',') : '-125,25,-65,50'; // Default US
        const pipelineData = await fetchPipelines(bboxStr);
        const result = (pipelineData.features || []).map((f: any, i: number) => ({
             id: `pipe-${i}`,
             org_id: layer.org_id,
             layer_id: layer.id,
             geometry: f.geometry,
             properties: f.properties,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
        }));
        setCachedFeatures(cacheKey, result);
        log('info', 'External source fetched', { layerId, count: result.length, duration: Date.now() - startTime });
        return result;
    }

    // Handle Internal Sources
    let result = FEATURES.filter(f => f.layer_id === layerId);

    // 1. BBox Filter
    if (options.bbox) {
       result = result.filter(f => {
         if (f.geometry.type === 'Point') {
           return pointInBBox((f.geometry as any).coordinates, options.bbox!);
         }
         return true; // Simplified for non-points
       });
    }

    // 2. Polygon Filter
    if (options.polygon) {
        result = result.filter(f => {
            if (f.geometry.type === 'Point') {
                return pointInPolygon((f.geometry as any).coordinates, options.polygon!);
            }
            return false; // Only points in polygon for now
        });
    }

    // 3. Radius Filter
    if (options.radius) {
        result = result.filter(f => {
             if (f.geometry.type === 'Point') {
                 const dist = haversineDistance((f.geometry as any).coordinates, options.radius!.center);
                 return dist <= options.radius!.km;
             }
             return false;
        });
    }

    // 4. Clustering (only for Points)
    if (options.zoom !== undefined && layer.type === 'POINT') {
        result = clusterPoints(result, options.zoom);
    }

    // 5. Limit
    if (options.limit) {
      result = result.slice(0, options.limit);
    }

    setCachedFeatures(cacheKey, result);
    log('info', 'Features fetched', { layerId, count: result.length, duration: Date.now() - startTime });
    return result;
  },

  getFeatureById: async (id: string): Promise<GISFeature | undefined> => {
      return FEATURES.find(f => f.id === id);
  }
};
