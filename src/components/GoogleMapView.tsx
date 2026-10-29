import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { Landmark, Waypoint, BlockedRoad } from '../types';
import { BENGALURU_CENTER, PRESET_BOTTLENECKS } from '../data/bengaluruData';
import {
  Ban,
  X,
  Compass,
  Layers,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Flag,
  RotateCw,
  Navigation,
} from 'lucide-react';

interface GoogleMapViewProps {
  source: Landmark | null;
  destination: Landmark | null;
  waypoints: Waypoint[];
  blockedRoads: BlockedRoad[];
  primaryPath: [number, number][];
  alternativePath?: [number, number][];
  showAlternativePath: boolean;
  isBlockModeActive: boolean;
  onCancelBlockMode: () => void;
  onAddBlockedRoad: (block: BlockedRoad) => void;
  onRemoveBlockedRoad: (id: string) => void;
  onSwitchToLeaflet?: () => void;
}

// Tactical Dark Emergency Map Styling
const TACTICAL_DARK_STYLES: any[] = [
  { elementType: 'geometry', stylers: [{ color: '#080D18' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#080D18' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#F8FAFC' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748B' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#0B1A24' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#172033' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#263247' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#CBD5E1' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#1E293B' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#0F172A' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0A1326' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38BDF8' }],
  },
];

/**
 * Helper component to render Google Maps Polylines & auto-fit bounds
 */
const RoutePolylines: React.FC<{
  primaryPath: [number, number][];
  alternativePath?: [number, number][];
  showAlternativePath: boolean;
}> = ({ primaryPath, alternativePath, showAlternativePath }) => {
  const map = useMap();
  const primaryLineRef = useRef<any>(null);
  const glowLineRef = useRef<any>(null);
  const altLineRef = useRef<any>(null);

  // Render Primary Route
  useEffect(() => {
    const gMaps = typeof window !== 'undefined' ? (window as any).google?.maps : null;
    if (!map || !gMaps) return;

    // Clean up previous lines
    glowLineRef.current?.setMap(null);
    primaryLineRef.current?.setMap(null);

    if (primaryPath.length > 1) {
      const gPath = primaryPath.map(([lat, lng]) => ({ lat, lng }));

      // Tactical Glow Underlayer
      const glow = new gMaps.Polyline({
        path: gPath,
        geodesic: true,
        strokeColor: '#2563EB',
        strokeOpacity: 0.4,
        strokeWeight: 9,
        clickable: false,
        map,
      });
      glowLineRef.current = glow;

      // Primary High-Visibility Line
      const line = new gMaps.Polyline({
        path: gPath,
        geodesic: true,
        strokeColor: '#38BDF8',
        strokeOpacity: 0.95,
        strokeWeight: 4.5,
        clickable: false,
        map,
      });
      primaryLineRef.current = line;

      // Auto-fit bounds
      const bounds = new gMaps.LatLngBounds();
      gPath.forEach((pt: any) => bounds.extend(pt));
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 120, left: 60 });
    }

    return () => {
      glowLineRef.current?.setMap(null);
      primaryLineRef.current?.setMap(null);
    };
  }, [map, primaryPath]);

  // Render Alternative Route
  useEffect(() => {
    const gMaps = typeof window !== 'undefined' ? (window as any).google?.maps : null;
    if (!map || !gMaps) return;

    altLineRef.current?.setMap(null);

    if (showAlternativePath && alternativePath && alternativePath.length > 1) {
      const altGPath = alternativePath.map(([lat, lng]) => ({ lat, lng }));

      const altLine = new gMaps.Polyline({
        path: altGPath,
        geodesic: true,
        strokeColor: '#F59E0B',
        strokeOpacity: 0.8,
        strokeWeight: 3.5,
        clickable: false,
        map,
      });
      altLineRef.current = altLine;
    }

    return () => {
      altLineRef.current?.setMap(null);
    };
  }, [map, alternativePath, showAlternativePath]);

  return null;
};

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  source,
  destination,
  waypoints,
  blockedRoads,
  primaryPath,
  alternativePath,
  showAlternativePath,
  isBlockModeActive,
  onCancelBlockMode,
  onAddBlockedRoad,
  onRemoveBlockedRoad,
  onSwitchToLeaflet,
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const [mapTypeId, setMapTypeId] = useState<'tactical' | 'roadmap' | 'hybrid'>('tactical');
  const [selectedBlockedRoad, setSelectedBlockedRoad] = useState<BlockedRoad | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);

  useEffect(() => {
    const handleQuota = () => {
      onSwitchToLeaflet?.();
    };
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, [onSwitchToLeaflet]);

  const handleMapClick = useCallback(
    (e: MapMouseEvent | any) => {
      if (!isBlockModeActive) return;

      const rawLatLng = e.detail?.latLng || e.latLng;
      if (!rawLatLng) return;

      const lat = typeof rawLatLng.lat === 'function' ? rawLatLng.lat() : rawLatLng.lat;
      const lng = typeof rawLatLng.lng === 'function' ? rawLatLng.lng() : rawLatLng.lng;

      if (typeof lat === 'number' && typeof lng === 'number') {
        const newBlock: BlockedRoad = {
          id: `custom_block_${Date.now()}`,
          name: `Roadblock Sector (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
          lat,
          lng,
          radiusMeters: 350,
          reason: 'Emergency obstacle & dynamic hazard',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onAddBlockedRoad(newBlock);
      }
    },
    [isBlockModeActive, onAddBlockedRoad]
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#080D18]">
      <APIProvider
        apiKey={apiKey}
        onError={(err) => {
          console.warn('Google Maps API failed, fallback to Leaflet:', err);
          onSwitchToLeaflet?.();
        }}
      >
        <Map
          id="smartpath-google-map"
          mapId="DEMO_MAP_ID"
          style={{ width: '100%', height: '100%' }}
          defaultCenter={{ lat: BENGALURU_CENTER[0], lng: BENGALURU_CENTER[1] }}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          mapTypeId={mapTypeId === 'tactical' ? 'roadmap' : mapTypeId}
          options={{
            styles: mapTypeId === 'tactical' ? TACTICAL_DARK_STYLES : undefined,
            backgroundColor: '#080D18',
          }}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          onClick={handleMapClick}
        >
          {/* Polylines for Primary & Secondary Routes */}
          <RoutePolylines
            primaryPath={primaryPath}
            alternativePath={alternativePath}
            showAlternativePath={showAlternativePath}
          />

          {/* Source Marker */}
          {source && (
            <AdvancedMarker
              position={{ lat: source.lat, lng: source.lng }}
              title={source.name}
              onClick={() => setSelectedLandmark(source)}
            >
              <div className="relative group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#080D18] border-2 border-[#38BDF8] flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.7)] animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-[#38BDF8]" />
                </div>
                <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#172033]/90 text-[10px] font-bold text-[#38BDF8] px-2 py-0.5 rounded border border-[#263247] shadow-md pointer-events-none">
                  {source.name.split(' ')[0]} (ORIGIN)
                </div>
              </div>
            </AdvancedMarker>
          )}

          {/* Destination Marker */}
          {destination && (
            <AdvancedMarker
              position={{ lat: destination.lat, lng: destination.lng }}
              title={destination.name}
              onClick={() => setSelectedLandmark(destination)}
            >
              <div className="relative group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#080D18] border-2 border-[#EF4444] flex items-center justify-center shadow-[0_0_14px_rgba(239,68,68,0.8)]">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444] animate-ping opacity-75 absolute" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444]" />
                </div>
                <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#172033]/90 text-[10px] font-bold text-[#EF4444] px-2 py-0.5 rounded border border-[#263247] shadow-md pointer-events-none">
                  {destination.name.split(' ')[0]} (TARGET)
                </div>
              </div>
            </AdvancedMarker>
          )}

          {/* Waypoint Markers */}
          {waypoints.map((wp, idx) => (
            <AdvancedMarker key={wp.id} position={{ lat: wp.lat, lng: wp.lng }} title={wp.name}>
              <div className="relative group cursor-pointer">
                <div className="w-6 h-6 rounded-md bg-[#172033] border-2 border-[#A855F7] rotate-45 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  <span className="-rotate-45 text-[9px] font-bold text-[#C084FC]">{idx + 1}</span>
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#172033]/90 text-[9px] font-medium text-[#C084FC] px-1.5 py-0.5 rounded border border-[#263247] shadow-md pointer-events-none">
                  Checkpoint {idx + 1}
                </div>
              </div>
            </AdvancedMarker>
          ))}

          {/* Blocked Road / Hazard Markers */}
          {blockedRoads.map((blk) => (
            <AdvancedMarker
              key={blk.id}
              position={{ lat: blk.lat, lng: blk.lng }}
              title={blk.name}
              onClick={() => setSelectedBlockedRoad(blk)}
            >
              <div className="relative group cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#EF4444]/25 border-2 border-[#EF4444] flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-bounce">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                </div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#172033]/95 text-[9px] font-bold text-[#EF4444] px-2 py-0.5 rounded border border-[#EF4444]/40 shadow-lg pointer-events-none">
                  ROAD BLOCK
                </div>
              </div>
            </AdvancedMarker>
          ))}

          {/* Info Window for Selected Blocked Road */}
          {selectedBlockedRoad && (
            <InfoWindow
              position={{ lat: selectedBlockedRoad.lat, lng: selectedBlockedRoad.lng }}
              onCloseClick={() => setSelectedBlockedRoad(null)}
            >
              <div className="p-2 text-xs font-sans text-[#F8FAFC] bg-[#111827] rounded-md max-w-xs">
                <div className="flex items-center gap-1.5 text-[#EF4444] font-bold text-[11px] mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Active Road Blockage</span>
                </div>
                <p className="font-semibold text-white mb-1">{selectedBlockedRoad.name}</p>
                <p className="text-[10px] text-[#94A3B8] mb-2">{selectedBlockedRoad.reason}</p>
                <button
                  onClick={() => {
                    onRemoveBlockedRoad(selectedBlockedRoad.id);
                    setSelectedBlockedRoad(null);
                  }}
                  className="w-full py-1 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Clear Obstacle
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating Tactical Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Map Style Selector */}
        <div className="bg-[#111827]/90 backdrop-blur-md rounded-lg border border-[#263247] p-1 shadow-lg flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setMapTypeId('tactical')}
            className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
              mapTypeId === 'tactical'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Tactical
          </button>
          <button
            onClick={() => setMapTypeId('roadmap')}
            className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
              mapTypeId === 'roadmap'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Roads
          </button>
          <button
            onClick={() => setMapTypeId('hybrid')}
            className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
              mapTypeId === 'hybrid'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Engine Switcher (Google Maps / Leaflet) */}
        {onSwitchToLeaflet && (
          <button
            onClick={onSwitchToLeaflet}
            title="Switch to CartoDB Dark Matter map engine"
            className="bg-[#111827]/90 backdrop-blur-md hover:bg-[#172033] text-[#94A3B8] hover:text-[#38BDF8] rounded-lg border border-[#263247] px-2.5 py-1.5 shadow-lg text-[10px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3 h-3 text-[#38BDF8]" />
            <span>Leaflet Dark</span>
          </button>
        )}
      </div>

      {/* Live Google Maps Platform Operational Indicator (subtle) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none hidden lg:block">
        <div className="bg-[#0B111E]/80 backdrop-blur-md rounded-md border border-[#263247] px-2 py-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <span className="text-[10px] font-medium text-[#94A3B8] tracking-wide">
            Google Maps Platform
          </span>
        </div>
      </div>

      {/* Block Road Mode Banner */}
      {isBlockModeActive && (
        <div
          id="gmap-block-road-banner"
          className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] max-w-lg w-[90%] bg-[#111827]/95 backdrop-blur-md border-2 border-[#EF4444] p-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#EF4444]">
            <Ban className="w-4 h-4 shrink-0 animate-pulse" />
            <span>Click ANYWHERE on the map to drop an emergency roadblock</span>
          </div>

          <button
            id="cancel-gmap-block-mode-btn"
            onClick={onCancelBlockMode}
            className="px-2.5 py-1 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] bg-[#172033] hover:bg-[#263247] rounded-md border border-[#263247] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Tactical Map Legend */}
      {!isBlockModeActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3 bg-[#111827]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#263247] shadow-xl text-[11px] text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] ring-2 ring-[#38BDF8]/40" />
            <span>Origin Base</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#EF4444]/40" />
            <span>Incident Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#38BDF8] rounded-full" />
            <span>Priority Corridor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#EF4444]/40" />
            <span>Road Hazard</span>
          </div>
        </div>
      )}

      {/* Quick Obstacle Presets (Bottom Bar on Map when in Block Mode) */}
      {isBlockModeActive && (
        <div
          id="preset-bottlenecks-selector-gmap"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-[#111827]/95 backdrop-blur-md border border-[#263247] p-2.5 rounded-xl shadow-2xl flex flex-wrap items-center gap-2 max-w-xl w-[92%]"
        >
          <span className="text-[11px] font-bold text-[#F8FAFC] whitespace-nowrap">
            Preset Roadblocks:
          </span>
          {PRESET_BOTTLENECKS.map((preset) => {
            const isAlreadyBlocked = blockedRoads.some((b) => b.id === preset.id);
            return (
              <button
                key={preset.id}
                id={`block-preset-${preset.id}`}
                disabled={isAlreadyBlocked}
                onClick={() => {
                  onAddBlockedRoad({
                    ...preset,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  });
                }}
                className={`text-[11px] px-2.5 py-1 rounded-md border font-semibold transition-all cursor-pointer ${
                  isAlreadyBlocked
                    ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40 opacity-60 cursor-not-allowed'
                    : 'bg-[#172033] text-[#F8FAFC] border-[#263247] hover:bg-[#EF4444]/20 hover:text-[#EF4444] hover:border-[#EF4444]/50'
                }`}
              >
                {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
