import React from 'react';

interface MetricCardProps {
  id?: string;
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  };
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  label,
  value,
  unit,
  icon,
  badge,
  highlight = false,
}) => {
  const badgeClasses = {
    success: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
    info: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30',
    neutral: 'bg-[#263247] text-[#94A3B8] border-[#334155]',
  };

  return (
    <div
      id={id}
      className={`rounded-lg border px-2.5 py-2 transition-all ${
        highlight
          ? 'bg-[#1E293B]/70 border-[#38BDF8]/40 shadow-sm'
          : 'bg-[#172033] border-[#263247]'
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-semibold text-[#94A3B8] flex items-center gap-1.5 truncate">
          {icon}
          {label}
        </span>
        {badge && (
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${
              badgeClasses[badge.variant]
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-base font-bold text-[#F8FAFC] tracking-tight">{value}</span>
        {unit && <span className="text-[11px] font-medium text-[#94A3B8]">{unit}</span>}
      </div>
    </div>
  );
};

