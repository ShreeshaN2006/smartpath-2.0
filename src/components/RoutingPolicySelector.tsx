import React from 'react';
import { Zap, ShieldCheck, Scale, Ban } from 'lucide-react';
import { RoutingStrategy } from '../types';

interface RoutingPolicySelectorProps {
  selectedStrategy: RoutingStrategy;
  onSelectStrategy: (strategy: RoutingStrategy) => void;
}

export const RoutingPolicySelector: React.FC<RoutingPolicySelectorProps> = ({
  selectedStrategy,
  onSelectStrategy,
}) => {
  const strategies: {
    type: RoutingStrategy;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: 'Fastest Route',
      label: 'Fastest Route',
      description: 'Prioritize minimum transit time via high-speed corridors',
      icon: <Zap className="w-3.5 h-3.5 text-[#2F5C93]" />,
    },
    {
      type: 'Safest Route',
      label: 'Safest Route',
      description: 'Avoid waterlogging zones, poorly lit cut-throughs & high-accident nodes',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />,
    },
    {
      type: 'Balanced: Time + Risk',
      label: 'Balanced: Time + Risk',
      description: 'Harmonizes transit efficiency with low collision / breakdown risks',
      icon: <Scale className="w-3.5 h-3.5 text-[#163359]" />,
    },
    {
      type: 'Avoid Blockages',
      label: 'Avoid Blockages',
      description: 'Force reroute around active roadworks and metro barricades',
      icon: <Ban className="w-3.5 h-3.5 text-[#C83616]" />,
    },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="routing-policy-select"
        className="text-xs font-semibold text-[#0B0A0C] flex items-center justify-between"
      >
        <span>Routing Strategy</span>
        <span className="text-[10px] text-[#64748B]">Multi-Objective</span>
      </label>

      <div className="relative">
        <select
          id="routing-policy-select"
          aria-label="Routing Strategy"
          value={selectedStrategy}
          onChange={(e) => onSelectStrategy(e.target.value as RoutingStrategy)}
          className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium text-[#0B0A0C] focus:outline-hidden focus:ring-2 focus:ring-[#2F5C93]/20 focus:border-[#2F5C93] transition-all appearance-none cursor-pointer"
        >
          {strategies.map((strat) => (
            <option key={strat.type} value={strat.type}>
              {strat.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#64748B]">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 px-1">
        {strategies.find((s) => s.type === selectedStrategy)?.icon}
        <span className="truncate">
          {strategies.find((s) => s.type === selectedStrategy)?.description}
        </span>
      </div>
    </div>
  );
};
