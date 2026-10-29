/**
 * SmartPath - AI-Powered Delivery Route Optimization for Bengaluru
 * Modern Logistics SaaS Dashboard
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ResponseMode,
  Landmark,
  VehicleType,
  RoutingStrategy,
  Waypoint,
  BlockedRoad,
  RouteResult,
  AlgorithmMetrics,
  TrafficForecastData,
  ToastMessage,
} from './types';
import { BENGALURU_LANDMARKS, PRESET_BOTTLENECKS } from './data/bengaluruData';
import {
  getRoute,
  compareAlgorithms,
  getTrafficPrediction,
} from './services/api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MapView } from './components/MapView';
import { RouteSummary } from './components/RouteSummary';
import { SharePanel } from './components/SharePanel';
import { AlgorithmComparisonModal } from './components/AlgorithmComparisonModal';
import { Notification } from './components/Notification';

export default function App() {
  // Navigation & Form State
  const [responseMode, setResponseMode] = useState<ResponseMode>('Ambulance');
  const [source, setSource] = useState<Landmark | null>(null);
  const [destination, setDestination] = useState<Landmark | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [vehicle, setVehicle] = useState<VehicleType>('Ambulance');
  const [strategy, setStrategy] = useState<RoutingStrategy>('Fastest Response');
  const [trafficMultiplier, setTrafficMultiplier] = useState<number>(1.3);
  const [blockedRoads, setBlockedRoads] = useState<BlockedRoad[]>([]);

  // Execution & Display State
  const [isBlockModeActive, setIsBlockModeActive] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);
  const [showAlternativePath, setShowAlternativePath] = useState<boolean>(true);

  // Panels & Modals State
  const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [comparisonMetrics, setComparisonMetrics] = useState<AlgorithmMetrics[]>([]);
  const [isComparisonLoading, setIsComparisonLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);

  // AI Traffic Forecast State
  const [forecast, setForecast] = useState<TrafficForecastData>({
    currentTraffic: 'Moderate',
    predictedTraffic: 'Heavy',
    predictedAvgSpeedKmh: 31,
    forecastHorizon: 'Next day (24h)',
    model: 'DCRNN Traffic Forecasting',
    confidenceScore: 94.6,
    corridorRiskHotspots: [
      'Outer Ring Road (Silk Board to Marathahalli)',
      'Hosur Road Elevated Corridor',
      'Old Airport Road (Domlur Flyover)',
    ],
    lastUpdated: '14:00',
  });

  // Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: ToastMessage['type'], title: string, message: string) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => {
        // Drop exact repeats (React double-invokes effects in dev) and keep the
        // stack short so notifications never bury the map.
        if (prev.some((t) => t.title === title && t.message === message)) return prev;
        return [...prev.slice(-1), { id, type, title, message }];
      });
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Compute Route Logic
  const handleCalculateRoute = useCallback(
    async (
      srcOverride?: Landmark,
      dstOverride?: Landmark,
      wpOverride?: Waypoint[],
      blocksOverride?: BlockedRoad[],
      vehicleOverride?: VehicleType,
      strategyOverride?: RoutingStrategy,
      trafficOverride?: number
    ) => {
      const src = srcOverride || source;
      const dst = dstOverride || destination;
      const wp = wpOverride !== undefined ? wpOverride : waypoints;
      const blocks = blocksOverride !== undefined ? blocksOverride : blockedRoads;
      const veh = vehicleOverride || vehicle;
      const strat = strategyOverride || strategy;
      const mult = trafficOverride !== undefined ? trafficOverride : trafficMultiplier;

      if (!src || !dst) {
        addToast('warning', 'Missing Station/Target', 'Please select both Origin Station and Incident Target.');
        return;
      }

      setIsCalculating(true);
      try {
        const result = await getRoute({
          source: src,
          destination: dst,
          waypoints: wp,
          vehicle: veh,
          strategy: strat,
          trafficMultiplier: mult,
          blockedRoads: blocks,
        });

        setCurrentRoute(result);
        addToast(
          'success',
          'Emergency Route Calculated',
          `${result.totalDistanceKm} km in ${result.estimatedTimeMin} mins (Base: ${result.baseTimeMin}m) via ${result.algorithm}.`
        );
      } catch (err) {
        console.error('Routing computation error:', err);
        addToast('danger', 'Calculation Failed', 'Unable to compute emergency corridor. Please retry.');
      } finally {
        setIsCalculating(false);
      }
    },
    [source, destination, waypoints, vehicle, strategy, trafficMultiplier, blockedRoads, addToast]
  );

  // Live-traffic slider: apply the new value immediately so the UI stays
  // responsive, but re-route only once the operator stops dragging. Without
  // this every slider tick fired a full route calculation.
  const recalcTimerRef = useRef<number | null>(null);

  const handleChangeTrafficMultiplier = useCallback(
    (val: number) => {
      setTrafficMultiplier(val);
      if (!source || !destination) return;
      if (recalcTimerRef.current !== null) window.clearTimeout(recalcTimerRef.current);
      recalcTimerRef.current = window.setTimeout(() => {
        recalcTimerRef.current = null;
        handleCalculateRoute(source, destination, waypoints, blockedRoads, undefined, undefined, val);
      }, 350);
    },
    [source, destination, waypoints, blockedRoads, handleCalculateRoute]
  );

  // Never leave a scheduled re-route behind on unmount.
  useEffect(() => {
    return () => {
      if (recalcTimerRef.current !== null) window.clearTimeout(recalcTimerRef.current);
    };
  }, []);

  // Response Mode Switcher
  const handleSelectResponseMode = (mode: ResponseMode) => {
    setResponseMode(mode);
    let v: VehicleType = 'Ambulance';
    if (mode === 'Ambulance') v = 'Ambulance';
    else if (mode === 'Fire & Rescue') v = 'Fire Engine';
    else if (mode === 'Police') v = 'Police Vehicle';
    else if (mode === 'Disaster Response') v = 'Relief Truck';
    else if (mode === 'Relief Vehicle') v = 'Relief Truck';
    setVehicle(v);

    addToast('info', `${mode} Unit Deployed`, `Routing tuned for ${v} tactical dynamics.`);
    if (source && destination) {
      handleCalculateRoute(source, destination, waypoints, blockedRoads, v);
    }
  };

  // Load Sample Route on Demand
  const handleLoadSampleRoute = useCallback(() => {
    const indiranagar = BENGALURU_LANDMARKS.find((l) => l.id === 'indiranagar') || BENGALURU_LANDMARKS[0];
    const whitefield = BENGALURU_LANDMARKS.find((l) => l.id === 'whitefield') || BENGALURU_LANDMARKS[3];
    const koramangala = BENGALURU_LANDMARKS.find((l) => l.id === 'koramangala') || BENGALURU_LANDMARKS[1];

    const sampleWaypoint: Waypoint = {
      id: `wp_${koramangala.id}`,
      name: koramangala.name,
      lat: koramangala.lat,
      lng: koramangala.lng,
    };

    setSource(indiranagar);
    setDestination(whitefield);
    setWaypoints([sampleWaypoint]);
    setVehicle('Ambulance');
    setResponseMode('Ambulance');
    setStrategy('Fastest Response');
    setTrafficMultiplier(1.3);

    addToast('info', 'Emergency Corridor Loaded', 'Indiranagar Station to Whitefield Trauma Care via Koramangala EMS.');
    handleCalculateRoute(indiranagar, whitefield, [sampleWaypoint], blockedRoads, 'Ambulance', 'Fastest Response');
  }, [blockedRoads, handleCalculateRoute, addToast]);

  // Initial Boot: Preload Sample Route for instant visual experience.
  // The ref guard keeps React StrictMode's double-invoked effect (dev) from
  // routing the sample corridor twice.
  const didBootstrapRef = useRef(false);

  useEffect(() => {
    if (didBootstrapRef.current) return;
    didBootstrapRef.current = true;
    handleLoadSampleRoute();
    // Load AI Traffic Forecast
    getTrafficPrediction().then(setForecast).catch(console.warn);
  }, []);

  // GPS Location Handler
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      addToast('warning', 'GPS Unavailable', 'Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const { latitude, longitude } = pos.coords;

        // Find nearest Bengaluru landmark
        let nearest = BENGALURU_LANDMARKS[0];
        let minDiff = Infinity;
        for (const lm of BENGALURU_LANDMARKS) {
          const diff = Math.hypot(lm.lat - latitude, lm.lng - longitude);
          if (diff < minDiff) {
            minDiff = diff;
            nearest = lm;
          }
        }

        setSource(nearest);
        addToast(
          'success',
          'GPS Location Found',
          `Position matched to nearest hub: ${nearest.name} (${nearest.area}).`
        );
      },
      (err) => {
        setIsGpsLoading(false);
        console.warn('Geolocation error:', err);
        // Fallback default hub
        const mgRoad = BENGALURU_LANDMARKS.find((l) => l.id === 'mg_road') || BENGALURU_LANDMARKS[0];
        setSource(mgRoad);
        addToast(
          'info',
          'Location Defaulted',
          `GPS permission prompt was bypassed. Set source to central ${mgRoad.name}.`
        );
      },
      { timeout: 8000 }
    );
  };

  // Add Waypoint Handler
  const handleAddWaypoint = () => {
    const candidates = BENGALURU_LANDMARKS.filter(
      (l) => l.id !== source?.id && l.id !== destination?.id && !waypoints.some((w) => w.id === `wp_${l.id}`)
    );

    if (candidates.length === 0) {
      addToast('info', 'All Hubs Added', 'No additional landmarks available to add as waypoints.');
      return;
    }

    const nextHub = candidates[Math.floor(Math.random() * candidates.length)];
    const newWp: Waypoint = {
      id: `wp_${nextHub.id}_${Date.now()}`,
      name: nextHub.name,
      lat: nextHub.lat,
      lng: nextHub.lng,
    };

    const updatedWps = [...waypoints, newWp];
    setWaypoints(updatedWps);
    addToast('success', 'Waypoint Added', `Added ${nextHub.name} to route sequence.`);

    if (source && destination) {
      handleCalculateRoute(source, destination, updatedWps, blockedRoads);
    }
  };

  const handleRemoveWaypoint = (id: string) => {
    const updated = waypoints.filter((w) => w.id !== id);
    setWaypoints(updated);
    if (source && destination) {
      handleCalculateRoute(source, destination, updated, blockedRoads);
    }
  };

  // Block Road Simulation Handlers
  const handleToggleBlockMode = () => {
    const nextState = !isBlockModeActive;
    setIsBlockModeActive(nextState);
    if (nextState) {
      addToast('warning', 'Block Road Mode Active', 'Click any point on the map or select a bottleneck below to simulate an obstacle.');
    }
  };

  const handleAddBlockedRoad = (block: BlockedRoad) => {
    const updated = [...blockedRoads, block];
    setBlockedRoads(updated);
    setIsBlockModeActive(false);
    addToast('danger', 'Road Obstacle Registered', `Blocked: ${block.name}. Recalculating detour around blockage...`);

    if (source && destination) {
      handleCalculateRoute(source, destination, waypoints, updated);
    }
  };

  const handleRemoveBlockedRoad = (id: string) => {
    const updated = blockedRoads.filter((b) => b.id !== id);
    setBlockedRoads(updated);
    addToast('info', 'Road Restored', 'Obstacle cleared. Recalculating path...');

    if (source && destination) {
      handleCalculateRoute(source, destination, waypoints, updated);
    }
  };

  // Algorithm Comparison Handler
  const handleOpenAlgorithmComparison = async () => {
    setIsComparisonModalOpen(true);
    setIsComparisonLoading(true);

    const src = source || BENGALURU_LANDMARKS[0];
    const dst = destination || BENGALURU_LANDMARKS[2];

    try {
      const metrics = await compareAlgorithms({
        source: src,
        destination: dst,
        waypoints,
        vehicle,
        strategy,
        trafficMultiplier,
        blockedRoads,
      });
      setComparisonMetrics(metrics);
    } catch (e) {
      console.warn('Algorithm comparison error:', e);
    } finally {
      setIsComparisonLoading(false);
    }
  };

  // Clear All Handler
  const handleClearAll = () => {
    setSource(null);
    setDestination(null);
    setWaypoints([]);
    setBlockedRoads([]);
    setCurrentRoute(null);
    setIsBlockModeActive(false);
    setTrafficMultiplier(1.0);
    setIsSharePanelOpen(false);
    addToast('info', 'System Reset', 'All route inputs, waypoints, and blockages have been cleared.');
  };

  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handler = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#080D18] font-sans antialiased text-[#F8FAFC]">
      {/* Google Maps Platform Demo Quota Defense Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm shrink-0">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        responseMode={responseMode}
        onSelectResponseMode={handleSelectResponseMode}
        onReset={handleLoadSampleRoute}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        activeObstaclesCount={blockedRoads.length}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* Left Control Sidebar */}
        <Sidebar
          source={source}
          destination={destination}
          waypoints={waypoints}
          vehicle={vehicle}
          strategy={strategy}
          trafficMultiplier={trafficMultiplier}
          blockedRoads={blockedRoads}
          isBlockModeActive={isBlockModeActive}
          isCalculating={isCalculating}
          forecast={forecast}
          isGpsLoading={isGpsLoading}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          onSelectSource={(lm) => {
            setSource(lm);
            if (destination) handleCalculateRoute(lm, destination, waypoints, blockedRoads);
          }}
          onSelectDestination={(lm) => {
            setDestination(lm);
            if (source) handleCalculateRoute(source, lm, waypoints, blockedRoads);
          }}
          onSelectVehicle={(v) => {
            setVehicle(v);
            if (v === 'Ambulance') setResponseMode('Ambulance');
            else if (v === 'Fire Engine') setResponseMode('Fire & Rescue');
            else if (v === 'Police Vehicle') setResponseMode('Police');
            else if (v === 'Relief Truck') setResponseMode('Relief Vehicle');
            if (source && destination) handleCalculateRoute(source, destination, waypoints, blockedRoads, v);
          }}
          onSelectStrategy={(s) => {
            setStrategy(s);
            // Pass the new policy explicitly: state has not re-rendered yet, so
            // relying on the closure would re-route with the previous strategy.
            if (source && destination) {
              handleCalculateRoute(source, destination, waypoints, blockedRoads, undefined, s);
            }
          }}
          onChangeTrafficMultiplier={handleChangeTrafficMultiplier}
          onUseGps={handleUseGps}
          onAddWaypoint={handleAddWaypoint}
          onRemoveWaypoint={handleRemoveWaypoint}
          onToggleBlockMode={handleToggleBlockMode}
          onRemoveBlockedRoad={handleRemoveBlockedRoad}
          onLoadSampleRoute={handleLoadSampleRoute}
          onCalculateRoute={() => handleCalculateRoute()}
          onOpenAlgorithmComparison={handleOpenAlgorithmComparison}
          onClearAll={handleClearAll}
        />

        {/* Right Map Canvas & Floating Panels */}
        <section
          aria-label="Bengaluru Interactive Map"
          className="flex-1 relative h-full w-full overflow-hidden flex flex-col"
        >
          <MapView
            source={source}
            destination={destination}
            waypoints={waypoints}
            blockedRoads={blockedRoads}
            primaryPath={currentRoute?.path || []}
            alternativePath={currentRoute?.alternativePath}
            showAlternativePath={showAlternativePath}
            isBlockModeActive={isBlockModeActive}
            quotaExceeded={quotaExceeded}
            onCancelBlockMode={() => setIsBlockModeActive(false)}
            onAddBlockedRoad={handleAddBlockedRoad}
            onRemoveBlockedRoad={handleRemoveBlockedRoad}
          />

          {/* Floating Route Summary Card (Positioned neatly bottom-left over map, non-blocking) */}
          {currentRoute && (
            <div
              id="route-summary-floating-container"
              className="absolute bottom-5 left-4 sm:left-6 z-[450] pointer-events-none w-[88%] max-w-[380px]"
            >
              <div className="pointer-events-auto">
                <RouteSummary
                  route={currentRoute}
                  onOpenShare={() => setIsSharePanelOpen(true)}
                  showAlternativePath={showAlternativePath}
                  onToggleAlternativePath={() => setShowAlternativePath(!showAlternativePath)}
                />
              </div>
            </div>
          )}

          {/* NON-BLOCKING Route Sharing Panel */}
          <SharePanel
            route={currentRoute}
            isOpen={isSharePanelOpen}
            onClose={() => setIsSharePanelOpen(false)}
          />
        </section>
      </main>

      {/* Algorithm Benchmark Comparison Modal */}
      <AlgorithmComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        metrics={comparisonMetrics}
        isLoading={isComparisonLoading}
      />

      {/* Global Notifications System */}
      <Notification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
