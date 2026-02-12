// Source: EIA Crude Oil Pipelines
const ARCGIS_PIPELINES_URL = process.env.PIPELINES_ARCGIS_URL || 'https://services7.arcgis.com/FGr1D95XCGNH5qKd/arcgis/rest/services/Crude_Oil_Pipelines_US_EIA/FeatureServer/0/query';

export async function fetchPipelines(bbox: string): Promise<any> {
    // bbox: minLon,minLat,maxLon,maxLat
    if (!bbox || bbox.split(',').length !== 4) return { type: 'FeatureCollection', features: [] };
    const [minLon, minLat, maxLon, maxLat] = bbox.split(',').map(Number);

    // ArcGIS REST API Query
    const params = new URLSearchParams({
        f: 'geojson',
        where: '1=1',
        geometry: `${minLon},${minLat},${maxLon},${maxLat}`,
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'Operator,Type,Status,Shape_Length,Pipeline',
        returnGeometry: 'true',
        resultRecordCount: '100' // Limit to avoid heavy load
    });

    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const res = await fetch(`${ARCGIS_PIPELINES_URL}?${params.toString()}`, {
             signal: controller.signal
        });
        clearTimeout(id);

        if (!res.ok) throw new Error(`ArcGIS API error: ${res.status}`);

        const data = await res.json();

        // Normalize properties if needed
        if (data.features) {
            data.features = data.features.map((f: any) => ({
                ...f,
                properties: {
                    ...f.properties,
                    type: 'PIPELINE',
                    status: f.properties.Status || 'ACTIVE',
                    name: f.properties.Pipeline || f.properties.Operator || 'Pipeline'
                }
            }));
        }

        return data;
    } catch (e) {
        console.error("Pipelines Fetch Error", e);
        return { type: 'FeatureCollection', features: [] };
    }
}
