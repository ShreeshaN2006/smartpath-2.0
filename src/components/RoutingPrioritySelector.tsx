import React from 'react';
import { Zap, ShieldCheck, Scale, Ban } from 'lucide-react';
import { RoutingStrategy } from '../types';

interface RoutingPrioritySelectorProps {
  strategy: RoutingStrategy;
  onChangeStrategy: (strategy: RoutingStrategy) => void;
}

export const RoutingPrioritySelector: React.FC<RoutingPrioritySelectorProps> = ({
  strategy,
  onChangeStrategy,
}) => {
  const priorities: {
    value: RoutingStrategy;
    label: string;
    icon: React.ReactNode;
    explanation: string;
  }[] = [
    {
      value: 'Fastest Response',
      label: 'Fastest Response',
      icon: <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />,
      explanation: 'Prioritizes maximum velocity & continuous emergency arterial corridors.',
    },
    {
      value: 'Safest Route',
      label: 'Safest Route',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />,
      explanation: 'Avoids complex multi-tier intersections, flooded bottlenecks & high-risk zones.',
    },
    {
      value: 'Balanced: Time + Risk',
      label: 'Balanced: Time + Risk',
      icon: <Scale className="w-3.5 h-3.5 text-[#F59E0B]" />,
      explanation: 'Optimizes dynamic cost function trading off peak traffic delay against incident hazard.',
    },
    {
      value: 'D* Lite Dynamic Replan',
      label: 'D* Lite Dynamic Replan',
      icon: <Zap className="w-3.5 h-3.5 text-[#A855F7]" />,
      explanation: 'Incremental heuristic search: instantly replans around dynamic roadblocks and congestion.',
    },
    {
      value: 'Avoid Blocked Roads',
      label: 'Avoid Blocked Roads',
      icon: <Ban className="w-3.5 h-3.5 text-[#EF4444]" />,
      explanation: 'Strict hard-barrier constraint: reroutes 100% around reported road closures.',
    },
  ];

  // Map legacy strategy names if needed
  const normalizedStrategy =
    strategy === 'Fastest Route'
      ? 'Fastest Response'
      : strategy === 'Avoid Blockages'
      ? 'Avoid Blocked Roads'
      : strategy;

  const current = priorities.find((p) => p.value === normalizedStrategy) || priorities[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
          Routing Policy & Algorithm
        </span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
          normalizedStrategy === 'D* Lite Dynamic Replan'
            ? 'bg-[#A855F7]/20 text-[#C084FC] border-[#A855F7]/40 animate-pulse'
            : 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
        }`}>
          {normalizedStrategy === 'D* Lite Dynamic Replan' ? '⚡ D* LITE ACTIVE' : 'ALGO: HYBRID A*'}
        </span>
      </div>

      <div className="relative">
        <select
          id="routing-policy-select"
          aria-label="Routing Priority Policy"
          value={normalizedStrategy}
          onChange={(e) => onChangeStrategy(e.target.value as RoutingStrategy)}
          className="w-full bg-[#172033] border border-[#263247] rounded-lg px-3 py-2 text-xs font-semibold text-[#F8FAFC] focus:outline-hidden focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all appearance-none cursor-pointer"
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value} className="bg-[#111827] text-[#F8FAFC]">
              {p.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94A3B8]">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* Concise explanation box */}
      <div className="p-2.5 rounded-lg bg-[#172033] border border-[#263247] text-[11px] text-[#94A3B8] flex items-start gap-2">
        <div className="mt-0.5 shrink-0">{current.icon}</div>
        <p className="leading-relaxed">{current.explanation}</p>
      </div>
    </div>
  );
};
