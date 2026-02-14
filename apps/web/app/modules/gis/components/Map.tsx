"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Source, Layer, NavigationControl, ScaleControl, FullscreenControl, MapRef, MapLayerMouseEvent, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GISAsset, Basin } from '@petrosquare/types';
import { Badge } from '@petrosquare/ui';

interface MapProps {
  basins: Basin[];
  assets: GISAsset[];
  selectedAssetId?: string;
  onAssetSelect: (asset: GISAsset) => void;
  center?: [number, number];
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

        const timer = setTimeout(fetchRealData, 1500);
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
        <div className="h-full w-full relative bg-surface overflow-hidden rounded-xl border border-white/5">
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

                {/* 1. Real Wells (OSM) */}
                 {showWells && osmWells && (
                     <Source id="osm-source" type="geojson" data={osmWells}>
                         <Layer
                             id="osm-wells"
                             type="circle"
                             paint={{
                                 'circle-radius': 4,
                                 'circle-color': '#10b981', // Emerald-500
                                 'circle-stroke-width': 1,
                                 'circle-stroke-color': '#064e3b'
                             }}
                         />
                     </Source>
                 )}

                {/* 2. Internal Assets */}
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
                            'circle-color': '#3b82f6', // Blue-500
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#ffffff'
                        }}
                    />
                 </Source>

                 {/* 3. Real Pipelines */}
                 {showPipelines && pipelines && (
                     <Source id="pipelines-source" type="geojson" data={pipelines}>
                         <Layer
                             id="pipelines"
                             type="line"
                             paint={{ 'line-color': '#f59e0b', 'line-width': 2, 'line-opacity': 0.8 }}
                         />
                     </Source>
                 )}

                 {/* Heatmap */}
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
                         <div className="p-3 bg-surface/95 backdrop-blur border border-white/10 rounded-xl shadow-xl min-w-[180px]">
                             <div className="font-bold text-white text-sm mb-2 truncate">{hoverInfo.feature.properties.name || 'Unknown Asset'}</div>
                             <div className="space-y-1">
                                <div className="text-xs text-muted flex justify-between items-center">
                                    <span>Type</span>
                                    <span className="text-white font-mono">{hoverInfo.feature.properties.type || 'N/A'}</span>
                                </div>
                                <div className="text-xs text-muted flex justify-between items-center">
                                    <span>Status</span>
                                    <Badge status={hoverInfo.feature.properties.status || 'live'} />
                                </div>
                             </div>
                         </div>
                     </Popup>
                 )}

             </Map>

             {/* Legend */}
             <div className="absolute bottom-6 right-6 bg-surface/80 backdrop-blur-md p-4 rounded-xl border border-white/5 text-xs z-10 pointer-events-none shadow-lg">
                <div className="font-bold text-white mb-3 uppercase tracking-wider text-[10px]">Map Layers</div>
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white/50 shadow-sm"></span>
                        <span className="text-muted font-medium">Managed Assets</span>
                    </div>
                    {showWells && (
                        <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-900/50 shadow-sm"></span>
                            <span className="text-muted font-medium">OSM Wells</span>
                        </div>
                    )}
                    {showPipelines && (
                        <div className="flex items-center space-x-2">
                            <span className="w-8 h-0.5 bg-amber-500 shadow-sm"></span>
                            <span className="text-muted font-medium">Pipelines</span>
                        </div>
                    )}
                    {showHeatmap && (
                        <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-red-500 opacity-50"></span>
                            <span className="text-muted font-medium">Econ Heatmap</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
