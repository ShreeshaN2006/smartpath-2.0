/**
 * AI Traffic Forecast Component
 * 
 * NOTE ON DCRNN MODEL INTEGRATION:
 * The data displayed here is simulated based on Bengaluru spatio-temporal road graphs.
 * Once the DCRNN (Diffusion Convolutional Recurrent Neural Network) PyTorch model is deployed
 * on Flask / FastAPI, connect via `getTrafficPrediction()` in `src/services/api.ts`.
 */

import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Activity, Clock, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { TrafficForecastData } from '../types';

interface TrafficForecastCardProps {
  forecast: TrafficForecastData;
}

export const TrafficForecastCard: React.FC<TrafficForecastCardProps> = ({ forecast }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      id="ai-traffic-forecast-card"
      className="rounded-xl border border-[#263247] bg-[#172033] p-3.5 shadow-md transition-all text-[#F8FAFC]"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-[#38BDF8]/15 flex items-center justify-center text-[#38BDF8]">
            <BrainCircuit className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
              <span>AI Traffic Forecast</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                DCRNN
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-md transition-colors cursor-pointer"
          title={isExpanded ? 'Collapse forecast details' : 'Expand forecast details'}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Grid stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#111827] border border-[#263247] rounded-lg p-2 flex flex-col justify-between">
          <span className="text-[10px] font-medium text-[#94A3B8]">Current Traffic</span>
          <span className="font-bold text-[#F8FAFC] flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            {forecast.currentTraffic}
          </span>
        </div>

        <div className="bg-[#111827] border border-[#263247] rounded-lg p-2 flex flex-col justify-between">
          <span className="text-[10px] font-medium text-[#94A3B8]">Predicted Traffic</span>
          <span className="font-bold text-[#EF4444] flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            {forecast.predictedTraffic}
          </span>
        </div>

        <div className="bg-[#111827] border border-[#263247] rounded-lg p-2 flex flex-col justify-between">
          <span className="text-[10px] font-medium text-[#94A3B8]">Predicted Avg Speed</span>
          <span className="font-bold text-[#38BDF8] mt-0.5 font-mono">
            {forecast.predictedAvgSpeedKmh} <span className="text-[10px] font-normal text-[#94A3B8]">km/h</span>
          </span>
        </div>

        <div className="bg-[#111827] border border-[#263247] rounded-lg p-2 flex flex-col justify-between">
          <span className="text-[10px] font-medium text-[#94A3B8]">Forecast Horizon</span>
          <span className="font-bold text-[#F8FAFC] mt-0.5 text-[11px] truncate">
            {forecast.forecastHorizon}
          </span>
        </div>
      </div>

      {/* Model Spec & Disclaimer */}
      <div className="mt-2.5 pt-2 border-t border-[#263247] flex items-center justify-between text-[10px] text-[#94A3B8]">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#38BDF8]" />
          Model: <strong className="text-[#F8FAFC] font-medium">{forecast.model}</strong>
        </span>
        <span className="text-[9px] bg-[#22C55E]/15 border border-[#22C55E]/30 px-1.5 py-0.5 rounded-sm text-[#22C55E] font-bold">
          {forecast.confidenceScore}% Acc.
        </span>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-[#263247] space-y-2 text-[11px]">
          <div>
            <span className="text-[10px] font-semibold text-[#F8FAFC] uppercase tracking-wider block mb-1">
              Bengaluru Bottlenecks (Next 24h Forecast)
            </span>
            <ul className="space-y-1">
              {forecast.corridorRiskHotspots.map((hotspot, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-[#CBD5E1] bg-[#111827] px-2 py-1 rounded border border-[#263247]/60">
                  <ShieldAlert className="w-3 h-3 text-[#EF4444] shrink-0" />
                  <span className="truncate text-[10.5px]">{hotspot}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[10px] text-[#94A3B8] italic bg-[#111827] border border-[#263247] p-2 rounded-md">
            Model trained on 8,936 real records across 16 Bengaluru corridors with lag features, weather codes, and D* Lite dynamic replanning.
          </p>
        </div>
      )}
    </div>
  );
};
