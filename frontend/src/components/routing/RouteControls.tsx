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
  Sparkles,
  Gauge,
  AlertTriangle,
  Layers,
  LocateFixed as LocateIcon,
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
  { value: 'delivery_van', label: 'Delivery Van (3.5t)', icon: Truck, capacity: '3.5 tons' },
  { value: 'car', label: 'Car / Electric Courier', icon: Car, capacity: '1.5 tons' },
  { value: 'ambulance', label: 'Ambulance (Emergency)', icon: Ambulance, capacity: '2.5 tons' },
  { value: 'truck', label: 'Heavy Truck (18t)', icon: Truck, capacity: '18 tons' },
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

  const currentVehicle = vehicleOptions.find(v => v.value === vehicle)
  const currentModeOption = modeOptions.find(m => m.value === mode)

  const trafficState = trafficMultiplier <= 1.5 ? 'Normal' : trafficMultiplier <= 2.5 ? 'Moderate' : trafficMultiplier <= 3.5 ? 'Heavy' : 'Severe'
  const trafficStateVariant = trafficMultiplier <= 1.5 ? 'success' : trafficMultiplier <= 2.5 ? 'warning' : trafficMultiplier <= 3.5 ? 'danger' : 'danger'

  return (
    <div className="w-80 flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-brand-primary" />
          <h2 className="text-heading-sm font-bold text-neutral-900">Route Controls</h2>
        </div>
        {route && (
          <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider">
            Route Ready
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {/* SECTION 1: ROUTE PLANNING */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-brand-primary" />
            <h3 className="text-heading-sm font-bold text-neutral-900">Route Planning</h3>
          </div>
          <p className="text-caption mb-3">Choose your pickup, destination and optional stops.</p>

          {/* Source & Destination */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={currentMode === 'source' ? 'primary' : 'outline'}
                size="sm"
                onClick={onSetSource}
                className="w-full justify-center"
                disabled={isLoading}
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="truncate">{source ? `Source Set` : 'Set Source'}</span>
              </Button>
              <Button
                variant={currentMode === 'destination' ? 'primary' : 'outline'}
                size="sm"
                onClick={onSetDestination}
                className="w-full justify-center"
                disabled={isLoading}
              >
                <MapPin className="w-4 h-4 text-rose-600" />
                <span className="truncate">{destination ? 'Dest Set' : 'Set Dest'}</span>
              </Button>
            </div>

            {/* Quick GPS as Source Option */}
            {onUseGpsAsSource && (
              <button
                onClick={onUseGpsAsSource}
                type="button"
                className="w-full text-xs font-semibold text-brand-primary hover:text-brand-secondary flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/15 transition-all"
              >
                <LocateIcon className="w-3.5 h-3.5 text-brand-primary" />
                Use My Real GPS Location as Source
              </button>
            )}
          </div>

          {/* Waypoints & Blockages */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
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
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
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
        </div>

        {/* SECTION 2: VEHICLE SETTINGS */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-brand-primary" />
            <h3 className="text-heading-sm font-bold text-neutral-900">Vehicle Configuration</h3>
          </div>

          <Select
            value={vehicle}
            onChange={(e) => onVehicleChange(e.target.value as VehicleType)}
            options={vehicleOptions.map((v) => ({ value: v.value, label: v.label }))}
            disabled={isLoading}
          />

          {currentVehicle && (
            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-3 text-sm">
              <span className="text-neutral-500">Capacity:</span>
              <span className="font-semibold text-neutral-900">{currentVehicle.capacity}</span>
            </div>
          )}
        </div>

        {/* SECTION 3: ROUTING STRATEGY */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-brand-primary" />
            <h3 className="text-heading-sm font-bold text-neutral-900">Routing Strategy</h3>
          </div>

          <Select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as RoutingMode)}
            options={modeOptions.map((m) => ({ value: m.value, label: m.label }))}
            disabled={isLoading}
          />

          {currentModeOption && (
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{currentModeOption.description}</p>
          )}
        </div>

        {/* SECTION 4: TRAFFIC SIMULATION */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-brand-primary" />
            <h3 className="text-heading-sm font-bold text-neutral-900">Traffic Conditions</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-700">
              <span>Traffic Multiplier</span>
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
            <div className="flex items-center justify-between">
              <Badge variant={trafficStateVariant} size="sm" className="text-[10px] uppercase tracking-wider">
                {trafficState}
              </Badge>
            </div>
          </div>
        </div>

        {/* SECTION 5: QUICK ACTIONS */}
        <div className="space-y-3">
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
              Load Sample Route (Bangalore)
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
              variant="success"
              onClick={onStartLiveNavigation}
              className="w-full font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 gap-2"
              size="lg"
            >
              <Play className="w-4 h-4 fill-current" />
              {liveTracking?.isActive ? 'Resume Navigation' : 'Start Live GPS Navigation'}
            </Button>
          )}

          {/* Comparison & Reset */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
            <Button variant="secondary" onClick={onCompare} disabled={isLoading || !source || !destination} className="w-full text-xs">
              Algorithm Compare
            </Button>
            <Button variant="ghost" onClick={onClearAll} className="w-full text-xs text-neutral-500 hover:text-neutral-800">
              Clear All
            </Button>
          </div>
        </div>

        {/* Live Tracking Status */}
        {liveTracking && (liveTracking.isActive || liveTracking.isPaused || liveTracking.isCompleted) && (
          <div className="glass-card rounded-xl p-4 border-emerald-200 bg-emerald-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={cn('status-dot status-pulse', liveTracking.isActive ? 'status-pulse-success' : 'status-pulse-warning')} />
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  {liveTracking.isActive ? 'LIVE TRACKING' : liveTracking.isPaused ? 'PAUSED' : 'COMPLETED'}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-600">
                {liveTracking.progress ? Math.round(liveTracking.progress * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-600">
              <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {liveTracking.distanceCoveredKm?.toFixed(1) || 0} km</span>
              <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {liveTracking.etaRemainingMin || 0} min</span>
              <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {liveTracking.simulationSpeed}x</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}