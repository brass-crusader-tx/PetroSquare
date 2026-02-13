"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Source, Layer, NavigationControl, ScaleControl, FullscreenControl, MapRef, MapLayerMouseEvent, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GISAsset, Basin } from '@petrosquare/types';

interface MapProps {
  basins: Basin[];
  assets: GISAsset[]; // Internal assets
  selectedAssetId?: string;
  onAssetSelect: (asset: GISAsset) => void;
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  showWells?: boolean;
  showPipelines?: boolean;
  showHeatmap?: boolean;
  showCarbon?: boolean;
}

export default function GISMap({
    basins, assets: internalAssets, selectedAssetId, onAssetSelect, center, zoom,
    showWells, showPipelines, showHeatmap, showCarbon
}: MapProps) {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState({
        longitude: center ? center[1] : -100,
        latitude: center ? center[0] : 40,
        zoom: zoom || 4
    });

    const [osmWells, setOsmWells] = useState<any>(null);
    const [pipelines, setPipelines] = useState<any>(null);
    const [hoverInfo, setHoverInfo] = useState<{longitude: number, latitude: number, feature: any} | null>(null);

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
                 metadata: props
             };
             onAssetSelect(asset);
        }
    }, [onAssetSelect]);

    const onMouseEnter = useCallback((event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (feature) {
             mapRef.current?.getCanvas().style.setProperty('cursor', 'pointer');
             setHoverInfo({
                 longitude: event.lngLat.lng,
                 latitude: event.lngLat.lat,
                 feature: feature
             });
        }
    }, []);

    const onMouseLeave = useCallback(() => {
        mapRef.current?.getCanvas().style.setProperty('cursor', '');
        setHoverInfo(null);
    }, []);

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
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                interactiveLayerIds={['osm-wells', 'internal-assets', 'pipelines']}
             >
                <NavigationControl position="top-right" showCompass={false} />
                <ScaleControl />
                <FullscreenControl position="top-right" />

                {/* 1. Real Wells (OSM) - Bottom */}
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

                {/* 2. Internal Assets - Middle */}
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

                 {/* 3. Real Pipelines - Top */}
                 {showPipelines && pipelines && (
                     <Source id="pipelines-source" type="geojson" data={pipelines}>
                         <Layer
                             id="pipelines"
                             type="line"
                             paint={{ 'line-color': '#F59E0B', 'line-width': 2, 'line-opacity': 0.8 }}
                         />
                     </Source>
                 )}

                 {/* Heatmap/Carbon Placeholders (Visual Simulation) */}
                 {showHeatmap && (
                     <Source id="heatmap-source" type="geojson" data={{
                         type: 'FeatureCollection', features: [
                             { type: 'Feature', geometry: { type: 'Point', coordinates: [viewState.longitude, viewState.latitude] }, properties: {} }
                         ]
                     }}>
                         <Layer
                            id="heatmap-layer"
                            type="heatmap"
                            paint={{
                                'heatmap-weight': 1,
                                'heatmap-intensity': 1,
                                'heatmap-color': [
                                    'interpolate', ['linear'], ['heatmap-density'],
                                    0, 'rgba(33,102,172,0)',
                                    0.2, 'rgb(103,169,207)',
                                    0.4, 'rgb(209,229,240)',
                                    0.6, 'rgb(253,219,199)',
                                    0.8, 'rgb(239,138,98)',
                                    1, 'rgb(178,24,43)'
                                ],
                                'heatmap-radius': 100,
                                'heatmap-opacity': 0.6
                            }}
                         />
                     </Source>
                 )}

                 {hoverInfo && (
                     <Popup
                         longitude={hoverInfo.longitude}
                         latitude={hoverInfo.latitude}
                         closeButton={false}
                         closeOnClick={false}
                         anchor="bottom"
                         offset={10}
                     >
                         <div className="p-2 bg-surface border border-border rounded shadow-lg min-w-[150px]">
                             <div className="font-bold text-white text-sm mb-1">{hoverInfo.feature.properties.name || 'Unknown Asset'}</div>
                             <div className="text-xs text-muted flex justify-between">
                                 <span>Type:</span>
                                 <span className="text-white">{hoverInfo.feature.properties.type || 'N/A'}</span>
                             </div>
                             <div className="text-xs text-muted flex justify-between">
                                 <span>Status:</span>
                                 <Badge status={hoverInfo.feature.properties.status || 'live'} size="sm" />
                             </div>
                         </div>
                     </Popup>
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
                    {showHeatmap && (
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-red-500 opacity-50"></span>
                            <span className="text-muted">Econ Heatmap</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple Badge for Tooltip
function Badge({ status, size }: { status: string, size?: string }) {
    const color = status === 'live' ? 'text-emerald-400' : status === 'offline' ? 'text-red-400' : 'text-amber-400';
    return <span className={`font-mono uppercase ${color}`}>{status}</span>;
}
