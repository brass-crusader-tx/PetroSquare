"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Source, Layer, NavigationControl, ScaleControl, FullscreenControl, MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GISAsset, Basin, MapOverlay } from '@petrosquare/types';

interface MapProps {
  basins: Basin[];
  assets: GISAsset[]; // Internal assets
  overlays: MapOverlay[];
  selectedAssetId?: string;
  onAssetSelect: (asset: GISAsset) => void;
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  showWells?: boolean;
  showPipelines?: boolean;
}

export default function GISMap({ basins, assets: internalAssets, overlays, selectedAssetId, onAssetSelect, center, zoom, showWells, showPipelines }: MapProps) {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState({
        longitude: center ? center[1] : -100,
        latitude: center ? center[0] : 40,
        zoom: zoom || 4
    });

    const [osmWells, setOsmWells] = useState<any>(null);
    const [pipelines, setPipelines] = useState<any>(null);

    // Initial FlyTo
    useEffect(() => {
        if (center) {
            mapRef.current?.flyTo({ center: [center[1], center[0]], zoom: zoom || 6 });
        }
    }, [center, zoom]);

    // Fetch Real Data on Move (Debounced)
    useEffect(() => {
        const fetchRealData = async () => {
             if (!mapRef.current) return;
             const bounds = mapRef.current.getBounds();
             if (!bounds) return;

             const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

             if (showWells) {
                 try {
                    const res = await fetch(`/api/gis/osm?bbox=${bbox}`);
                    if (res.ok) setOsmWells(await res.json());
                 } catch(e) { console.error(e); }
             }
             if (showPipelines) {
                 try {
                    const res = await fetch(`/api/gis/pipelines?bbox=${bbox}`);
                    if (res.ok) setPipelines(await res.json());
                 } catch(e) { console.error(e); }
             }
        };

        const timer = setTimeout(fetchRealData, 1500); // 1.5s debounce to be nice to APIs
        return () => clearTimeout(timer);
    }, [viewState, showWells, showPipelines]);

    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const mapStyle = MAPTILER_KEY
        ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`
        : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

    const onClick = useCallback((event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (feature) {
             // Convert feature to GISAsset
             const props = feature.properties || {};
             const geom = feature.geometry as any;
             const coords = geom.coordinates || [0, 0];

             const asset: GISAsset = {
                 id: props.id || 'unknown',
                 name: props.name || 'Unknown Asset',
                 type: (props.type as any) || 'ASSET',
                 status: (props.status as any) || 'UNKNOWN',
                 latitude: coords[1],
                 longitude: coords[0],
                 geometry: geom,
                 operator_id: props.operator || 'Unknown',
                 basin_id: 'unknown',
                 jurisdiction_id: 'unknown',
                 // Extra info
                 metadata: props
             };
             onAssetSelect(asset);
        }
    }, [onAssetSelect]);

    return (
        <div className="h-full w-full relative bg-slate-900">
             <Map
                ref={mapRef}
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle={mapStyle}
                attributionControl={false}
                onClick={onClick}
                interactiveLayerIds={['internal-assets', 'osm-wells', 'pipelines']}
             >
                <NavigationControl position="top-right" />
                <ScaleControl />
                <FullscreenControl position="top-right" />

                {/* Internal Assets */}
                 <Source id="internal-source" type="geojson" data={{
                     type: 'FeatureCollection',
                     features: internalAssets.map(a => ({
                         type: 'Feature',
                         geometry: a.geometry,
                         properties: a
                     }))
                 }}>
                    <Layer
                        id="internal-assets"
                        type="circle"
                        paint={{
                            'circle-radius': 6,
                            'circle-color': '#3B82F6', // Blue for internal
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#FFFFFF'
                        }}
                    />
                 </Source>

                 {/* Real Pipelines */}
                 {showPipelines && pipelines && (
                     <Source id="pipelines-source" type="geojson" data={pipelines}>
                         <Layer
                             id="pipelines"
                             type="line"
                             paint={{ 'line-color': '#F59E0B', 'line-width': 2, 'line-opacity': 0.8 }}
                         />
                     </Source>
                 )}

                 {/* Real Wells (OSM) */}
                 {showWells && osmWells && (
                     <Source id="osm-source" type="geojson" data={osmWells}>
                         <Layer
                             id="osm-wells"
                             type="circle"
                             paint={{
                                 'circle-radius': 4,
                                 'circle-color': '#10B981', // Green for OSM
                                 'circle-stroke-width': 1,
                                 'circle-stroke-color': '#064E3B'
                             }}
                         />
                     </Source>
                 )}
             </Map>

             {/* Legend */}
             <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur p-3 rounded border border-border text-xs z-10 pointer-events-none">
                <div className="font-bold text-white mb-2">Map Layers</div>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500 border border-white"></span>
                        <span className="text-muted">Managed Assets</span>
                    </div>
                    {showWells && (
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-900"></span>
                            <span className="text-muted">OSM Wells</span>
                        </div>
                    )}
                    {showPipelines && (
                        <div className="flex items-center space-x-2">
                            <span className="w-8 h-0.5 bg-amber-500"></span>
                            <span className="text-muted">Pipelines</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
