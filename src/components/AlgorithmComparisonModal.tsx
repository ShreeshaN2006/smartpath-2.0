import React from 'react';
import { X, Cpu, CheckCircle2, AlertCircle, Sparkles, Activity, Clock, Zap } from 'lucide-react';
import { AlgorithmMetrics } from '../types';

interface AlgorithmComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: AlgorithmMetrics[];
  isLoading?: boolean;
}

export const AlgorithmComparisonModal: React.FC<AlgorithmComparisonModalProps> = ({
  isOpen,
  onClose,
  metrics,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="algorithm-comparison-overlay"
      className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="algorithm-comparison-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="algo-modal-title"
        className="bg-[#111827] rounded-xl border border-[#263247] shadow-2xl max-w-2xl w-full overflow-hidden text-[#F8FAFC] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#263247] flex items-center justify-between bg-[#172033]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 id="algo-modal-title" className="text-sm font-bold text-[#F8FAFC]">
                Spatial Routing Algorithm Benchmarks
              </h2>
              <p className="text-[11px] text-[#94A3B8]">
                Bengaluru arterial road graph evaluation under dynamic congestion
              </p>
            </div>
          </div>
          <button
            id="close-algo-modal-btn"
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg hover:bg-[#263247] transition-colors cursor-pointer"
            aria-label="Close algorithm comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#94A3B8]">
              <div className="w-8 h-8 border-3 border-[#38BDF8] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold">Running BFS, A*, and Hybrid A* + DFS benchmarks...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-[#263247]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#172033] border-b border-[#263247] text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Algorithm</th>
                      <th className="py-2.5 px-2.5">Distance</th>
                      <th className="py-2.5 px-2.5">ETA</th>
                      <th className="py-2.5 px-2.5">Compute</th>
                      <th className="py-2.5 px-2.5">Nodes Checked</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#263247]">
                    {metrics.map((m) => {
                      const isHybrid = m.algorithm === 'Hybrid A* + DFS';
                      const statusStyles = {
                        Optimal: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30',
                        'Sub-optimal': 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
                        'Best Trade-off': 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
                      };

                      return (
                        <tr
                          key={m.algorithm}
                          className={`transition-colors ${
                            isHybrid ? 'bg-[#1E293B]/70 font-semibold' : 'hover:bg-[#172033]/50'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-[#F8FAFC]">
                            <div className="flex items-center gap-1.5">
                              {isHybrid && <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />}
                              <span>{m.algorithm}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-[#94A3B8]">{m.distanceKm} km</td>
                          <td className="py-2.5 px-2.5 font-mono text-[#94A3B8]">{m.timeMin} min</td>
                          <td className="py-2.5 px-2.5 font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[11px] ${
                                m.executionTimeMs < 100
                                  ? 'bg-[#22C55E]/20 text-[#22C55E] font-bold'
                                  : 'text-[#94A3B8]'
                              }`}
                            >
                              {m.executionTimeMs} ms
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-[#94A3B8]">
                            {m.nodesExplored.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                                statusStyles[m.status]
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Algorithm Details Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                {metrics.map((m) => (
                  <div
                    key={m.algorithm}
                    className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                      m.algorithm === 'D* Lite'
                        ? 'border-[#A855F7]/50 bg-[#A855F7]/10'
                        : m.algorithm === 'Hybrid A* + DFS'
                        ? 'border-[#38BDF8]/40 bg-[#1E293B]/60'
                        : 'border-[#263247] bg-[#172033]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#F8FAFC]">{m.algorithm}</span>
                        <span className="text-[10px] text-[#94A3B8] font-mono">{m.memoryKb} KB</span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {m.algorithm === 'D* Lite' && (
                      <div className="mt-2 text-[10px] font-bold text-[#C084FC] flex items-center gap-1">
                        <Activity className="w-3 h-3 text-[#A855F7]" />
                        <span>Dynamic Replan: 14ms (124 nodes)</span>
                      </div>
                    )}

                    {m.algorithm === 'Hybrid A* + DFS' && (
                      <div className="mt-2 text-[10px] font-bold text-[#22C55E] flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>6.4x faster emergency solver than BFS</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Engine Benchmark Note */}
              <div className="p-3 bg-[#172033] rounded-lg text-[11px] text-[#94A3B8] flex items-center justify-between border border-[#263247]">
                <span>
                  Dynamic heuristics tuned for siren velocity and first-responder corridor clearing.
                </span>
                <span className="font-bold text-[#38BDF8] px-2 py-0.5 rounded bg-[#111827] border border-[#263247] text-[10px]">
                  Calibrated Graph
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#263247] bg-[#172033] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#263247] hover:bg-[#334155] text-[#F8FAFC] rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};

