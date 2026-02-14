
export type GISLayerType = 'POINT' | 'LINE' | 'POLYGON' | 'HEATMAP' | 'RASTER';

export type GISSourceType = 'internal_geojson' | 'external_arcgis' | 'external_wms' | 'external_xyz';

export interface GISLayer {
  id: string;
  org_id: string;
  name: string;
  type: GISLayerType;
  source_type: GISSourceType;
  source_url?: string; // For external sources
  style_json?: Record<string, any>; // MapLibre style spec subset
  is_public: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface GISFeature {
  id: string;
  org_id: string;
  layer_id: string;
  geometry: GeoJSON.Geometry; // Using standard GeoJSON
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface GISQueryOptions {
  bbox?: [number, number, number, number]; // minX, minY, maxX, maxY
  polygon?: number[][]; // Array of [lon, lat] coordinates forming a closed loop
  radius?: { center: [number, number], km: number };
  zoom?: number;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>; // Key-value exact match
}
