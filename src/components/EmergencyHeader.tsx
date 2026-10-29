import React from 'react';
import {
  Shield,
  RotateCcw,
  Menu,
  Flame,
  Truck,
  AlertTriangle,
  Radio,
  Ambulance as AmbulanceIcon,
} from 'lucide-react';
import { ResponseMode } from '../types';

interface EmergencyHeaderProps {
  responseMode: ResponseMode;
  onSelectResponseMode: (mode: ResponseMode) => void;
  onReset: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeObstaclesCount: number;
}

export const EmergencyHeader: React.FC<EmergencyHeaderProps> = ({
  responseMode,
  onSelectResponseMode,
  onReset,
  onToggleSidebar,
  activeObstaclesCount,
}) => {
  const responseModes: { mode: ResponseMode; label: string; icon: React.ReactNode; color: string }[] = [
    {
      mode: 'Ambulance',
      label: 'Ambulance',
      icon: <AmbulanceIcon className="w-3.5 h-3.5" />,
      color: 'hover:border-[#EF4444] text-[#F8FAFC]',
    },
    {
      mode: 'Fire & Rescue',
      label: 'Fire & Rescue',
      icon: <Flame className="w-3.5 h-3.5" />,
      color: 'hover:border-[#F59E0B] text-[#F8FAFC]',
    },
    {
      mode: 'Police',
      label: 'Police',
      icon: <Shield className="w-3.5 h-3.5" />,
      color: 'hover:border-[#38BDF8] text-[#F8FAFC]',
    },
    {
      mode: 'Disaster Response',
      label: 'Disaster Response',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      color: 'hover:border-[#F59E0B] text-[#F8FAFC]',
    },
    {
      mode: 'Relief Vehicle',
      label: 'Relief Vehicle',
      icon: <Truck className="w-3.5 h-3.5" />,
      color: 'hover:border-[#22C55E] text-[#F8FAFC]',
    },
  ];

  return (
    <header
      id="smartpath-emergency-header"
      className="h-16 bg-[#080D18] border-b border-[#263247] px-3 sm:px-5 flex items-center justify-between z-30 shrink-0 select-none text-[#F8FAFC]"
    >
      {/* Left: Tactical Brand & Title */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle"
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] hover:bg-[#172033] rounded-lg border border-[#263247] transition-colors"
          aria-label="Toggle Mission Control drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#172033] border border-[#263247] flex items-center justify-center text-[#EF4444] shadow-sm relative">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#080D18]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight uppercase flex items-center gap-1.5">
                SmartPath
              </h1>
              <span
                id="system-operational-badge"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#172033] text-[#22C55E] border border-[#22C55E]/40 tracking-wide"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                SYSTEM OPERATIONAL
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] hidden sm:block tracking-wide">
              Emergency Route Intelligence • First-Responder Corridor System
            </p>
          </div>
        </div>
      </div>

      {/* Center: Response Mode Selector */}
      <nav
        aria-label="Emergency Response Mode"
        className="hidden xl:flex items-center bg-[#111827] p-1 rounded-lg border border-[#263247]"
      >
        {responseModes.map((rm) => {
          const isActive = responseMode === rm.mode;
          return (
            <button
              key={rm.mode}
              id={`response-mode-${rm.mode.toLowerCase().replace(/[\s&]+/g, '-')}`}
              onClick={() => onSelectResponseMode(rm.mode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#172033] text-[#38BDF8] border border-[#38BDF8]/60 shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#172033]/60 border border-transparent'
              }`}
            >
              <span className={isActive ? 'text-[#38BDF8]' : 'text-[#94A3B8]'}>{rm.icon}</span>
              <span>{rm.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile/Tablet dropdown for Response Mode */}
      <div className="xl:hidden flex items-center">
        <select
          id="mobile-response-mode-select"
          aria-label="Select Emergency Response Mode"
          value={responseMode}
          onChange={(e) => onSelectResponseMode(e.target.value as ResponseMode)}
          className="bg-[#111827] text-[#F8FAFC] text-xs font-semibold border border-[#263247] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#38BDF8]"
        >
          {responseModes.map((rm) => (
            <option key={rm.mode} value={rm.mode}>
              {rm.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Operational Status & Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {activeObstaclesCount > 0 && (
          <div
            id="active-hazards-indicator"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EF4444]/15 text-[#EF4444] text-xs font-bold border border-[#EF4444]/40"
          >
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
            <span className="hidden xs:inline">{activeObstaclesCount} Blockage(s)</span>
            <span className="xs:hidden">{activeObstaclesCount}</span>
          </div>
        )}

        <button
          id="back-to-home-btn"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#F8FAFC] bg-[#111827] hover:bg-[#172033] rounded-md border border-[#263247] hover:border-[#38BDF8] transition-colors cursor-pointer"
          title="Reset to default Bengaluru emergency response corridor"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>
      </div>
    </header>
  );
};
