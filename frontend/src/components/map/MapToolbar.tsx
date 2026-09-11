import { useState } from 'react'
import {
  LocateFixed,
  Layers,
  Compass,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Globe,
  Loader2
} from 'lucide-react'
import { cn } from '../../lib/utils'
import type { MapLayerType } from '../../types'

interface MapToolbarProps {
  currentLayer: MapLayerType
  onSelectLayer: (layer: MapLayerType) => void
  onLocateMe: () => void
  isLocating: boolean
  onFitBounds?: () => void
}

const layerOptions: { type: MapLayerType; label: string; icon: React.ReactNode }[] = [
  { type: 'streets', label: 'Streets', icon: <Sun className="w-4 h-4 text-amber-500" /> },
  { type: 'dark', label: 'Dark Mode', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
  { type: 'satellite', label: 'Satellite', icon: <Globe className="w-4 h-4 text-emerald-500" /> },
  { type: 'positron', label: 'Clean Light', icon: <Compass className="w-4 h-4 text-sky-500" /> },
]

export function MapToolbar({
  currentLayer,
  onSelectLayer,
  onLocateMe,
  isLocating,
  onFitBounds,
}: MapToolbarProps) {
  const [showLayerMenu, setShowLayerMenu] = useState(false)

  return (
    <div className="flex flex-col gap-2 z-[1000]">
      {/* GPS Locate Me Button */}
      <button
        onClick={onLocateMe}
        disabled={isLocating}
        title="Find My GPS Location"
        className={cn(
          'w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-lg flex items-center justify-center transition-all duration-200 group',
          isLocating ? 'text-brand-primary cursor-wait' : 'text-neutral-700 hover:text-brand-primary hover:border-brand-primary/40'
        )}
      >
        {isLocating ? (
          <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
        ) : (
          <LocateFixed className="w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Layer Switcher Button & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          title="Switch Map Layers"
          className={cn(
            'w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-lg flex items-center justify-center transition-all duration-200',
            showLayerMenu ? 'text-brand-primary border-brand-primary ring-2 ring-brand-primary/20' : 'text-neutral-700 hover:text-brand-primary'
          )}
        >
          <Layers className="w-5 h-5" />
        </button>

        {showLayerMenu && (
          <div className="absolute right-12 top-0 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-xl shadow-xl p-1.5 w-40 flex flex-col gap-1 z-[1100] animate-in fade-in zoom-in-95 duration-150">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1">
              Map Style
            </p>
            {layerOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => {
                  onSelectLayer(opt.type)
                  setShowLayerMenu(false)
                }}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left w-full',
                  currentLayer === opt.type
                    ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fit Route Bounds Button */}
      {onFitBounds && (
        <button
          onClick={onFitBounds}
          title="Fit Route to Screen"
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-lg flex items-center justify-center text-neutral-700 hover:text-brand-primary hover:border-brand-primary/40 transition-all duration-200"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
