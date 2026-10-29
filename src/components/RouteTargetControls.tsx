import React from 'react';
import {
  MapPin,
  Compass,
  Plus,
  Ban,
  X,
  Crosshair,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { Landmark, Waypoint, BlockedRoad } from '../types';
import { BENGALURU_LANDMARKS } from '../data/bengaluruData';

interface RouteTargetControlsProps {
  source: Landmark | null;
  destination: Landmark | null;
  waypoints: Waypoint[];
  blockedRoads: BlockedRoad[];
  isBlockModeActive: boolean;
  isGpsLoading: boolean;
  onSelectSource: (lm: Landmark) => void;
  onSelectDestination: (lm: Landmark) => void;
  onUseGps: () => void;
  onAddWaypoint: () => void;
  onRemoveWaypoint: (id: string) => void;
  onToggleBlockMode: () => void;
  onRemoveBlockedRoad: (id: string) => void;
}

export const RouteTargetControls: React.FC<RouteTargetControlsProps> = ({
  source,
  destination,
  waypoints,
  blockedRoads,
  isBlockModeActive,
  isGpsLoading,
  onSelectSource,
  onSelectDestination,
  onUseGps,
  onAddWaypoint,
  onRemoveWaypoint,
  onToggleBlockMode,
  onRemoveBlockedRoad,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Route Target
        </span>
        <span className="text-[10px] text-[#38BDF8] font-mono">BENGALURU GRID</span>
      </div>

      {/* SOURCE FIELD */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="source-input-select"
            className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5"
          >
            <div className="w-4 h-4 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            </div>
            <span>SOURCE (STATION / DEPOT)</span>
          </label>

          <button
            type="button"
            id="source-input-gps-btn"
            onClick={onUseGps}
            disabled={isGpsLoading}
            className="text-[11px] text-[#38BDF8] hover:text-[#F8FAFC] font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
            title="Locate nearest station or response hub via GPS"
          >
            <Compass className={`w-3 h-3 ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>{isGpsLoading ? 'Locating...' : 'Use Current GPS'}</span>
          </button>
        </div>

        <div className="relative">
          <select
            id="source-input-select"
            aria-label="Starting station or depot"
            value={source?.id || ''}
            onChange={(e) => {
              const found = BENGALURU_LANDMARKS.find((l) => l.id === e.target.value);
              if (found) onSelectSource(found);
            }}
            className="w-full bg-[#172033] border border-[#263247] rounded-lg px-3 py-2 text-xs font-medium text-[#F8FAFC] focus:outline-hidden focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled className="bg-[#111827] text-[#94A3B8]">
              Choose starting location...
            </option>
            {BENGALURU_LANDMARKS.map((landmark) => (
              <option key={landmark.id} value={landmark.id} className="bg-[#111827] text-[#F8FAFC]">
                {landmark.name} ({landmark.area})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94A3B8]">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {source && (
          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] px-1 font-mono">
            <span>{source.stationType || source.area}</span>
            <span>{source.lat.toFixed(4)}°N, {source.lng.toFixed(4)}°E</span>
          </div>
        )}
      </div>

      {/* WAYPOINTS (INTERMEDIATE INCIDENT CHECKPOINTS) */}
      {waypoints.length > 0 && (
        <div className="space-y-1.5 pl-2.5 border-l-2 border-[#38BDF8]/40 my-2">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
            En Route Checkpoints ({waypoints.length})
          </span>
          {waypoints.map((wp, idx) => (
            <div
              key={wp.id}
              className="flex items-center justify-between bg-[#172033] border border-[#263247] px-2.5 py-1.5 rounded-md text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-[#080D18] text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-[#F8FAFC] font-medium truncate">{wp.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveWaypoint(wp.id)}
                className="text-[#94A3B8] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                title="Remove waypoint"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DESTINATION FIELD */}
      <div className="space-y-1.5">
        <label
          htmlFor="destination-input-select"
          className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5"
        >
          <div className="w-4 h-4 rounded-full bg-[#EF4444]/20 text-[#EF4444] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          </div>
          <span>DESTINATION (INCIDENT SITE / RECEIVER)</span>
        </label>

        <div className="relative">
          <select
            id="destination-input-select"
            aria-label="Emergency destination or incident location"
            value={destination?.id || ''}
            onChange={(e) => {
              const found = BENGALURU_LANDMARKS.find((l) => l.id === e.target.value);
              if (found) onSelectDestination(found);
            }}
            className="w-full bg-[#172033] border border-[#263247] rounded-lg px-3 py-2 text-xs font-medium text-[#F8FAFC] focus:outline-hidden focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444] transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled className="bg-[#111827] text-[#94A3B8]">
              Choose emergency destination...
            </option>
            {BENGALURU_LANDMARKS.map((landmark) => (
              <option key={landmark.id} value={landmark.id} className="bg-[#111827] text-[#F8FAFC]">
                {landmark.name} ({landmark.area})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94A3B8]">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {destination && (
          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] px-1 font-mono">
            <span>{destination.stationType || destination.area}</span>
            <span>{destination.lat.toFixed(4)}°N, {destination.lng.toFixed(4)}°E</span>
          </div>
        )}
      </div>

      {/* COMPACT ACTION ROW: ADD WAYPOINT & BLOCK ROAD */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          id="add-waypoint-btn"
          onClick={onAddWaypoint}
          className="h-10 flex items-center justify-center gap-1.5 px-3 bg-[#172033] hover:bg-[#263247] text-[#F8FAFC] border border-[#263247] hover:border-[#38BDF8] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Add Waypoint</span>
        </button>

        <button
          type="button"
          id="block-road-btn"
          onClick={onToggleBlockMode}
          className={`h-10 flex items-center justify-center gap-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            isBlockModeActive
              ? 'bg-[#EF4444] text-white border-[#EF4444] shadow-md shadow-[#EF4444]/30 animate-pulse'
              : 'bg-[#172033] hover:bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40'
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>{isBlockModeActive ? 'Click Map...' : 'Block Road'}</span>
        </button>
      </div>

      {/* ACTIVE HAZARDS / BLOCKED ROADS LIST */}
      {blockedRoads.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider block">
              Active Road Blockages ({blockedRoads.length})
            </span>
            <span className="text-[10px] text-[#94A3B8]">Detours Active</span>
          </div>
          {blockedRoads.map((block) => (
            <div
              key={block.id}
              className="flex items-center justify-between bg-[#172033] border border-[#EF4444]/40 px-2.5 py-1.5 rounded-md text-xs text-[#EF4444]"
            >
              <div className="flex items-center gap-1.5 truncate">
                <AlertTriangle className="w-3 h-3 text-[#EF4444] shrink-0" />
                <span className="truncate text-[11px] font-medium text-[#F8FAFC]">{block.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveBlockedRoad(block.id)}
                className="text-[#94A3B8] hover:text-[#EF4444] p-0.5 ml-1 transition-colors cursor-pointer"
                title="Clear road obstruction"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
