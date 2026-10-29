import React from 'react';
import { Landmark, VehicleType, RoutingStrategy, Waypoint, BlockedRoad, TrafficForecastData } from '../types';
import { MissionControl } from './MissionControl';

interface SidebarProps {
  source: Landmark | null;
  destination: Landmark | null;
  waypoints: Waypoint[];
  vehicle: VehicleType;
  strategy: RoutingStrategy;
  trafficMultiplier: number;
  blockedRoads: BlockedRoad[];
  isBlockModeActive: boolean;
  isCalculating: boolean;
  forecast: TrafficForecastData;
  isGpsLoading: boolean;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
  onSelectSource: (landmark: Landmark) => void;
  onSelectDestination: (landmark: Landmark) => void;
  onSelectVehicle: (v: VehicleType) => void;
  onSelectStrategy: (s: RoutingStrategy) => void;
  onChangeTrafficMultiplier: (val: number) => void;
  onUseGps: () => void;
  onAddWaypoint: () => void;
  onRemoveWaypoint: (id: string) => void;
  onToggleBlockMode: () => void;
  onRemoveBlockedRoad: (id: string) => void;
  onLoadSampleRoute: () => void;
  onCalculateRoute: () => void;
  onOpenAlgorithmComparison: () => void;
  onClearAll: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  source,
  destination,
  waypoints,
  vehicle,
  strategy,
  trafficMultiplier,
  blockedRoads,
  isBlockModeActive,
  isCalculating,
  forecast,
  isGpsLoading,
  isSidebarOpen,
  onCloseSidebar,
  onSelectSource,
  onSelectDestination,
  onSelectVehicle,
  onSelectStrategy,
  onChangeTrafficMultiplier,
  onUseGps,
  onAddWaypoint,
  onRemoveWaypoint,
  onToggleBlockMode,
  onRemoveBlockedRoad,
  onLoadSampleRoute,
  onCalculateRoute,
  onOpenAlgorithmComparison,
  onClearAll,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}

      <MissionControl
        source={source}
        destination={destination}
        waypoints={waypoints}
        blockedRoads={blockedRoads}
        selectedVehicle={vehicle}
        strategy={strategy}
        trafficMultiplier={trafficMultiplier}
        isBlockModeActive={isBlockModeActive}
        isLoading={isCalculating}
        isGpsLoading={isGpsLoading}
        isOpen={isSidebarOpen}
        forecastData={forecast}
        onSelectSource={onSelectSource}
        onSelectDestination={onSelectDestination}
        onSelectVehicle={onSelectVehicle}
        onChangeStrategy={onSelectStrategy}
        onChangeTrafficMultiplier={onChangeTrafficMultiplier}
        onUseGps={onUseGps}
        onAddWaypoint={onAddWaypoint}
        onRemoveWaypoint={onRemoveWaypoint}
        onToggleBlockMode={onToggleBlockMode}
        onRemoveBlockedRoad={onRemoveBlockedRoad}
        onCalculateRoute={onCalculateRoute}
        onLoadSampleRoute={onLoadSampleRoute}
        onOpenAlgorithmModal={onOpenAlgorithmComparison}
        onClearAll={onClearAll}
        onCloseMobileDrawer={onCloseSidebar}
      />
    </>
  );
};

