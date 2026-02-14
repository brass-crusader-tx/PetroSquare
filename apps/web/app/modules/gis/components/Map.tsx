"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Source, Layer, NavigationControl, ScaleControl, FullscreenControl, MapRef, MapLayerMouseEvent, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GISAsset, Basin } from '@petrosquare/types';
import { GISLayer } from '@/lib/gis/types';

interface MapProps {
  basins: Basin[];
  activeLayers: GISLayer[];
  selectedAssetId?: string;
  onAssetSelect: (asset: GISAsset) => void;
  center?: [number, number]; // [lat, lng]
  zoom?: number;
}

export default function GISMap({
    basins, activeLayers, selectedAssetId, onAssetSelect, center, zoom
}: MapProps) {
    const mapRef = useRef<MapRef>(null);
    const [viewState, setViewState] = useState({
        longitude: center ? center[1] : -100,
        latitude: center ? center[0] : 40,
        zoom: zoom || 4
    });

    // Store features per layer: { layerId: FeatureCollection }
    const [layerData, setLayerData] = useState<Record<string, any>>({});
    const [hoverInfo, setHoverInfo] = useState<{longitude: number, latitude: number, feature: any} | null>(null);

    // Initial FlyTo
    useEffect(() => {
        if (center) {
            mapRef.current?.flyTo({ center: [center[1], center[0]], zoom: zoom || 6 });
        }
    }, [center, zoom]);

    // Fetch Data on Move (Debounced)
    useEffect(() => {
        const fetchData = async () => {
             if (!mapRef.current) return;
             const bounds = mapRef.current.getBounds();
             if (!bounds) return;

             const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
             const currentZoom = mapRef.current.getZoom();

             const newLayerData: Record<string, any> = {};

             // Fetch for each active layer
             await Promise.all(activeLayers.map(async (layer) => {
                 try {
                     // TODO: Add caching here if needed, but browser fetch cache might handle it if headers are set
                     // Or use SWR. For now simple fetch.
                     const res = await fetch(`/api/gis/layers/${layer.id}/features?bbox=${bbox}&zoom=${Math.floor(currentZoom)}`);
                     if (res.ok) {
                         const json = await res.json();
                         newLayerData[layer.id] = {
                             type: 'FeatureCollection',
                             features: json.data || []
                         };
                     }
                 } catch (e) {
                     console.error(`Failed to fetch layer ${layer.id}`, e);
                 }
             }));

             setLayerData(prev => ({ ...prev, ...newLayerData }));
        };

        const timer = setTimeout(fetchData, 800); // 800ms debounce
        return () => clearTimeout(timer);
    }, [viewState, activeLayers]);

    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const mapStyle = MAPTILER_KEY
        ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`
        : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

    const onClick = useCallback((event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        if (feature) {
             const props = feature.properties || {};

             // If cluster, zoom in
             if (props.cluster) {
                 const clusterId = props.cluster_id;
                 const point_count = props.point_count;
                 const coordinates = (feature.geometry as any).coordinates;

                 mapRef.current?.flyTo({
                     center: coordinates,
                     zoom: viewState.zoom + 2
                 });
                 return;
             }

             // Normalize to GISAsset for DetailDrawer
             // If props don't match GISAsset exactly, we map best effort
             const asset: GISAsset = {
                 id: props.id || String(Math.random()),
                 name: props.name || 'Unknown Asset',
                 type: (props.type as any) || 'ASSET',
                 status: (props.status as any) || 'UNKNOWN',
                 latitude: event.lngLat.lat,
                 longitude: event.lngLat.lng,
                 geometry: feature.geometry as any,
                 operator_id: props.operator_id || 'Unknown',
                 basin_id: props.basin_id || 'unknown',
                 jurisdiction_id: props.jurisdiction_id || 'unknown',
                 metadata: props
             };
             onAssetSelect(asset);
        }
    }, [onAssetSelect, viewState.zoom]);

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
                // Interactive layer IDs needed for hover/click
                interactiveLayerIds={activeLayers.flatMap(l => {
                    if (l.type === 'POINT') return [l.id, `${l.id}-clusters`];
                    return [l.id];
                })}
             >
                <NavigationControl position="top-right" showCompass={false} />
                <ScaleControl />
                <FullscreenControl position="top-right" />

                {activeLayers.map(layer => {
                    const data = layerData[layer.id];
                    if (!data) return null;

                    return (
                        <Source key={layer.id} id={layer.id} type="geojson" data={data}>
                            {/* Render based on Layer Type */}
                            {layer.type === 'POINT' && (
                                <>
                                    {/* Non-clustered points */}
                                    <Layer
                                        id={layer.id}
                                        type="circle"
                                        filter={['!', ['has', 'point_count']]}
                                        paint={layer.style_json || {
                                            'circle-radius': 6,
                                            'circle-color': '#3B82F6',
                                            'circle-stroke-width': 1,
                                            'circle-stroke-color': '#fff'
                                        }}
                                    />
                                    {/* Clusters */}
                                    <Layer
                                        id={`${layer.id}-clusters`}
                                        type="circle"
                                        filter={['has', 'point_count']}
                                        paint={{
                                            'circle-color': '#51bbd6',
                                            'circle-radius': [
                                                'step', ['get', 'point_count'],
                                                15, 10,
                                                20, 50,
                                                25
                                            ]
                                        }}
                                    />
                                    <Layer
                                        id={`${layer.id}-cluster-count`}
                                        type="symbol"
                                        filter={['has', 'point_count']}
                                        layout={{
                                            'text-field': '{point_count_abbreviated}',
                                            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                                            'text-size': 12
                                        }}
                                        paint={{ 'text-color': '#ffffff' }}
                                    />
                                </>
                            )}
                            {layer.type === 'LINE' && (
                                <Layer
                                    id={layer.id}
                                    type="line"
                                    paint={layer.style_json || {
                                        'line-color': '#F59E0B',
                                        'line-width': 2
                                    }}
                                />
                            )}
                            {layer.type === 'POLYGON' && (
                                <Layer
                                    id={layer.id}
                                    type="fill"
                                    paint={layer.style_json || {
                                        'fill-color': '#10B981',
                                        'fill-opacity': 0.4
                                    }}
                                />
                            )}
                        </Source>
                    );
                })}

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
                             {hoverInfo.feature.properties.cluster ? (
                                 <div className="font-bold text-white text-sm">Cluster ({hoverInfo.feature.properties.point_count} points)</div>
                             ) : (
                                 <>
                                    <div className="font-bold text-white text-sm mb-1">{hoverInfo.feature.properties.name || 'Unknown Asset'}</div>
                                    <div className="text-xs text-muted flex justify-between">
                                        <span>Type:</span>
                                        <span className="text-white">{hoverInfo.feature.properties.type || 'N/A'}</span>
                                    </div>
                                    <div className="text-xs text-muted flex justify-between">
                                        <span>Status:</span>
                                        <Badge status={hoverInfo.feature.properties.status || 'live'} size="sm" />
                                    </div>
                                 </>
                             )}
                         </div>
                     </Popup>
                 )}

             </Map>

             {/* Dynamic Legend */}
             <div className="absolute bottom-6 right-6 bg-surface/90 backdrop-blur p-3 rounded border border-border text-xs z-10 pointer-events-none">
                <div className="font-bold text-white mb-2">Visible Layers</div>
                <div className="flex flex-col space-y-2">
                    {activeLayers.map(l => (
                        <div key={l.id} className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getLayerColor(l) }}></span>
                            <span className="text-muted">{l.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helper to extract color from style_json for legend
function getLayerColor(layer: GISLayer): string {
    if (layer.style_json) {
        if (layer.style_json['circle-color']) return layer.style_json['circle-color'];
        if (layer.style_json['line-color']) return layer.style_json['line-color'];
        if (layer.style_json['fill-color']) return layer.style_json['fill-color'];
    }
    return '#ccc';
}

function Badge({ status, size }: { status: string, size?: string }) {
    const color = status === 'live' ? 'text-emerald-400' : status === 'offline' ? 'text-red-400' : 'text-amber-400';
    return <span className={`font-mono uppercase ${color}`}>{status}</span>;
}
