import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, ExternalLink, Radio } from 'lucide-react';
import { RouteResult } from '../types';

interface SharePanelProps {
  route: RouteResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SharePanel: React.FC<SharePanelProps> = ({ route, isOpen, onClose }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [detailsCopied, setDetailsCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  if (!isOpen || !route) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://smartpath.app';
  const shareUrl = `${currentOrigin}/?routeId=${route.id}&src=${encodeURIComponent(
    route.source.name
  )}&dst=${encodeURIComponent(route.destination.name)}&algo=${encodeURIComponent(route.algorithm)}`;

  const routeDetailsText = `SmartPath Emergency Dispatch:
Origin Station: ${route.source.name} (${route.source.area})
Incident Target: ${route.destination.name} (${route.destination.area})
ETA: ${route.estimatedTimeMin} mins (Base: ${route.baseTimeMin}m)
Distance: ${route.totalDistanceKm} km
Risk: ${route.riskLevel} | Corridor: ${route.routeStatus || 'Active'}
Assigned Unit: ${route.vehicle}
Algorithm: ${route.algorithm}
Dispatch Link: ${shareUrl}`;

  const copyToClipboard = async (text: string, type: 'link' | 'details') => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        if (type === 'link') {
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 2500);
          setStatusMessage('Dispatch URL copied to clipboard.');
        } else {
          setDetailsCopied(true);
          setTimeout(() => setDetailsCopied(false), 2500);
          setStatusMessage('Full dispatch manifest copied to clipboard.');
        }
      } else {
        setShowManualInput(true);
        setStatusMessage('Select and copy from the text field below:');
      }
    } catch (err) {
      console.warn('Clipboard write failed, showing manual input fallback:', err);
      setShowManualInput(true);
      setStatusMessage('Clipboard access denied. Please copy manually from the input below:');
    }
  };

  return (
    <div
      id="share-panel-container"
      aria-label="Route sharing panel"
      className="fixed top-20 right-4 sm:right-6 z-[500] pointer-events-none max-w-sm w-[92%] sm:w-80 transition-all duration-200"
    >
      <div
        id="share-panel-card"
        className="pointer-events-auto bg-[#111827]/95 backdrop-blur-md rounded-xl border border-[#263247] shadow-2xl p-4 transition-all text-[#F8FAFC]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#263247]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#F8FAFC]">Emergency Dispatch Link</h3>
              <p className="text-[10px] text-[#94A3B8]">Telemetry broadcast to crew</p>
            </div>
          </div>
          <button
            id="close-share-panel-btn"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[#172033] transition-colors cursor-pointer"
            aria-label="Close share panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Route Snapshot */}
        <div className="my-3 bg-[#172033] rounded-lg p-2.5 border border-[#263247] text-xs">
          <div className="flex items-center justify-between font-semibold text-[#F8FAFC]">
            <span className="truncate max-w-[120px]">{route.source.name.split(' ')[0]}</span>
            <span className="text-[#38BDF8] font-mono text-[10px]">⟶</span>
            <span className="truncate max-w-[120px]">{route.destination.name.split(' ')[0]}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mt-1">
            <span>{route.totalDistanceKm} km</span>
            <span>•</span>
            <span className="font-bold text-[#38BDF8]">{route.estimatedTimeMin} min ETA</span>
            <span>•</span>
            <span className="text-[#F8FAFC]">{route.vehicle}</span>
          </div>
        </div>

        {/* Share Link Input */}
        <div className="mb-3">
          <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
            Dispatch URL
          </label>
          <div className="flex items-center gap-1.5">
            <input
              id="share-url-input"
              type="text"
              readOnly
              value={shareUrl}
              onFocus={(e) => e.target.select()}
              className="flex-1 bg-[#172033] border border-[#263247] rounded-md px-2.5 py-1.5 text-[11px] text-[#F8FAFC] font-mono truncate focus:outline-hidden focus:border-[#38BDF8]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            id="copy-share-link-btn"
            onClick={() => copyToClipboard(shareUrl, 'link')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            {linkCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Link Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Dispatch Link</span>
              </>
            )}
          </button>

          <button
            id="copy-route-details-btn"
            onClick={() => copyToClipboard(routeDetailsText, 'details')}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-[#172033] hover:bg-[#263247] text-[#F8FAFC] border border-[#263247] rounded-lg text-xs font-medium transition-all cursor-pointer"
          >
            {detailsCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Manifest Copied</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>Copy Crew Manifest</span>
              </>
            )}
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            id="share-status-message"
            className="mt-2.5 p-2 bg-[#22C55E]/15 border border-[#22C55E]/30 rounded-md text-[10px] text-[#22C55E] font-semibold text-center"
          >
            {statusMessage}
          </div>
        )}

        <div className="mt-2 text-center text-[10px] text-[#94A3B8]">
          Non-blocking overlay: Map navigation remains active.
        </div>
      </div>
    </div>
  );
};

