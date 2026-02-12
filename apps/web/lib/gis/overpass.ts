const OVERPASS_API = process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';

export interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
  nodes?: number[];
  geometry?: { lat: number; lon: number }[];
}

export interface OverpassResponse {
  version: number;
  generator: string;
  elements: OverpassElement[];
}

export async function fetchWells(bbox: string): Promise<any> {
    // Input bbox: minLon,minLat,maxLon,maxLat (West, South, East, North)
    if (!bbox || bbox.split(',').length !== 4) return { type: 'FeatureCollection', features: [] };

    const [w, s, e, n] = bbox.split(',').map(Number);

    // Overpass query format: (south,west,north,east)
    const query = `
      [out:json][timeout:10];
      (
        node["man_made"="petroleum_well"](${s},${w},${n},${e});
        node["man_made"="oil_well"](${s},${w},${n},${e});
      );
      out geom;
    `;

    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch(OVERPASS_API, {
            method: 'POST',
            body: query,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            signal: controller.signal
        });
        clearTimeout(id);

        if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);

        const data: OverpassResponse = await res.json();
        return convertToGeoJSON(data.elements);
    } catch (e) {
        console.error("Overpass Fetch Error", e);
        return { type: 'FeatureCollection', features: [] };
    }
}

function convertToGeoJSON(elements: OverpassElement[]) {
    if (!elements) return { type: 'FeatureCollection', features: [] };

    const features = elements
        .filter(e => e.type === 'node' && (e.tags?.man_made === 'petroleum_well' || e.tags?.man_made === 'oil_well'))
        .map(e => ({
            type: 'Feature',
            id: e.id,
            properties: {
                ...e.tags,
                id: e.id,
                type: 'WELL',
                status: 'ACTIVE', // Mock status
                name: e.tags?.name || `Well ${e.id}`
            },
            geometry: {
                type: 'Point',
                coordinates: [e.lon, e.lat]
            }
        }));

    return {
        type: 'FeatureCollection',
        features
    };
}
