import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { Landmark } from '../types';
import { BENGALURU_LANDMARKS } from '../data/bengaluruData';

interface LocationInputProps {
  label: string;
  placeholder: string;
  selectedLandmark: Landmark | null;
  onSelectLandmark: (landmark: Landmark) => void;
  isDestination?: boolean;
  onUseGps?: () => void;
  isGpsLoading?: boolean;
  idPrefix: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  placeholder,
  selectedLandmark,
  onSelectLandmark,
  isDestination = false,
  onUseGps,
  isGpsLoading = false,
  idPrefix,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={`${idPrefix}-select`}
          className="text-xs font-semibold text-[#0B0A0C] flex items-center gap-1.5"
        >
          {isDestination ? (
            <Navigation className="w-3.5 h-3.5 text-[#163359]" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-[#2F5C93]" />
          )}
          {label}
        </label>
        {onUseGps && (
          <button
            type="button"
            id={`${idPrefix}-gps-btn`}
            onClick={onUseGps}
            disabled={isGpsLoading}
            className="text-[11px] text-[#2F5C93] hover:text-[#163359] font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
            title="Locate nearest Bengaluru hub using GPS"
          >
            <Compass className={`w-3 h-3 ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>{isGpsLoading ? 'Detecting...' : 'Use My GPS'}</span>
          </button>
        )}
      </div>

      <div className="relative">
        <select
          id={`${idPrefix}-select`}
          aria-label={label}
          value={selectedLandmark?.id || ''}
          onChange={(e) => {
            const found = BENGALURU_LANDMARKS.find((l) => l.id === e.target.value);
            if (found) onSelectLandmark(found);
          }}
          className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium text-[#0B0A0C] focus:outline-hidden focus:ring-2 focus:ring-[#2F5C93]/20 focus:border-[#2F5C93] transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {BENGALURU_LANDMARKS.map((landmark) => (
            <option key={landmark.id} value={landmark.id}>
              {landmark.name} ({landmark.area})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748B]">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {selectedLandmark && (
        <div className="text-[11px] text-[#64748B] flex items-center justify-between px-1">
          <span>{selectedLandmark.area}</span>
          <span className="font-mono text-[10px]">
            {selectedLandmark.lat.toFixed(4)}°N, {selectedLandmark.lng.toFixed(4)}°E
          </span>
        </div>
      )}
    </div>
  );
};
