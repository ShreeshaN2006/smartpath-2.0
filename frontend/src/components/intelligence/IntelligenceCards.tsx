import {
  AlertTriangle,
  CloudRain,
  Wind,
  Thermometer,
  Activity,
  Sun,
  CloudLightning,
  CloudFog,
  ShieldCheck
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { cn } from '../../lib/utils'
import type { WeatherData, Incident, TrafficData } from '../../types'

interface WeatherCardProps {
  weather: WeatherData | null
  isLoading?: boolean
}

const weatherCodeMap: Record<number, { label: string; icon: React.ReactNode; color: string }> = {
  0: { label: 'Clear Sky', icon: <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />, color: 'text-amber-500' },
  1: { label: 'Mainly Clear', icon: <Sun className="w-5 h-5 text-amber-400" />, color: 'text-amber-400' },
  2: { label: 'Partly Cloudy', icon: <CloudRain className="w-5 h-5 text-sky-400" />, color: 'text-sky-400' },
  3: { label: 'Overcast', icon: <CloudRain className="w-5 h-5 text-slate-400" />, color: 'text-slate-400' },
  45: { label: 'Foggy', icon: <CloudFog className="w-5 h-5 text-slate-400" />, color: 'text-slate-400' },
  61: { label: 'Light Rain', icon: <CloudRain className="w-5 h-5 text-blue-400" />, color: 'text-blue-400' },
  65: { label: 'Heavy Rain', icon: <CloudRain className="w-5 h-5 text-blue-600" />, color: 'text-blue-600' },
  95: { label: 'Thunderstorm', icon: <CloudLightning className="w-5 h-5 text-purple-500" />, color: 'text-purple-500' },
}

export function WeatherCard({ weather, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return (
      <div className="p-4 bg-white/90 rounded-2xl border border-neutral-100 flex items-center justify-center h-28">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="p-4 bg-white/90 rounded-2xl border border-neutral-100 text-center text-xs text-slate-400">
        Live weather sensor offline
      </div>
    )
  }

  const condition = weatherCodeMap[weather.weather_code] || {
    label: 'Optimal Weather',
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    color: 'text-amber-500',
  }

  return (
    <div className="p-3.5 bg-white/95 rounded-2xl border border-neutral-100/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          {condition.icon}
          <div>
            <h4 className="text-xs font-bold text-slate-800 font-heading leading-tight">{condition.label}</h4>
            <p className="text-[10px] text-slate-400 font-mono">Live Bangalore Telemetry</p>
          </div>
        </div>
        <span className="text-sm font-black font-mono text-slate-800">
          {weather.temperature_c.toFixed(1)}°C
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
            <Wind className="w-3.5 h-3.5 text-indigo-500" /> Wind
          </span>
          <span className="font-mono font-bold text-slate-800">{weather.wind_speed_kmh.toFixed(0)} km/h</span>
        </div>
        <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
            <CloudRain className="w-3.5 h-3.5 text-sky-500" /> Precip
          </span>
          <span className="font-mono font-bold text-slate-800">{weather.precipitation_mm.toFixed(1)} mm</span>
        </div>
      </div>
    </div>
  )
}

interface IncidentCardProps {
  incidents: Incident[]
  isLoading?: boolean
}

export function IncidentCard({ incidents, isLoading }: IncidentCardProps) {
  if (isLoading) {
    return (
      <div className="p-4 bg-white/90 rounded-2xl border border-neutral-100 flex items-center justify-center h-28">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  if (incidents.length === 0) {
    return (
      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center flex items-center justify-center gap-2 text-xs text-emerald-700 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        No active hazard incidents on primary arteries
      </div>
    )
  }

  return (
    <div className="p-3.5 bg-white/95 rounded-2xl border border-neutral-100/80 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-slate-800 font-heading">Road Incidents ({incidents.length})</h4>
        </div>
        <span className="text-[10px] font-mono text-amber-600 font-bold uppercase">Dynamic DFS Detours</span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {incidents.map((inc) => (
          <div key={inc.id} className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 capitalize">{inc.type.replace('_', ' ')}</span>
              <Badge variant={inc.severity > 2 ? 'danger' : 'warning'} size="sm" className="text-[10px]">
                Level {inc.severity} Severity
              </Badge>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-1">Corridor: {inc.edge_id.replace('_', ' ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

interface TrafficCardProps {
  traffic: TrafficData[]
  isLoading?: boolean
}

export function TrafficCard({ traffic, isLoading }: TrafficCardProps) {
  if (isLoading) {
    return (
      <div className="p-4 bg-white/90 rounded-2xl border border-neutral-100 flex items-center justify-center h-28">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (traffic.length === 0) {
    return (
      <div className="p-4 bg-white/90 rounded-2xl border border-neutral-100 text-center text-xs text-slate-400">
        Traffic sensors initializing...
      </div>
    )
  }

  const avgSpeed = Math.round(traffic.reduce((sum, t) => sum + t.current_speed_kmh, 0) / traffic.length)

  return (
    <div className="p-3.5 bg-white/95 rounded-2xl border border-neutral-100/80 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-800 font-heading">Traffic Velocity Feed</h4>
        </div>
        <span className="text-xs font-mono font-bold text-indigo-600">Avg {avgSpeed} km/h</span>
      </div>

      <div className="space-y-1.5 max-h-44 overflow-y-auto">
        {traffic.map((t) => (
          <div key={t.edge_id} className="flex items-center justify-between p-2 bg-neutral-50 rounded-xl text-xs">
            <span className="font-mono text-slate-700 font-medium">{t.edge_id.replace('e10', 'Link #').slice(0, 16)}</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-[11px] font-mono font-bold',
                t.congestion > 0.6 ? 'text-rose-600' : t.congestion > 0.35 ? 'text-amber-600' : 'text-emerald-600'
              )}>
                {t.current_speed_kmh} km/h
              </span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.congestion > 0.6 ? '#f43f5e' : t.congestion > 0.35 ? '#f59e0b' : '#10b981' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
