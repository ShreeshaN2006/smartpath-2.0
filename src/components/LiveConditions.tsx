import React from 'react';
import { Gauge, ShieldAlert, AlertTriangle } from 'lucide-react';
import { TrafficStatus } from '../types';

interface LiveConditionsProps {
  multiplier: number;
  onChangeMultiplier: (val: number) => void;
  activeObstaclesCount: number;
}

export const LiveConditions: React.FC<LiveConditionsProps> = ({
  multiplier,
  onChangeMultiplier,
  activeObstaclesCount,
}) => {
  let status: TrafficStatus = 'Normal';
  let badgeClasses = 'bg-[#172033] text-[#22C55E] border-[#22C55E]/40';
  let riskAssessment = 'Low Impedance';

  if (multiplier >= 2.3) {
    status = 'Severe';
    badgeClasses = 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50';
    riskAssessment = 'Gridlock / Critical Delay';
  } else if (multiplier >= 1.7) {
    status = 'Heavy';
    badgeClasses = 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50';
    riskAssessment = 'High Density Slowdowns';
  } else if (multiplier >= 1.2) {
    status = 'Moderate';
    badgeClasses = 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/50';
    riskAssessment = 'Moderate Delays';
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Live Conditions
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-[#F8FAFC]">
            {multiplier.toFixed(1)}x
          </span>
          <span
            id="traffic-status-badge"
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClasses}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Traffic Slider */}
      <div className="p-2.5 rounded-lg bg-[#172033] border border-[#263247] space-y-2">
        <div className="flex items-center justify-between text-xs text-[#94A3B8]">
          <span className="flex items-center gap-1.5 text-[#F8FAFC] font-semibold">
            <Gauge className="w-3.5 h-3.5 text-[#38BDF8]" />
            Congestion Multiplier
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8]">0.5x – 3.0x</span>
        </div>

        <input
          id="traffic-multiplier-slider"
          aria-label="Traffic Multiplier Slider"
          type="range"
          min="0.5"
          max="3.0"
          step="0.1"
          value={multiplier}
          onChange={(e) => onChangeMultiplier(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#263247] rounded-lg appearance-none cursor-pointer accent-[#38BDF8] focus:outline-hidden"
        />

        <div className="flex justify-between text-[10px] text-[#94A3B8] font-mono">
          <span>0.5x (Clear)</span>
          <span>1.0x (Norm)</span>
          <span>2.0x (Peak)</span>
          <span className="text-[#EF4444]">3.0x (Jam)</span>
        </div>
      </div>

      {/* Risk read-out */}
      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#172033] border border-[#263247] text-[11px]">
        <span className="text-[10px] text-[#94A3B8] flex items-center gap-1.5">
          <ShieldAlert className="w-3 h-3 text-[#F59E0B]" />
          Risk Sensitivity
        </span>
        <span className="font-semibold text-[#F8FAFC] truncate">{riskAssessment}</span>
      </div>

      {activeObstaclesCount > 0 && (
        <div className="p-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[11px] text-[#EF4444] flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{activeObstaclesCount} incident roadblock(s) actively being evaded.</span>
        </div>
      )}
    </div>
  );
};
