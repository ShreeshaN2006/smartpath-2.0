import {
  MapPin,
  MapPinX,
  Plus,
  X,
  Truck,
  Car,
  Ambulance,
  Navigation,
  LocateFixed,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { cn } from '../../lib/utils'
import type { Coordinates, VehicleType, RoutingMode, RouteResponse, LiveTrackingState } from '../../types'

interface RouteControlsProps {
  source?: Coordinates
  destination?: Coordinates
  waypoints: Coordinates[]
  blockedCoords: Coordinates[]
  vehicle: VehicleType
  mode: RoutingMode
  trafficMultiplier: number
  isLoading: boolean
  route: RouteResponse | null
  liveTracking?: LiveTrackingState
  onSetSource: () => void
  onSetDestination: () => void
  onAddWaypoint: () => void
  onAddBlockage: () => void
  onClearWaypoints: () => void
  onClearBlockages: () => void
  onCalculateRoute: () => void
  onCompare: () => void
  onClearAll: () => void
  onLoadDemo?: () => void
  onUseGpsAsSource?: () => void
  onStartLiveNavigation?: () => void
  onVehicleChange: (vehicle: VehicleType) => void
  onModeChange: (mode: RoutingMode) => void
  onTrafficChange: (value: number) => void
  currentMode: 'source' | 'destination' | 'waypoint' | 'blockage' | null
}

const vehicleOptions = [
  { value: 'delivery_van', label: 'Delivery Van (3.5t)', icon: Truck },
  { value: 'car', label: 'Car / Electric Courier', icon: Car },
  { value: 'ambulance', label: 'Ambulance (Emergency)', icon: Ambulance },
  { value: 'truck', label: 'Heavy Truck (18t)', icon: Truck },
] as const

const modeOptions = [
  { value: 'balanced', label: 'Balanced (Time + Risk)', description: 'Recommended: optimal balance of travel time and reliability' },
  { value: 'fastest', label: 'Fastest Route', description: 'Minimize travel time using highest speed corridors' },
  { value: 'safest', label: 'Safest Route', description: 'Avoid congestion, incidents, and complex intersections' },
  { value: 'emergency', label: 'Emergency Priority', description: 'Dispatches emergency overrides for fastest clearance' },
] as const

export function RouteControls({
  source,
  destination,
  waypoints,
  blockedCoords,
  vehicle,
  mode,
  trafficMultiplier,
  isLoading,
  route,
  liveTracking,
  onSetSource,
  onSetDestination,
  onAddWaypoint,
  onAddBlockage,
  onClearWaypoints,
  onClearBlockages,
  onCalculateRoute,
  onCompare,
  onClearAll,
  onLoadDemo,
  onUseGpsAsSource,
  onStartLiveNavigation,
  onVehicleChange,
  onModeChange,
  onTrafficChange,
  currentMode,
}: RouteControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="w-80 flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-brand-primary" />
          <h2 className="text-heading-s font-bold text-neutral-900">Route Controls</h2>
        </div>
        {route && (
          <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider">
            Route Ready
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {/* Source & Destination Buttons */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={currentMode === 'source' ? 'primary' : 'outline'}
              size="sm"
              onClick={onSetSource}
              className="w-full justify-center"
              disabled={isLoading}
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              {source ? 'Source Set' : 'Set Source'}
            </Button>
            <Button
              variant={currentMode === 'destination' ? 'primary' : 'outline'}
              size="sm"
              onClick={onSetDestination}
              className="w-full justify-center"
              disabled={isLoading}
            >
              <MapPin className="w-4 h-4 text-rose-600" />
              {destination ? 'Dest Set' : 'Set Dest'}
            </Button>
          </div>

          {/* Quick GPS as Source Option */}
          {onUseGpsAsSource && (
            <button
              onClick={onUseGpsAsSource}
              type="button"
              className="w-full text-xs font-semibold text-brand-primary hover:text-brand-secondary flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/15 transition-all"
            >
              <LocateFixed className="w-3.5 h-3.5 text-brand-primary" />
              Use My Real GPS Location as Source
            </button>
          )}
        </div>

        {/* Waypoints & Blockages */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={currentMode === 'waypoint' ? 'primary' : 'outline'}
            size="sm"
            onClick={onAddWaypoint}
            className="w-full"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4 text-violet-600" />
            Waypoint
          </Button>
          <Button
            variant={currentMode === 'blockage' ? 'danger' : 'outline'}
            size="sm"
            onClick={onAddBlockage}
            className="w-full"
            disabled={isLoading}
          >
            <MapPinX className="w-4 h-4 text-rose-600" />
            Block Road
          </Button>
        </div>

        {(waypoints.length > 0 || blockedCoords.length > 0) && (
          <div className="grid grid-cols-2 gap-2">
            {waypoints.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearWaypoints} className="w-full text-xs text-neutral-600">
                <X className="w-3.5 h-3.5" />
                Clear Waypoints ({waypoints.length})
              </Button>
            )}
            {blockedCoords.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearBlockages} className="w-full text-xs text-rose-600 hover:bg-rose-50">
                <X className="w-3.5 h-3.5" />
                Clear Blockages ({blockedCoords.length})
              </Button>
            )}
          </div>
        )}

        {/* Vehicle Selection */}
        <div className="pt-2 border-t border-neutral-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Vehicle Type</label>
          <Select
            value={vehicle}
            onChange={(e) => onVehicleChange(e.target.value as VehicleType)}
            options={vehicleOptions.map((v) => ({ value: v.value, label: v.label }))}
            disabled={isLoading}
          />
        </div>

        {/* Routing Mode */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Routing Policy</label>
          <Select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as RoutingMode)}
            options={modeOptions.map((m) => ({ value: m.value, label: m.label }))}
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-neutral-500">
            {modeOptions.find((m) => m.value === mode)?.description}
          </p>
        </div>

        {/* Traffic Multiplier */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 mb-1.5">
            <span>Simulated Traffic Multiplier</span>
            <span className="font-mono text-brand-primary">{trafficMultiplier.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            step="0.5"
            value={trafficMultiplier}
            onChange={(e) => onTrafficChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-lg appearance-none cursor-pointer"
            disabled={isLoading}
          />
        </div>

        {/* Sample Route Preset */}
        {onLoadDemo && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadDemo}
            disabled={isLoading}
            className="w-full text-brand-primary border-brand-primary/30 hover:bg-brand-primary/5 font-semibold gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            ⚡ Load Sample Route (Bangalore)
          </Button>
        )}

        {/* Primary Calculate Button */}
        <Button
          onClick={onCalculateRoute}
          disabled={isLoading || !source || !destination}
          loading={isLoading}
          className="w-full font-bold shadow-md shadow-brand-primary/20"
          size="lg"
        >
          Calculate Optimal Route
        </Button>

        {/* Start Live Navigation Trigger */}
        {route && onStartLiveNavigation && (
          <Button
            variant="primary"
            onClick={onStartLiveNavigation}
            className="w-full font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 gap-2"
            size="lg"
          >
            <Play className="w-4 h-4 fill-current" />
            {liveTracking?.isActive ? 'Resume Navigation' : 'Start Live GPS Navigation'}
          </Button>
        )}

        {/* Comparison & Reset */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={onCompare} disabled={isLoading || !source || !destination} className="w-full text-xs">
            Algorithm Compare
          </Button>
          <Button variant="ghost" onClick={onClearAll} className="w-full text-xs text-neutral-500 hover:text-neutral-800">
            Clear All
          </Button>
        </div>
      </div>
    </div>
  )
}
