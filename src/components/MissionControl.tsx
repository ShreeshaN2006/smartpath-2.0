import React from 'react';
import {
  Navigation,
  Sparkles,
  Layers,
  RotateCcw,
  Cpu,
  Radio,
  Share2,
} from 'lucide-react';
import {
  Landmark,
  VehicleType,
  RoutingStrategy,
  Waypoint,
  BlockedRoad,
  TrafficForecastData,
} from '../types';
import { ResponseUnitSelector } from './ResponseUnitSelector';
import { RouteTargetControls } from './RouteTargetControls';
import { RoutingPrioritySelector } from './RoutingPrioritySelector';
import { LiveConditions } from './LiveConditions';
import { TrafficForecastCard } from './TrafficForecastCard';

interface MissionControlProps {
  source: Landmark | null;
  destination: Landmark | null;
  waypoints: Waypoint[];
  blockedRoads: BlockedRoad[];
  selectedVehicle: VehicleType;
  strategy: RoutingStrategy;
  trafficMultiplier: number;
  isBlockModeActive: boolean;
  isLoading: boolean;
  isGpsLoading: boolean;
  isOpen: boolean;
  forecastData: TrafficForecastData | null;
  onSelectSource: (lm: Landmark) => void;
  onSelectDestination: (lm: Landmark) => void;
  onSelectVehicle: (v: VehicleType) => void;
  onChangeStrategy: (s: RoutingStrategy) => void;
  onChangeTrafficMultiplier: (val: number) => void;
  onUseGps: () => void;
  onAddWaypoint: () => void;
  onRemoveWaypoint: (id: string) => void;
  onToggleBlockMode: () => void;
  onRemoveBlockedRoad: (id: string) => void;
  onCalculateRoute: () => void;
  onLoadSampleRoute: () => void;
  onOpenAlgorithmModal: () => void;
  onClearAll: () => void;
  onCloseMobileDrawer?: () => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  source,
  destination,
  waypoints,
  blockedRoads,
  selectedVehicle,
  strategy,
  trafficMultiplier,
  isBlockModeActive,
  isLoading,
  isGpsLoading,
  isOpen,
  forecastData,
  onSelectSource,
  onSelectDestination,
  onSelectVehicle,
  onChangeStrategy,
  onChangeTrafficMultiplier,
  onUseGps,
  onAddWaypoint,
  onRemoveWaypoint,
  onToggleBlockMode,
  onRemoveBlockedRoad,
  onCalculateRoute,
  onLoadSampleRoute,
  onOpenAlgorithmModal,
  onClearAll,
}) => {
  return (
    <aside
      id="mission-control-panel"
      className={`fixed md:static inset-y-0 left-0 z-40 w-full sm:w-[350px] lg:w-[360px] bg-[#111827] border-r border-[#263247] flex flex-col shrink-0 transition-transform duration-200 ease-in-out select-none shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* MISSION CONTROL HEADER */}
      <div className="px-4 py-3 border-b border-[#263247] bg-[#080D18]/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#172033] border border-[#263247] flex items-center justify-center text-[#38BDF8]">
            <Radio className="w-4 h-4 text-[#38BDF8] animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC] tracking-wider uppercase flex items-center gap-1.5">
              Mission Control
            </h2>
            <p className="text-[11px] text-[#94A3B8]">
              Configure an emergency response route.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#172033] border border-[#263247] text-[#38BDF8]">
          v2.4 TAC
        </span>
      </div>

      {/* SCROLLABLE MISSION PARAMETERS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-[#F8FAFC]">
        {/* SECTION 1: RESPONSE UNIT */}
        <section aria-labelledby="section-unit-heading" className="space-y-1">
          <ResponseUnitSelector
            selectedVehicle={selectedVehicle}
            onSelectVehicle={onSelectVehicle}
          />
        </section>

        <div className="h-px bg-[#263247]" />

        {/* SECTION 2: ROUTE TARGET */}
        <section aria-labelledby="section-target-heading" className="space-y-1">
          <RouteTargetControls
            source={source}
            destination={destination}
            waypoints={waypoints}
            blockedRoads={blockedRoads}
            isBlockModeActive={isBlockModeActive}
            isGpsLoading={isGpsLoading}
            onSelectSource={onSelectSource}
            onSelectDestination={onSelectDestination}
            onUseGps={onUseGps}
            onAddWaypoint={onAddWaypoint}
            onRemoveWaypoint={onRemoveWaypoint}
            onToggleBlockMode={onToggleBlockMode}
            onRemoveBlockedRoad={onRemoveBlockedRoad}
          />
        </section>

        <div className="h-px bg-[#263247]" />

        {/* SECTION 3: ROUTING PRIORITY */}
        <section aria-labelledby="section-priority-heading" className="space-y-1">
          <RoutingPrioritySelector
            strategy={strategy}
            onChangeStrategy={onChangeStrategy}
          />
        </section>

        <div className="h-px bg-[#263247]" />

        {/* SECTION 4: LIVE CONDITIONS */}
        <section aria-labelledby="section-conditions-heading" className="space-y-1">
          <LiveConditions
            multiplier={trafficMultiplier}
            onChangeMultiplier={onChangeTrafficMultiplier}
            activeObstaclesCount={blockedRoads.length}
          />
        </section>

        {/* AI TRAFFIC FORECAST PREVIEW */}
        {forecastData && (
          <div className="pt-1">
            <TrafficForecastCard forecast={forecastData} />
          </div>
        )}
      </div>

      {/* SECTION 5: PRIMARY DISPATCH ACTIONS */}
      <div className="px-4 py-3 border-t border-[#263247] bg-[#080D18] space-y-2 shrink-0">
        {/* PRIMARY ACTION BUTTON */}
        <button
          type="button"
          id="calculate-optimal-route-btn"
          onClick={onCalculateRoute}
          disabled={isLoading || !source || !destination}
          className="w-full h-11 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] disabled:from-[#172033] disabled:to-[#172033] text-white font-bold text-xs tracking-wider uppercase rounded-lg border border-[#38BDF8]/40 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed disabled:text-[#94A3B8] disabled:border-[#263247]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>CALCULATING SAFEST RESPONSE ROUTE…</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 fill-current text-[#38BDF8]" />
              <span>CALCULATE EMERGENCY ROUTE</span>
            </>
          )}
        </button>

        {/* SECONDARY ACTION BUTTONS */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            id="load-sample-route-btn"
            onClick={onLoadSampleRoute}
            className="h-8 bg-[#172033] hover:bg-[#263247] text-[#F8FAFC] border border-[#263247] rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Load sample Bengaluru critical emergency corridor"
          >
            <Layers className="w-3 h-3 text-[#38BDF8]" />
            <span className="truncate">Sample</span>
          </button>

          <button
            type="button"
            id="compare-algorithms-btn"
            onClick={onOpenAlgorithmModal}
            className="h-8 bg-[#172033] hover:bg-[#263247] text-[#F8FAFC] border border-[#263247] rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Compare BFS vs A* vs Hybrid A* + DFS runtime metrics"
          >
            <Cpu className="w-3 h-3 text-[#22C55E]" />
            <span className="truncate">Algorithms</span>
          </button>

          <button
            type="button"
            id="clear-all-btn"
            onClick={onClearAll}
            className="h-8 bg-[#172033] hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#263247] hover:border-[#EF4444]/40 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Clear all waypoints, roadblocks, and routes"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="truncate">Clear</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
