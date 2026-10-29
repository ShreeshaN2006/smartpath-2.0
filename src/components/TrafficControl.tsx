import React from 'react';
import { Gauge } from 'lucide-react';
import { TrafficStatus } from '../types';

interface TrafficControlProps {
  multiplier: number;
  onChangeMultiplier: (val: number) => void;
}

export const TrafficControl: React.FC<TrafficControlProps> = ({
  multiplier,
  onChangeMultiplier,
}) => {
  let status: TrafficStatus = 'Normal';
  let badgeClasses = 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]';

  if (multiplier >= 2.3) {
    status = 'Severe';
    badgeClasses = 'bg-[#FEE2E2] text-[#C83616] border-[#FECACA]';
  } else if (multiplier >= 1.7) {
    status = 'Heavy';
    badgeClasses = 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
  } else if (multiplier >= 1.2) {
    status = 'Moderate';
    badgeClasses = 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]';
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white border border-[#E2E8F0] p-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-[#2F5C93]" />
          <span className="text-xs font-semibold text-[#0B0A0C]">Traffic Multiplier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-[#0B0A0C]">
            {multiplier.toFixed(1)}x
          </span>
          <span
            id="traffic-status-badge"
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeClasses}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="relative pt-1">
        <input
          id="traffic-multiplier-slider"
          aria-label="Traffic Multiplier Slider"
          type="range"
          min="0.5"
          max="3.0"
          step="0.1"
          value={multiplier}
          onChange={(e) => onChangeMultiplier(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#2F5C93] focus:outline-hidden"
        />
        <div className="flex justify-between text-[10px] text-[#64748B] mt-1 font-mono">
          <span>0.5x (Free flow)</span>
          <span>1.0x</span>
          <span>2.0x</span>
          <span>3.0x (Gridlock)</span>
        </div>
      </div>
    </div>
  );
};
