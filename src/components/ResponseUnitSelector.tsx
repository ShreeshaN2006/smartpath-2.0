import React from 'react';
import { Shield, Flame, Truck, Ambulance as AmbulanceIcon, CheckCircle2 } from 'lucide-react';
import { VehicleType } from '../types';
import { VEHICLE_CONFIGS } from '../data/bengaluruData';

interface ResponseUnitSelectorProps {
  selectedVehicle: VehicleType;
  onSelectVehicle: (vehicle: VehicleType) => void;
}

export const ResponseUnitSelector: React.FC<ResponseUnitSelectorProps> = ({
  selectedVehicle,
  onSelectVehicle,
}) => {
  const units: { type: VehicleType; icon: React.ReactNode; label: string; desc: string; color: string }[] = [
    {
      type: 'Ambulance',
      icon: <AmbulanceIcon className="w-4 h-4 text-[#EF4444]" />,
      label: 'Ambulance Unit',
      desc: 'Critical care, priority green wave siren clearance',
      color: 'border-[#EF4444]/40 bg-[#EF4444]/10',
    },
    {
      type: 'Fire Engine',
      icon: <Flame className="w-4 h-4 text-[#F59E0B]" />,
      label: 'Fire Engine',
      desc: 'Rapid water-tender, wide corridor turning radius',
      color: 'border-[#F59E0B]/40 bg-[#F59E0B]/10',
    },
    {
      type: 'Police Vehicle',
      icon: <Shield className="w-4 h-4 text-[#38BDF8]" />,
      label: 'Police Interceptor',
      desc: 'Tactical law enforcement & perimeter lockdown',
      color: 'border-[#38BDF8]/40 bg-[#38BDF8]/10',
    },
    {
      type: 'Relief Truck',
      icon: <Truck className="w-4 h-4 text-[#22C55E]" />,
      label: 'Relief / Heavy Rescue',
      desc: 'Disaster aid, equipment and evacuation support',
      color: 'border-[#22C55E]/40 bg-[#22C55E]/10',
    },
  ];

  const currentConfig = VEHICLE_CONFIGS[selectedVehicle] || VEHICLE_CONFIGS['Ambulance'];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Response Unit
        </span>
        <span className="text-[10px] font-mono text-[#38BDF8] whitespace-nowrap">
          {currentConfig.speedMultiplier}x speed factor
        </span>
      </div>

      {/* Unit Dropdown / Selector */}
      <div className="relative">
        <select
          id="vehicle-type-select"
          aria-label="Response Unit Type"
          value={selectedVehicle}
          onChange={(e) => onSelectVehicle(e.target.value as VehicleType)}
          className="w-full bg-[#172033] border border-[#263247] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#F8FAFC] focus:outline-hidden focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all appearance-none cursor-pointer"
        >
          {units.map((u) => (
            <option key={u.type} value={u.type} className="bg-[#111827] text-[#F8FAFC]">
              {u.label} — {u.desc}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94A3B8]">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
