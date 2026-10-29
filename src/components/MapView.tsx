import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { Landmark, Waypoint, BlockedRoad } from '../types';
import { BENGALURU_CENTER, PRESET_BOTTLENECKS } from '../data/bengaluruData';
import { Ban, X, Compass, Layers, AlertTriangle, RotateCw } from 'lucide-react';
import { GoogleMapView } from './GoogleMapView';

interface MapViewProps {
  source: Landmark | null;
  destination: Landmark | null;
  waypoints: Waypoint[];
  blockedRoads: BlockedRoad[];
  primaryPath: [number, number][];
  alternativePath?: [number, number][];
  showAlternativePath: boolean;
  isBlockModeActive: boolean;
  quotaExceeded?: boolean;
  onCancelBlockMode: () => void;
  onAddBlockedRoad: (block: BlockedRoad) => void;
  onRemoveBlockedRoad: (id: string) => void;
  onMapClickLocation?: (lat: number, lng: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  source,
  destination,
  waypoints,
  blockedRoads,
  primaryPath,
  alternativePath,
  showAlternativePath,
  isBlockModeActive,
  quotaExceeded = false,
  onCancelBlockMode,
  onAddBlockedRoad,
  onRemoveBlockedRoad,
}) => {
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('google');
  const [mapReady, setMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const [tileError, setTileError] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'dark' | 'dark_voyager'>('dark');

  // Automatic quota defense and failure recovery: fallback to Leaflet Dark
  useEffect(() => {
    if (quotaExceeded) {
      setMapEngine('leaflet');
    }
  }, [quotaExceeded]);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setMapEngine('leaflet');
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // If Google Maps engine is active, render Google Maps Platform component
  if (mapEngine === 'google' && !quotaExceeded) {
    return (
      <GoogleMapView
        source={source}
        destination={destination}
        waypoints={waypoints}
        blockedRoads={blockedRoads}
        primaryPath={primaryPath}
        alternativePath={alternativePath}
        showAlternativePath={showAlternativePath}
        isBlockModeActive={isBlockModeActive}
        onCancelBlockMode={onCancelBlockMode}
        onAddBlockedRoad={onAddBlockedRoad}
        onRemoveBlockedRoad={onRemoveBlockedRoad}
        onSwitchToLeaflet={() => setMapEngine('leaflet')}
      />
    );
  }

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: BENGALURU_CENTER,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Dark Matter tiles for authentic emergency operations center
      const tileUrl =
        activeLayer === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      });

      tiles.on('tileerror', () => {
        setTileError(true);
      });

      tiles.addTo(map);

      // Add zoom control in top right with dark styling
      L.control.zoom({ position: 'topright' }).addTo(map);

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
      setMapReady(true);

      // Handle map resize observer
      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        setMapReady(false);
        resizeObserver.disconnect();
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (err) {
      console.warn('Map initialization error:', err);
      setTileError(true);
    }
  }, []);

  // Update map click handler for Block Road mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isBlockModeActive) {
        const id = `custom_block_${Date.now()}`;
        const newBlock: BlockedRoad = {
          id,
          name: `Roadblock Sector (${e.latlng.lat.toFixed(3)}, ${e.latlng.lng.toFixed(3)})`,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          radiusMeters: 300,
          reason: 'Emergency incident & road blockage',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onAddBlockedRoad(newBlock);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isBlockModeActive, onAddBlockedRoad]);

  // Redraw layers (Markers, Polylines, Blockages) whenever state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Helper for custom HTML markers
    const createHtmlIcon = (html: string, className = '', size: [number, number] = [32, 32]) => {
      return L.divIcon({
        html,
        className: `custom-div-icon ${className}`,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1] / 2],
      });
    };

    // 1. Alternative Polyline (Muted tactical gray-blue)
    if (showAlternativePath && alternativePath && alternativePath.length > 1) {
      const altLine = L.polyline(alternativePath, {
        color: '#94A3B8',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.65,
        lineCap: 'round',
        lineJoin: 'round',
      });
      altLine.bindPopup(`
        <div style="font-family:sans-serif;padding:6px;background:#172033;color:#F8FAFC;border-radius:8px;">
          <div style="font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;">Alternative Route</div>
          <strong style="font-size:12px;color:#F8FAFC;">Secondary Arterial Bypass</strong>
        </div>
      `);
      group.addLayer(altLine);
    }

    // 2. Primary Route Polyline (Emergency Route Blue with vibrant tactical neon glow)
    if (primaryPath.length > 1) {
      // Tactical Glow underlayer
      const glowLine = L.polyline(primaryPath, {
        color: '#2563EB',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      });
      group.addLayer(glowLine);

      // Core Line: High contrast #60A5FA / #38BDF8
      const mainLine = L.polyline(primaryPath, {
        color: '#60A5FA',
        weight: 4.5,
        opacity: 0.98,
        lineCap: 'round',
        lineJoin: 'round',
      });
      mainLine.bindPopup(
        `<div style="font-family:sans-serif;padding:6px;background:#172033;color:#F8FAFC;border-radius:8px;">
          <div style="font-size:10px;font-weight:700;color:#38BDF8;text-transform:uppercase;">Primary Emergency Route</div>
          <strong style="font-size:13px;color:#F8FAFC;">Priority Response Corridor</strong>
          <div style="font-size:11px;color:#94A3B8;margin-top:2px;">Calculated via Hybrid A* + DFS Engine</div>
        </div>`
      );
      group.addLayer(mainLine);

      // Fit map bounds to route
      const bounds = L.latLngBounds(primaryPath);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }

    // 3. Source Marker (Station / Depot)
    if (source) {
      const srcIcon = createHtmlIcon(`
        <div style="background-color:#080D18;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 14px rgba(56,189,248,0.6);border:2.5px solid #38BDF8;">
          <div style="background-color:#38BDF8;width:12px;height:12px;border-radius:50%;"></div>
        </div>
      `, '', [34, 34]);

      const marker = L.marker([source.lat, source.lng], { icon: srcIcon });
      marker.bindPopup(`
        <div style="font-family:sans-serif;padding:6px;background:#172033;color:#F8FAFC;border-radius:8px;">
          <div style="font-size:10px;font-weight:700;color:#38BDF8;text-transform:uppercase;">Dispatch Origin</div>
          <strong style="font-size:13px;color:#F8FAFC;">${source.name}</strong>
          <div style="font-size:11px;color:#94A3B8;margin-top:2px;">${source.stationType || source.area}</div>
        </div>
      `);
      group.addLayer(marker);
    }

    // 4. Destination Marker (Emergency Incident Site / Trauma Receiver)
    if (destination) {
      const dstIcon = createHtmlIcon(`
        <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:36px;height:36px;border-radius:50%;background-color:#EF4444;opacity:0.35;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:relative;background-color:#EF4444;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(239,68,68,0.8);border:2.5px solid #FFFFFF;">
            <div style="background-color:#FFFFFF;width:8px;height:8px;border-radius:50%;"></div>
          </div>
        </div>
      `, '', [36, 36]);

      const marker = L.marker([destination.lat, destination.lng], { icon: dstIcon });
      marker.bindPopup(`
        <div style="font-family:sans-serif;padding:6px;background:#172033;color:#F8FAFC;border-radius:8px;">
          <div style="font-size:10px;font-weight:700;color:#EF4444;text-transform:uppercase;">Emergency Target / Receiver</div>
          <strong style="font-size:13px;color:#F8FAFC;">${destination.name}</strong>
          <div style="font-size:11px;color:#94A3B8;margin-top:2px;">${destination.stationType || destination.area}</div>
        </div>
      `);
      group.addLayer(marker);
    }

    // 5. Waypoints (Intermediate Checkpoints)
    waypoints.forEach((wp, index) => {
      const wpIcon = createHtmlIcon(`
        <div style="background-color:#F59E0B;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(245,158,11,0.6);border:2px solid #080D18;color:#080D18;font-size:11px;font-weight:800;">
          ${index + 1}
        </div>
      `, '', [26, 26]);

      const marker = L.marker([wp.lat, wp.lng], { icon: wpIcon });
      marker.bindPopup(`
        <div style="font-family:sans-serif;padding:6px;background:#172033;color:#F8FAFC;border-radius:8px;">
          <div style="font-size:10px;font-weight:700;color:#F59E0B;text-transform:uppercase;">Checkpoint ${index + 1}</div>
          <strong style="font-size:12px;color:#F8FAFC;">${wp.name}</strong>
        </div>
      `);
      group.addLayer(marker);
    });

    // 6. Blocked Roads (Active Hazard Circles & Warning Markers)
    blockedRoads.forEach((block) => {
      // Pulsing hazard zone
      const circle = L.circle([block.lat, block.lng], {
        radius: block.radiusMeters,
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 0.28,
        weight: 2,
        dashArray: '4, 4',
      });
      group.addLayer(circle);

      // Warning Barrier Icon
      const blockIcon = createHtmlIcon(`
        <div style="background-color:#EF4444;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(239,68,68,0.7);border:2px solid #F8FAFC;color:#F8FAFC;">
          <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke-width="2"/>
          </svg>
        </div>
      `, '', [28, 28]);

      const marker = L.marker([block.lat, block.lng], { icon: blockIcon });

      // Interactive dark popup element with clear button
      const popupDiv = document.createElement('div');
      popupDiv.style.padding = '6px';
      popupDiv.style.fontFamily = 'sans-serif';
      popupDiv.style.backgroundColor = '#172033';
      popupDiv.style.color = '#F8FAFC';
      popupDiv.style.borderRadius = '8px';
      popupDiv.innerHTML = `
        <div style="font-size:10px;font-weight:700;color:#EF4444;text-transform:uppercase;">Road Hazard / Closure</div>
        <div style="font-size:12px;font-weight:600;color:#F8FAFC;margin-top:2px;">${block.name}</div>
        <div style="font-size:11px;color:#94A3B8;margin-top:2px;">${block.reason}</div>
        <button id="unblock-${block.id}" style="margin-top:8px;background:#EF4444;border:none;color:#ffffff;padding:5px 8px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;width:100%;letter-spacing:0.5px;">
          CLEAR ROADBLOCK & RE-ROUTE
        </button>
      `;

      popupDiv.querySelector(`#unblock-${block.id}`)?.addEventListener('click', () => {
        onRemoveBlockedRoad(block.id);
        map.closePopup();
      });

      marker.bindPopup(popupDiv);
      group.addLayer(marker);
    });
  }, [
    mapReady,
    source,
    destination,
    waypoints,
    blockedRoads,
    primaryPath,
    alternativePath,
    showAlternativePath,
    onRemoveBlockedRoad,
  ]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(BENGALURU_CENTER, 12, { animate: true });
    }
  };

  const handleToggleLayer = () => {
    const next = activeLayer === 'dark' ? 'dark_voyager' : 'dark';
    setActiveLayer(next);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });
      const tileUrl =
        next === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      L.tileLayer(tileUrl, { maxZoom: 19, subdomains: 'abcd' }).addTo(mapInstanceRef.current);
    }
  };

  return (
    <div id="map-section" className="relative w-full h-full min-h-[420px] overflow-hidden bg-[#080D18]">
      {/* Real Dark Map Container */}
      <div
        ref={mapContainerRef}
        id="leaflet-map-container"
        className={`w-full h-full z-10 ${isBlockModeActive ? 'cursor-crosshair' : 'cursor-grab'}`}
      />

      {/* Fallback Vector Overlay if tiles fail */}
      {tileError && (
        <div
          id="map-fallback-overlay"
          className="absolute inset-0 z-0 bg-[#080D18] flex flex-col items-center justify-center pointer-events-none p-6"
        >
          <div className="max-w-md w-full bg-[#111827] border border-[#263247] p-5 rounded-xl shadow-2xl text-center pointer-events-auto">
            <AlertTriangle className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#F8FAFC]">Tactical Map Rendering Notice</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              SmartPath spatial navigation engine continues active routing and obstacle avoidance.
            </p>
            <button
              onClick={() => setTileError(false)}
              className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-md transition-colors"
            >
              Retry Satellite Tiles
            </button>
          </div>
        </div>
      )}

      {/* Block Road Mode Banner */}
      {isBlockModeActive && (
        <div
          id="block-road-active-banner"
          className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] max-w-lg w-[90%] bg-[#111827]/95 backdrop-blur-md border border-[#EF4444] p-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#EF4444]">
            <Ban className="w-4 h-4 shrink-0 animate-pulse" />
            <span>Click any road on the map to place an emergency blockage</span>
          </div>

          <button
            id="cancel-block-mode-btn"
            onClick={onCancelBlockMode}
            className="px-2.5 py-1 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] bg-[#172033] hover:bg-[#263247] rounded-md border border-[#263247] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Quick Map Controls (Floating Top-Right below Leaflet Zoom) */}
      <div
        id="map-floating-controls"
        className="absolute top-20 right-3 z-[400] flex flex-col gap-2 pointer-events-auto"
      >
        <button
          id="recenter-bengaluru-btn"
          onClick={handleRecenter}
          className="w-8 h-8 bg-[#111827] hover:bg-[#172033] text-[#F8FAFC] border border-[#263247] hover:border-[#38BDF8] rounded-lg shadow-md flex items-center justify-center transition-colors cursor-pointer"
          title="Recenter Bengaluru Command"
          aria-label="Recenter Map on Bengaluru"
        >
          <Compass className="w-4 h-4 text-[#38BDF8]" />
        </button>

        <button
          id="toggle-map-layer-btn"
          onClick={handleToggleLayer}
          className="w-8 h-8 bg-[#111827] hover:bg-[#172033] text-[#F8FAFC] border border-[#263247] hover:border-[#38BDF8] rounded-lg shadow-md flex items-center justify-center transition-colors cursor-pointer"
          title={`Switch map layer (${activeLayer === 'dark' ? 'Voyager' : 'Dark Matter'})`}
          aria-label="Toggle map visual layer"
        >
          <Layers className="w-4 h-4 text-[#94A3B8]" />
        </button>

        <button
          id="switch-to-google-maps-btn"
          onClick={() => setMapEngine('google')}
          className="w-8 h-8 bg-[#111827] hover:bg-[#172033] text-[#38BDF8] border border-[#38BDF8]/40 hover:border-[#38BDF8] rounded-lg shadow-md flex items-center justify-center transition-colors cursor-pointer"
          title="Switch to Google Maps Platform"
          aria-label="Switch to Google Maps Platform"
        >
          <RotateCw className="w-4 h-4 text-[#38BDF8]" />
        </button>
      </div>

      {/* Incident Tactical Legend (Floating Bottom-Left) */}
      <div
        id="incident-map-legend"
        className="hidden md:flex absolute bottom-4 left-4 z-[300] bg-[#111827]/90 backdrop-blur-md border border-[#263247] p-2.5 rounded-lg text-[11px] text-[#94A3B8] space-y-1.5 shadow-xl select-none"
      >
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5 pb-1 border-b border-[#263247]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
          <span>Incident Legend</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-[#60A5FA] rounded-full shadow-xs shadow-blue-400" />
          <span className="text-[#F8FAFC]">Recommended Corridor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 border-b-2 border-dashed border-[#94A3B8]" />
          <span>Alternative Bypass</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#EF4444]/40" />
          <span>Active Road Hazard</span>
        </div>
      </div>

      {/* Quick Obstacle Presets (Bottom Bar on Map when in Block Mode) */}
      {isBlockModeActive && (
        <div
          id="preset-bottlenecks-selector"
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
