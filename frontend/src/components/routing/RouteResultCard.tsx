import {
  Shield,
  Clock,
  Zap,
  MapPin,
  CheckCircle,
  Info,
  Leaf,
  Navigation,
  Compass,
  ArrowRight
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn, formatDuration, formatDistance, formatRiskScore, getRiskColor } from '../../lib/utils'
import type { RouteResponse, RouteExplanation } from '../../types'

interface RouteResultCardProps {
  route: RouteResponse | null
  explanation?: RouteExplanation
  onUseRoute: () => void
  onViewAlternatives: () => void
  isLoading?: boolean
}

export function RouteResultCard({
  route,
  explanation,
  onUseRoute,
  onViewAlternatives,
  isLoading,
}: RouteResultCardProps) {
  if (!route) {
    return (
      <div className="p-8 text-center text-slate-500 space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-500 border border-indigo-100 shadow-sm">
          <Navigation className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">No Route Active</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Click <strong>Set Source</strong> & <strong>Set Destination</strong> on the map, or tap <strong>⚡ Load Sample Route</strong> to calculate instant optimal path.
          </p>
        </div>
      </div>
    )
  }

  const { level: riskLevel } = formatRiskScore(route.risk_score)
  const co2SavedKg = Number((route.distance_km * 0.08).toFixed(2))

  return (
    <div className="p-4 space-y-4">
      {/* Route Header Banner */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 font-mono">
            Optimal Routing Decision
          </span>
          <h3 className="text-base font-bold text-slate-900 font-heading">Recommended Corridor</h3>
        </div>
        <Badge
          variant={
            riskLevel.toLowerCase().includes('low')
              ? 'success'
              : riskLevel.toLowerCase() === 'medium'
              ? 'warning'
              : 'danger'
          }
          className="font-bold text-xs capitalize"
        >
          {riskLevel} Risk
        </Badge>
      </div>

      {/* Main Metrics: Distance, ETA, Reliability */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 font-mono">Distance</p>
          <p className="text-lg font-black text-slate-900 font-mono mt-0.5">{formatDistance(route.distance_km)}</p>
        </div>
        <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono">ETA</p>
          <p className="text-lg font-black text-slate-900 font-mono mt-0.5">{formatDuration(route.eta_min)}</p>
        </div>
        <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 font-mono">Reliability</p>
          <p className="text-lg font-black text-purple-700 font-mono mt-0.5">{Math.round(route.reliability_score * 100)}%</p>
        </div>
      </div>

      {/* AI Risk & Eco Score */}
      <div className="space-y-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            Safety & Disruption Index
          </span>
          <span className="font-mono font-bold text-slate-900">{route.risk_score.toFixed(2)}</span>
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-500', getRiskColor(route.risk_score))}
            style={{ width: `${Math.max(5, route.risk_score * 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <Leaf className="w-3.5 h-3.5" /> ~{co2SavedKg}kg CO₂ saved
          </span>
          <span className="font-mono text-slate-400">
            Engine: {route.algorithm.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Why this route factors */}
      {explanation && (
        <div className="space-y-2 border-t border-neutral-100 pt-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Intelligence Insights</h4>
          <ul className="space-y-1.5">
            {explanation.factors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{factor.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2 pt-2 border-t border-neutral-100">
        <Button
          onClick={onUseRoute}
          className="flex-1 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md gap-1.5 text-xs py-2.5"
        >
          <Navigation className="w-3.5 h-3.5" />
          Start Navigation
        </Button>
        <Button
          variant="outline"
          onClick={onViewAlternatives}
          className="flex-1 text-xs py-2.5 font-semibold"
        >
          Compare Options
        </Button>
      </div>
    </div>
  )
}

interface RouteComparisonProps {
  comparison: RouteExplanation['comparison']
  onSelectRoute: (type: 'recommended' | 'fastest' | 'safest') => void
}

export function RouteComparison({ comparison, onSelectRoute }: RouteComparisonProps) {
  if (!comparison) {
    return (
      <div className="p-6 text-center text-xs text-slate-400">
        Calculate a route to compare algorithms.
      </div>
    )
  }

  const routes = [
    { key: 'recommended', ...comparison.recommended, label: 'Recommended (Balanced)' },
    { key: 'fastest', ...comparison.fastest, label: 'Fastest (High Congestion)' },
    { key: 'safest', ...comparison.safest, label: 'Safest (Low Disruption)' },
  ]

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
          Route Alternatives
        </h4>
        <span className="text-[11px] text-indigo-600 font-semibold">Multi-objective</span>
      </div>

      <div className="space-y-2">
        {routes.map((r) => (
          <div
            key={r.key}
            className={cn(
              'p-3 rounded-2xl border transition-all',
              r.key === 'recommended'
                ? 'bg-indigo-50/50 border-indigo-200/80 shadow-xs'
                : 'bg-neutral-50 border-neutral-200/60 hover:bg-white'
            )}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900">{r.label}</span>
              <Badge
                variant={r.risk_level.includes('low') ? 'success' : r.risk_level === 'medium' ? 'warning' : 'danger'}
                size="sm"
                className="text-[10px] capitalize"
              >
                {r.risk_level.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs my-2 py-1.5 bg-white/80 rounded-xl border border-neutral-100">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-mono">ETA</p>
                <p className="font-mono font-bold text-slate-800">{formatDuration(r.eta_min)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-mono">Dist</p>
                <p className="font-mono font-bold text-slate-800">{formatDistance(r.distance_km)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-mono">Reliability</p>
                <p className="font-mono font-bold text-emerald-600">{Math.round(r.reliability * 100)}%</p>
              </div>
            </div>

            <button
              onClick={() => onSelectRoute(r.key as 'recommended' | 'fastest' | 'safest')}
              className="w-full text-xs font-semibold py-1 rounded-lg bg-neutral-200/60 hover:bg-indigo-600 hover:text-white transition-colors"
            >
              Select Policy
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
