import React from 'react';
import { Bike, Truck, Car, Container } from 'lucide-react';
import { VehicleType } from '../types';
import { VEHICLE_CONFIGS } from '../data/bengaluruData';

interface VehicleSelectorProps {
  selectedVehicle: VehicleType;
  onSelectVehicle: (vehicle: VehicleType) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedVehicle,
  onSelectVehicle,
}) => {
  const vehicleOptions: { type: VehicleType; icon: React.ReactNode; label: string; desc: string }[] = [
    {
      type: 'Delivery Bike',
      icon: <Bike className="w-4 h-4" />,
      label: 'Delivery Bike',
      desc: 'Rapid express, lane filtering in traffic',
    },
    {
      type: 'Mini Truck',
      icon: <Truck className="w-4 h-4" />,
      label: 'Mini Truck',
      desc: 'Intermediate freight (Tata Ace / Porter)',
    },
    {
      type: 'Delivery Van',
      icon: <Car className="w-4 h-4" />,
      label: 'Delivery Van',
      desc: 'Standard parcel fleet, weather sealed',
    },
    {
      type: 'Heavy Truck',
      icon: <Container className="w-4 h-4" />,
      label: 'Heavy Truck',
      desc: 'Large bulk cargo, avoids narrow crossways',
    },
  ];

  const currentConfig = VEHICLE_CONFIGS[selectedVehicle];

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="vehicle-type-select"
        className="text-xs font-semibold text-[#0B0A0C] flex items-center justify-between"
      >
        <span>Vehicle Configuration</span>
        <span className="text-[10px] font-normal text-[#64748B]">
          Speed Factor: {currentConfig.speedMultiplier}x
        </span>
      </label>

      <div className="relative">
        <select
          id="vehicle-type-select"
          aria-label="Vehicle Configuration"
          value={selectedVehicle}
          onChange={(e) => onSelectVehicle(e.target.value as VehicleType)}
          className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium text-[#0B0A0C] focus:outline-hidden focus:ring-2 focus:ring-[#2F5C93]/20 focus:border-[#2F5C93] transition-all appearance-none cursor-pointer"
        >
          {vehicleOptions.map((opt) => (
            <option key={opt.type} value={opt.type}>
              {opt.label} ({opt.desc})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748B]">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] bg-[#F5F7FA] px-2.5 py-1.5 rounded-lg border border-[#E2E8F0]/60">
        <div className="text-[#2F5C93]">
          {vehicleOptions.find((v) => v.type === selectedVehicle)?.icon}
        </div>
        <span className="truncate">{currentConfig.accessRestrictions[0]}</span>
      </div>
    </div>
  );
};
