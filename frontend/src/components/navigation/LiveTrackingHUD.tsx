import { useState } from 'react'
import {
  Play,
  Pause,
  Square,
  Navigation,
  Gauge,
  Clock,
  MapPin,
  CheckCircle,
  Eye,
  EyeOff,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
  Radio
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { cn, formatDuration, formatDistance } from '../../lib/utils'
import type { LiveTrackingState, VehicleType } from '../../types'

interface LiveTrackingHUDProps {
  tracking: LiveTrackingState
  vehicle: VehicleType
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onSpeedChange: (speed: number) => void
  onToggleCamera: () => void
}

export function LiveTrackingHUD({
  tracking,
  vehicle,
  onStart,
  onPause,
  onResume,
  onStop,
  onSpeedChange,
  onToggleCamera,
}: LiveTrackingHUDProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!tracking.isActive && !tracking.isPaused && !tracking.isCompleted) {
    return null
  }

  const speedMultiplierOptions = [1, 2, 5, 10]
  const vehicleEmoji = vehicle === 'ambulance' ? '🚑' : vehicle === 'truck' ? '🚛' : vehicle === 'car' ? '🚗' : '🚐'

  return (
    <div className="glass-hud rounded-3xl p-4 flex flex-col gap-3.5 transition-all duration-300 w-full max-w-md shadow-2xl border border-white/15">
      {/* Top Banner: Navigation Maneuver Guidance */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/30 border border-indigo-400/30 flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
            <Navigation
              className="w-5 h-5 text-indigo-400 transition-transform duration-200"
              style={{ transform: `rotate(${tracking.heading}deg)` }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                {tracking.isCompleted ? 'Mission Complete' : 'Active Guidance'}
              </p>
            </div>
            <p className="text-sm font-bold text-white tracking-tight truncate">
              {tracking.instruction}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg" title={vehicle.replace('_', ' ')}>{vehicleEmoji}</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Cockpit Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2 py-0.5">
        {/* Speedometer */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/5 text-center relative overflow-hidden group">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 mb-1">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            SPEED
          </div>
          <p className="text-2xl font-black font-mono text-white tracking-tight">
            {tracking.currentSpeedKmh}
            <span className="text-[10px] font-medium text-slate-400 ml-1">km/h</span>
          </p>
        </div>

        {/* Distance Remaining */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/5 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            REMAINING
          </div>
          <p className="text-2xl font-black font-mono text-white tracking-tight">
            {formatDistance(tracking.distanceRemainingKm)}
          </p>
        </div>

        {/* ETA Remaining */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/5 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            ETA
          </div>
          <p className="text-2xl font-black font-mono text-white tracking-tight">
            {formatDuration(tracking.etaRemainingMin)}
          </p>
        </div>
      </div>

      {/* Trip Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-400 font-mono text-[11px]">DISTANCE TRAVELED</span>
          <span className="text-emerald-400 font-mono font-bold">
            {formatDistance(tracking.distanceCoveredKm)} ({Math.round(tracking.progress * 100)}%)
          </span>
        </div>
        <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${Math.max(2, Math.round(tracking.progress * 100))}%` }}
          />
        </div>
      </div>

      {/* Expandable Step-by-Step Guidance */}
      {isExpanded && (
        <div className="p-3 bg-slate-900/90 rounded-2xl border border-white/10 text-xs space-y-2 max-h-36 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Live Route Telemetry</p>
          <div className="flex items-center justify-between text-slate-300 py-1 border-b border-white/5">
            <span>Bearing Angle</span>
            <span className="font-mono text-indigo-300">{Math.round(tracking.heading)}°</span>
          </div>
          <div className="flex items-center justify-between text-slate-300 py-1 border-b border-white/5">
            <span>Simulation Pace</span>
            <span className="font-mono text-emerald-300">{tracking.simulationSpeed}x Speed</span>
          </div>
          <div className="flex items-center justify-between text-slate-300 py-1">
            <span>Auto Camera Lock</span>
            <span className="font-mono text-amber-300">{tracking.cameraFollow ? 'Active' : 'Free Pan'}</span>
          </div>
        </div>
      )}

      {/* Controls & Speed Selection */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
        {/* Playback Actions */}
        <div className="flex items-center gap-1.5">
          {tracking.isCompleted ? (
            <button
              onClick={onStart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay
            </button>
          ) : tracking.isPaused ? (
            <button
              onClick={onResume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Resume
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/10 transition-all"
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
          )}

          <button
            onClick={onStop}
            className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition-all"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        </div>

        {/* Speed Multipliers & Camera Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-0.5 rounded-xl border border-white/10">
            {speedMultiplierOptions.map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={cn(
                  'px-2 py-1 text-[11px] font-mono font-bold rounded-lg transition-all',
                  tracking.simulationSpeed === spd
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={onToggleCamera}
            title={tracking.cameraFollow ? 'Camera lock enabled' : 'Camera free view'}
            className={cn(
              'p-2 rounded-xl text-xs font-medium border transition-all',
              tracking.cameraFollow
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
            )}
          >
            {tracking.cameraFollow ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
