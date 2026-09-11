import {
  Play,
  Pause,
  Square,
  Compass,
  Navigation,
  Gauge,
  Clock,
  MapPin,
  CheckCircle,
  Eye,
  EyeOff,
  Zap,
  RotateCcw
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
  if (!tracking.isActive && !tracking.isPaused && !tracking.isCompleted) {
    return null
  }

  const speedMultiplierOptions = [1, 2, 5, 10]

  return (
    <div className="bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 transition-all duration-300">
      {/* Top Banner: Navigation Instruction */}
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0">
            <Navigation
              className="w-5 h-5 text-brand-primary transition-transform duration-200"
              style={{ transform: `rotate(${tracking.heading}deg)` }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              Live Turn-by-Turn Guidance
            </p>
            <p className="text-sm font-bold text-neutral-900 truncate">
              {tracking.instruction}
            </p>
          </div>
        </div>

        <Badge variant={tracking.isCompleted ? 'success' : tracking.isPaused ? 'warning' : 'info'}>
          {tracking.isCompleted ? 'Arrived' : tracking.isPaused ? 'Paused' : 'Navigating'}
        </Badge>
      </div>

      {/* Main Metrics: Speedometer, Distance, ETA */}
      <div className="grid grid-cols-3 gap-2 py-1">
        {/* Speedometer */}
        <div className="p-2.5 bg-neutral-50/80 rounded-xl border border-neutral-100 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mb-0.5">
            <Gauge className="w-3.5 h-3.5" />
            Speed
          </div>
          <p className="text-heading-s font-black text-brand-primary">
            {tracking.currentSpeedKmh} <span className="text-xs font-normal text-neutral-500">km/h</span>
          </p>
        </div>

        {/* Remaining Distance */}
        <div className="p-2.5 bg-neutral-50/80 rounded-xl border border-neutral-100 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mb-0.5">
            <MapPin className="w-3.5 h-3.5" />
            Remaining
          </div>
          <p className="text-heading-s font-black text-neutral-900">
            {formatDistance(tracking.distanceRemainingKm)}
          </p>
        </div>

        {/* ETA */}
        <div className="p-2.5 bg-neutral-50/80 rounded-xl border border-neutral-100 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mb-0.5">
            <Clock className="w-3.5 h-3.5" />
            ETA
          </div>
          <p className="text-heading-s font-black text-brand-secondary">
            {formatDuration(tracking.etaRemainingMin)}
          </p>
        </div>
      </div>

      {/* Trip Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-medium text-neutral-500">
          <span>Trip Progress</span>
          <span>{Math.round(tracking.progress * 100)}%</span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-primary via-indigo-500 to-success transition-all duration-200"
            style={{ width: `${Math.round(tracking.progress * 100)}%` }}
          />
        </div>
      </div>

      {/* Control Buttons & Options */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100">
        {/* Play / Pause / Stop */}
        <div className="flex items-center gap-1.5">
          {tracking.isCompleted ? (
            <Button size="sm" variant="outline" onClick={onStart} className="gap-1.5 font-semibold">
              <RotateCcw className="w-3.5 h-3.5" /> Replay
            </Button>
          ) : tracking.isPaused ? (
            <Button size="sm" variant="primary" onClick={onResume} className="gap-1.5 font-semibold">
              <Play className="w-3.5 h-3.5 fill-current" /> Resume
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onPause} className="gap-1.5 font-semibold">
              <Pause className="w-3.5 h-3.5" /> Pause
            </Button>
          )}

          <Button size="sm" variant="ghost" onClick={onStop} className="text-danger hover:bg-danger/10 gap-1">
            <Square className="w-3 h-3 fill-current" /> Stop
          </Button>
        </div>

        {/* Speed Multipliers & Camera Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Speed multiplier selector */}
          <div className="flex bg-neutral-100 p-0.5 rounded-lg">
            {speedMultiplierOptions.map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={cn(
                  'px-2 py-0.5 text-xs font-semibold rounded transition-all',
                  tracking.simulationSpeed === spd
                    ? 'bg-white text-brand-primary shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                )}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Camera Follow Toggle */}
          <button
            onClick={onToggleCamera}
            title={tracking.cameraFollow ? 'Camera lock enabled' : 'Camera free view'}
            className={cn(
              'p-1.5 rounded-lg text-xs font-medium border transition-all',
              tracking.cameraFollow
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
            )}
          >
            {tracking.cameraFollow ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
