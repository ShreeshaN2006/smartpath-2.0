import React, { useState, useMemo } from 'react';
import {
  Clock,
  Compass,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Share2,
  Route,
  ChevronDown,
  ChevronUp,
  Layers,
  Siren,
  CheckCircle2,
  AlertTriangle,
  CornerUpLeft,
  CornerUpRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  GitMerge,
  Flag,
  Navigation,
  Copy,
  Check,
  Milestone,
  ListOrdered,
  SlidersHorizontal,
} from 'lucide-react';
import { RouteResult, NavigationStep, TurnManeuver } from '../types';
import { MetricCard } from './MetricCard';
import { generateNavigationSteps } from '../services/api';

interface RouteSummaryProps {
  route: RouteResult;
  onOpenShare: () => void;
  showAlternativePath: boolean;
  onToggleAlternativePath: () => void;
}

export const RouteSummary: React.FC<RouteSummaryProps> = ({
  route,
  onOpenShare,
  showAlternativePath,
  onToggleAlternativePath,
}) => {
  const [isStepsOpen, setIsStepsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'hazards'>('all');
  const [copiedSteps, setCopiedSteps] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);

  // Derive turn-by-turn steps, ensuring a robust list is always available
  const stepsList: NavigationStep[] = useMemo(() => {
    if (route.steps && route.steps.length > 0) {
      return route.steps;
    }
    return generateNavigationSteps(
      route.source,
      route.destination,
      route.waypoints || [],
      [],
      route.totalDistanceKm,
      route.estimatedTimeMin,
      route.vehicle
    );
  }, [route]);

  const hazardStepsCount = useMemo(() => {
    return stepsList.filter((s) => s.isHazardBypass || s.maneuver === 'hazard-avoid' || s.maneuver === 'waypoint').length;
  }, [stepsList]);

  const filteredSteps = useMemo(() => {
    if (activeFilter === 'hazards') {
      return stepsList.filter(
        (s) => s.isHazardBypass || s.maneuver === 'hazard-avoid' || s.maneuver === 'waypoint'
      );
    }
    return stepsList;
  }, [stepsList, activeFilter]);

  const handleCopySteps = () => {
    const text = stepsList
      .map(
        (s) =>
          `${s.stepNumber}. [${s.roadName}] ${s.instruction} (${s.distanceKm} km • ~${s.timeMin}m)${
            s.tacticalNote ? ` - Note: ${s.tacticalNote}` : ''
          }`
      )
      .join('\n');

    navigator.clipboard.writeText(
      `SMARTPATH DISPATCH ROUTE — ${route.source.name} TO ${route.destination.name}\nTotal: ${route.totalDistanceKm} km | ETA: ${route.estimatedTimeMin} min | Unit: ${route.vehicle}\n\nTURN-BY-TURN NAVIGATION STEPS:\n${text}`
    );
    setCopiedSteps(true);
    setTimeout(() => setCopiedSteps(false), 2200);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Clear':
        return { text: 'Optimal Corridor', variant: 'success' as const, color: 'text-[#22C55E]' };
      case 'Congested':
        return { text: 'Congestion Bypass Active', variant: 'warning' as const, color: 'text-[#F59E0B]' };
      case 'High Risk':
        return { text: 'Caution: Hazard Zones', variant: 'danger' as const, color: 'text-[#EF4444]' };
      default:
        return { text: 'En Route', variant: 'info' as const, color: 'text-[#38BDF8]' };
    }
  };

  const getRiskBadge = (risk: RouteResult['riskLevel']) => {
    switch (risk) {
      case 'Low':
        return { text: 'Low Hazard', variant: 'success' as const };
      case 'Moderate':
        return { text: 'Moderate Risk', variant: 'warning' as const };
      case 'High':
        return { text: 'High Risk Sector', variant: 'danger' as const };
    }
  };

  const getManeuverIcon = (maneuver: TurnManeuver) => {
    switch (maneuver) {
      case 'depart':
        return <Navigation className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'turn-left':
        return <CornerUpLeft className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'turn-right':
        return <CornerUpRight className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'slight-left':
        return <ArrowUpLeft className="w-3.5 h-3.5 text-[#60A5FA]" />;
      case 'slight-right':
        return <ArrowUpRight className="w-3.5 h-3.5 text-[#60A5FA]" />;
      case 'straight':
        return <ArrowUp className="w-3.5 h-3.5 text-[#60A5FA]" />;
      case 'merge':
        return <GitMerge className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'hazard-avoid':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />;
      case 'waypoint':
        return <Flag className="w-3.5 h-3.5 text-[#A855F7]" />;
      case 'arrive':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />;
      default:
        return <ArrowUp className="w-3.5 h-3.5 text-[#60A5FA]" />;
    }
  };

  const getManeuverBadgeColor = (maneuver: TurnManeuver, isHazard?: boolean) => {
    if (isHazard || maneuver === 'hazard-avoid') {
      return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
    }
    if (maneuver === 'arrive') {
      return 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30';
    }
    if (maneuver === 'waypoint') {
      return 'bg-[#A855F7]/15 text-[#C084FC] border-[#A855F7]/30';
    }
    if (maneuver === 'depart') {
      return 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30';
    }
    return 'bg-[#172033] text-[#94A3B8] border-[#263247]';
  };

  const statusInfo = getStatusBadge(route.routeStatus);

  return (
    <div
      id="floating-route-summary-card"
      className={`bg-[#111827]/95 backdrop-blur-md rounded-xl border border-[#263247] shadow-2xl transition-all w-full text-[#F8FAFC] ${
        isCollapsed ? 'px-3.5 py-3' : 'p-3.5'
      }`}
    >
      {/* Tactical Header bar */}
      <div
        className={`flex items-center justify-between ${
          isCollapsed ? '' : 'pb-2.5 border-b border-[#263247]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                statusInfo.variant === 'success'
                  ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
                  : statusInfo.variant === 'warning'
                  ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                  : 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
              }`}
            >
              {statusInfo.text}
            </span>
            <span className="text-[11px] text-[#94A3B8] font-mono truncate max-w-[170px]">
              {route.source.name.split(' ')[0]} → {route.destination.name.split(' ')[0]}
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#F8FAFC] mt-1 flex items-center gap-1.5">
            <Route className="w-4 h-4 text-[#38BDF8]" />
            <span>Emergency Route Intelligence</span>
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="open-share-panel-btn"
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Dispatch</span>
          </button>

          <button
            id="toggle-route-summary-btn"
            type="button"
            onClick={() => setIsCollapsed((v) => !v)}
            aria-expanded={!isCollapsed}
            title={isCollapsed ? 'Expand route summary' : 'Collapse route summary'}
            className="p-1.5 rounded-lg border border-[#263247] bg-[#172033] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#38BDF8]/50 transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {isCollapsed ? (
        /* Compact dispatch strip: key numbers only, map stays visible */
        <div className="flex items-center gap-3 pt-2.5 text-xs">
          <span className="font-mono font-bold text-[#38BDF8] whitespace-nowrap">
            {route.estimatedTimeMin} min
          </span>
          <span className="font-mono text-[#94A3B8] whitespace-nowrap">
            {route.totalDistanceKm} km
          </span>
          <span className="flex-1" />
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${
              route.blockagesAvoided > 0
                ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                : 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
            }`}
          >
            {route.blockagesAvoided > 0
              ? `${route.blockagesAvoided} detour${route.blockagesAvoided !== 1 ? 's' : ''}`
              : 'Clear'}
          </span>
        </div>
      ) : (
        <>
      {/* Grid of Key Emergency Metrics */}
      <div className="grid grid-cols-2 gap-2 my-2.5">
        <MetricCard
          id="metric-est-time"
          label="Estimated ETA"
          value={route.estimatedTimeMin}
          unit="min"
          icon={<Clock className="w-3.5 h-3.5 text-[#38BDF8]" />}
          highlight={true}
          badge={{
            text: route.sirenAssistMinutesSaved
              ? `-${route.sirenAssistMinutesSaved}m siren adv.`
              : route.estimatedTimeMin <= route.baseTimeMin
              ? 'Rapid transit'
              : `+${route.estimatedTimeMin - route.baseTimeMin}m heavy traffic`,
            variant: route.sirenAssistMinutesSaved ? 'success' : route.estimatedTimeMin <= route.baseTimeMin ? 'success' : 'warning',
          }}
        />

        <MetricCard
          id="metric-total-distance"
          label="Total Distance"
          value={route.totalDistanceKm}
          unit="km"
          icon={<Compass className="w-3.5 h-3.5 text-[#60A5FA]" />}
        />

        <MetricCard
          id="metric-risk-level"
          label="Corridor Risk"
          value={route.riskLevel}
          icon={route.riskLevel === 'High' ? <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" /> : <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />}
          badge={getRiskBadge(route.riskLevel)}
        />

        <MetricCard
          id="metric-traffic-status"
          label="Traffic State"
          value={route.trafficCondition}
          icon={<Zap className="w-3.5 h-3.5 text-[#F59E0B]" />}
          badge={{
            text: route.trafficCondition,
            variant: route.trafficCondition === 'Normal' ? 'success' : route.trafficCondition === 'Moderate' ? 'info' : 'danger',
          }}
        />
      </div>

      {/* Dispatch Telemetry bar with D* Lite Real-time metrics */}
      <div className="bg-[#172033] rounded-lg px-2 py-2 border border-[#263247] grid grid-cols-4 gap-2 text-center text-xs mb-2.5">
        <div>
          <span className="text-[10px] text-[#94A3B8] block font-medium">Engine</span>
          <span className="font-semibold text-[#F8FAFC] text-[11px] truncate block" title={route.algorithm}>
            {route.algorithm.startsWith('D*') ? 'D* Lite' : 'Hybrid A*'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#94A3B8] block font-medium">Replan</span>
          <span className="font-mono font-bold text-[#A855F7] text-[11px] block">
            {route.replanningLatencyMs ? `${route.replanningLatencyMs} ms` : '< 1 ms'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#94A3B8] block font-medium">D* Nodes</span>
          <span className="font-mono text-[#38BDF8] text-[11px] block">
            {route.incrementalUpdatesCount || 12}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#94A3B8] block font-medium">Hazards</span>
          <span className="font-bold text-[#22C55E] text-[11px] block">
            {route.blockagesAvoided}
          </span>
        </div>
      </div>
      {/* Multi-Route Comparative Card (Primary vs Secondary Alternative Corridor) */}
      <div className="bg-[#172033] rounded-lg p-2 border border-[#263247] mb-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] pb-1 border-b border-[#263247]">
          <span className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5 text-[#38BDF8]" />
            Multi-Route Corridors Available
          </span>
          <span className="text-[10px] text-[#94A3B8]">2 Routes Evaluated</span>
        </div>

        {/* Primary Corridor Option */}
        <div className="flex items-center justify-between bg-[#111827] px-2.5 py-1.5 rounded border border-[#38BDF8]/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] ring-2 ring-[#38BDF8]/40 shrink-0" />
            <div>
              <span className="font-bold text-[11px] text-[#F8FAFC] block">Primary Emergency Corridor</span>
              <span className="text-[10px] text-[#22C55E] font-medium">Optimal Priority Route • Clear</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-xs text-[#38BDF8]">{route.estimatedTimeMin} min</span>
            <span className="text-[10px] text-[#94A3B8] block">{route.totalDistanceKm} km</span>
          </div>
        </div>

        {/* Secondary Alternative Corridor Option */}
        <div
          onClick={onToggleAlternativePath}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors cursor-pointer ${
            showAlternativePath
              ? 'bg-[#F59E0B]/15 border-[#F59E0B]/50'
              : 'bg-[#111827] border-[#263247] hover:border-[#F59E0B]/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-[#F59E0B]/40 shrink-0" />
            <div>
              <span className="font-bold text-[11px] text-[#F8FAFC] block">Secondary Arterial Bypass</span>
              <span className="text-[10px] text-[#F59E0B] font-medium">
                {showAlternativePath ? 'Displayed on Map (Amber)' : 'Click to preview on map'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-xs text-[#F59E0B]">
              {route.alternativeTimeMin || Math.round(route.estimatedTimeMin * 1.15)} min
            </span>
            <span className="text-[10px] text-[#94A3B8] block">
              {route.alternativeDistanceKm || Number((route.totalDistanceKm * 1.18).toFixed(1))} km
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 gap-2 border-t border-[#263247]">
        {/* Secondary Alternative Path Toggle */}
        <button
          id="toggle-alternative-route-btn"
          onClick={onToggleAlternativePath}
          className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            showAlternativePath
              ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40'
              : 'bg-[#172033] text-[#94A3B8] border-[#263247] hover:text-[#F8FAFC]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showAlternativePath ? 'Hide Secondary' : 'Show Secondary'}</span>
        </button>

        {/* Steps Dropdown Button */}
        <button
          id="steps-dropdown-button"
          onClick={() => setIsStepsOpen(!isStepsOpen)}
          aria-expanded={isStepsOpen}
          aria-haspopup="listbox"
          className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            isStepsOpen
              ? 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8] shadow-sm'
              : 'bg-[#172033] text-[#F8FAFC] border-[#263247] hover:border-[#38BDF8]/50 hover:bg-[#1E293B]'
          }`}
        >
          <Milestone className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Steps</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#38BDF8]/25 text-[#38BDF8] font-mono font-bold">
            {stepsList.length}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isStepsOpen ? 'rotate-180 text-[#38BDF8]' : 'text-[#94A3B8]'
            }`}
          />
        </button>
      </div>

      {/* 'Steps' Turn-by-Turn Navigation Dropdown Panel */}
      {isStepsOpen && (
        <div
          id="turn-by-turn-steps-dropdown"
          className="mt-3 pt-3 border-t border-[#263247] flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Dropdown Header: Navigation Meta, Copy & Filter Controls */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] font-bold text-[#F8FAFC] uppercase tracking-wider">
                Turn-by-Turn Navigation
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="copy-steps-btn"
                onClick={handleCopySteps}
                title="Copy all steps to clipboard"
                className="text-[10px] px-2 py-1 bg-[#172033] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263247] rounded flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedSteps ? (
                  <>
                    <Check className="w-3 h-3 text-[#22C55E]" />
                    <span className="text-[#22C55E] font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#38BDF8]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Filter Tabs for Navigation Steps */}
          <div className="flex items-center justify-between bg-[#172033] p-1 rounded-lg border border-[#263247] text-[10px]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-1 rounded font-medium transition-colors cursor-pointer text-center ${
                activeFilter === 'all'
                  ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              All Steps ({stepsList.length})
            </button>
            {hazardStepsCount > 0 && (
              <button
                onClick={() => setActiveFilter('hazards')}
                className={`flex-1 py-1 rounded font-medium transition-colors cursor-pointer text-center ${
                  activeFilter === 'hazards'
                    ? 'bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/40 font-semibold'
                    : 'text-[#94A3B8] hover:text-[#EF4444]'
                }`}
              >
                Hazards & Checkpoints ({hazardStepsCount})
              </button>
            )}
          </div>

          {/* Turn-by-Turn Steps List (Scrollable timeline) */}
          <div className="max-h-64 sm:max-h-72 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
            {filteredSteps.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#94A3B8]">
                No specific hazard bypasses on this direct segment.
              </div>
            ) : (
              <div className="relative border-l border-[#263247] ml-2.5 space-y-3 pt-1">
                {filteredSteps.map((step, idx) => {
                  const isSelected = selectedStepIndex === idx;
                  const isLast = idx === filteredSteps.length - 1;

                  return (
                    <div
                      key={step.id || idx}
                      onClick={() => setSelectedStepIndex(isSelected ? null : idx)}
                      className={`relative pl-5 group cursor-pointer transition-all ${
                        isSelected ? 'opacity-100' : 'opacity-95 hover:opacity-100'
                      }`}
                    >
                      {/* Timeline Node Icon */}
                      <div
                        className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          step.isHazardBypass || step.maneuver === 'hazard-avoid'
                            ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444] shadow-xs'
                            : step.maneuver === 'arrive'
                            ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
                            : step.maneuver === 'waypoint'
                            ? 'bg-[#A855F7]/20 border-[#A855F7] text-[#C084FC]'
                            : step.maneuver === 'depart'
                            ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8]'
                            : 'bg-[#172033] border-[#38BDF8]/50 text-[#60A5FA]'
                        }`}
                      >
                        {getManeuverIcon(step.maneuver)}
                      </div>

                      {/* Step Card Content */}
                      <div
                        className={`p-2.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-[#172033] border-[#38BDF8]/60 shadow-md ring-1 ring-[#38BDF8]/40'
                            : step.isHazardBypass
                            ? 'bg-[#EF4444]/10 border-[#EF4444]/30'
                            : 'bg-[#172033]/80 border-[#263247] hover:border-[#38BDF8]/40 hover:bg-[#172033]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5 mb-1">
                          {/* Maneuver & Road Name */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border font-mono ${getManeuverBadgeColor(
                                step.maneuver,
                                step.isHazardBypass
                              )}`}
                            >
                              {step.maneuver.replace('-', ' ')}
                            </span>
                            <span className="text-[11px] font-semibold text-[#F8FAFC] truncate max-w-[190px]">
                              {step.roadName}
                            </span>
                          </div>

                          {/* Step Distance and Time Pill */}
                          <div className="text-[10px] font-mono text-[#94A3B8] shrink-0 bg-[#0B111E] px-1.5 py-0.5 rounded border border-[#263247]">
                            <span className="text-[#38BDF8] font-bold">{step.distanceKm}</span> km • ~
                            <span className="text-[#F8FAFC]">{step.timeMin}</span>m
                          </div>
                        </div>

                        {/* Instruction Text */}
                        <p className="text-xs text-[#F1F5F9] leading-snug font-normal">
                          {step.instruction}
                        </p>

                        {/* Tactical Note / Hazard Warning */}
                        {step.tacticalNote && (
                          <div
                            className={`mt-1.5 text-[10px] px-2 py-1 rounded flex items-center gap-1.5 font-medium ${
                              step.isHazardBypass || step.maneuver === 'hazard-avoid'
                                ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                                : 'bg-[#0B111E]/70 text-[#94A3B8] border border-[#263247]'
                            }`}
                          >
                            {step.isHazardBypass ? (
                              <AlertTriangle className="w-3 h-3 text-[#EF4444] shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3 text-[#22C55E] shrink-0" />
                            )}
                            <span className="truncate">{step.tacticalNote}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Dropdown Footer */}
          <div className="text-[10px] text-[#94A3B8] bg-[#172033] p-2 rounded-lg border border-[#263247] flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Siren className="w-3.5 h-3.5 text-[#EF4444] shrink-0 animate-pulse" />
              <span className="truncate">
                Unit: <strong className="text-[#F8FAFC]">{route.vehicle}</strong> • Green wave signal clearance
              </span>
            </div>
            <button
              onClick={() => setIsStepsOpen(false)}
              className="text-[#38BDF8] hover:text-[#60A5FA] font-semibold text-[10px] px-1.5 py-0.5 rounded hover:bg-[#0B111E] transition-colors cursor-pointer ml-2 shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};


