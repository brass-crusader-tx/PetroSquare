import { GISFeature } from './types';

/**
 * Checks if a point [lon, lat] is inside a bounding box [minX, minY, maxX, maxY].
 */
export function pointInBBox(point: number[], bbox: number[]): boolean {
  if (point.length < 2 || bbox.length < 4) return false;
  return (
    point[0] >= bbox[0] &&
    point[0] <= bbox[2] &&
    point[1] >= bbox[1] &&
    point[1] <= bbox[3]
  );
}

/**
 * Basic Point-in-Polygon (Ray Casting)
 */
export function pointInPolygon(point: number[], vs: number[][]): boolean {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];

      const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Calculates Haversine distance between two points [lon, lat] in km.
 */
export function haversineDistance(pt1: number[], pt2: number[]): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(pt2[1] - pt1[1]);
    const dLon = deg2rad(pt2[0] - pt1[0]);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(pt1[1])) * Math.cos(deg2rad(pt2[1])) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

/**
 * Simple Grid-based Clustering for Points.
 */
export function clusterPoints(features: GISFeature[], zoom: number): GISFeature[] {
  if (!features.length) return [];
  if (zoom >= 10) return features; // Don't cluster at high zoom (10+)

  // Grid size in degrees. Roughly: 360 / 2^zoom
  // At zoom 4 -> ~22 deg.
  // We want finer grid. e.g. 50px cell on screen.
  // World width in px at zoom Z = 256 * 2^Z
  // Cell size in deg = 360 * (cellSizePx / worldWidthPx)
  // Let cellSizePx = 50.
  const cellSizePx = 60;
  const worldWidthPx = 256 * Math.pow(2, zoom);
  const gridSize = 360 * (cellSizePx / worldWidthPx);

  const clusters: Record<string, { count: number, sumX: number, sumY: number, feature: GISFeature }> = {};
  const singles: GISFeature[] = [];

  for (const f of features) {
    if (f.geometry.type !== 'Point') {
      singles.push(f);
      continue;
    }
    const coords = (f.geometry as any).coordinates;
    const lon = coords[0];
    const lat = coords[1];

    const gridX = Math.floor(lon / gridSize);
    const gridY = Math.floor(lat / gridSize);
    const key = `${gridX},${gridY}`;

    if (!clusters[key]) {
      clusters[key] = { count: 0, sumX: 0, sumY: 0, feature: f };
    }

    clusters[key].count++;
    clusters[key].sumX += lon;
    clusters[key].sumY += lat;
  }

  const result: GISFeature[] = [];

  for (const key in clusters) {
    const c = clusters[key];
    if (c.count === 1) {
      result.push(c.feature);
    } else {
      const avgX = c.sumX / c.count;
      const avgY = c.sumY / c.count;

      result.push({
        id: `cluster-${key}`,
        org_id: c.feature.org_id,
        layer_id: c.feature.layer_id,
        geometry: {
          type: 'Point',
          coordinates: [avgX, avgY]
        },
        properties: {
          cluster: true,
          point_count: c.count,
          cluster_id: key
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  return [...result, ...singles];
}
