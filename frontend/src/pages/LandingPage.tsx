import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Navigation,
  Shield,
  Zap,
  BrainCircuit,
  Truck,
  Clock,
  MapPin,
  CheckCircle,
  LocateFixed,
  Play,
  Gauge,
  Activity,
  Layers,
  Sparkles,
  GitBranch,
  Terminal,
  Cpu,
  Sparkles as SparklesIcon,
  CheckCircle as CheckCircleIcon,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'

const features = [
  {
    icon: BrainCircuit,
    title: 'Spatio-Temporal GNNs',
    tag: 'DCRNN Model',
    description: 'Forecasts road speeds and congestion propagation 60 minutes in advance using graph convolutions on real urban topologies.',
  },
  {
    icon: Zap,
    title: 'Dynamic Hybrid Recovery',
    tag: 'A* + DFS Detour',
    description: 'Recalculates blocked segments in milliseconds by combining global A* optimality with localized DFS graph recovery.',
  },
  {
    icon: Truck,
    title: 'Vehicle Physical Constraints',
    tag: 'Multi-Modal Logistics',
    description: 'Enforces height, weight, axle limits, and road access restrictions for delivery vans, emergency vehicles, and heavy trucks.',
  },
  {
    icon: Shield,
    title: 'Multi-Objective Risk Engine',
    tag: 'Explainable AI',
    description: 'Balances travel duration against weather hazards, road blockages, and historical accident risk with full factor breakdowns.',
  },
]

const benchmarkData = [
  { algorithm: 'Hybrid A* + DFS (Ours)', nodes: '128 nodes', time: '14.2 ms', detourCost: '+4.1%', status: 'Recommended' },
  { algorithm: 'Standard A*', nodes: '184 nodes', time: '19.8 ms', detourCost: '+8.6%', status: 'Sub-optimal' },
  { algorithm: 'Dijkstra / BFS', nodes: '1,420 nodes', time: '82.4 ms', detourCost: '+12.4%', status: 'Slow' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-brand-primary/30 selection:text-brand-primary overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full bg-brand-primary/10 blur-[140px]" />
        <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[130px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[700px] h-[700px] rounded-full bg-brand-secondary/10 blur-[160px]" />
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                SmartPath
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                v2.0 GNN
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <Link to="#features" className="hover:text-brand-primary transition-colors">Architecture</Link>
            <Link to="#benchmarks" className="hover:text-brand-primary transition-colors">Benchmarks</Link>
            <Link to="#capabilities" className="hover:text-brand-primary transition-colors">Capabilities</Link>
            <a
              href="https://github.com/ShreeshaN2006/SmartPath"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary transition-colors flex items-center gap-1.5"
            >
              <GitBranch className="w-4 h-4" /> GitHub
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/planner">
              <Button
                size="md"
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold shadow-lg shadow-brand-primary/30 gap-2 px-5 rounded-xl border border-brand-primary/30"
              >
                Launch Planner
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-12 pb-24 text-center max-w-7xl mx-auto">
          {/* Dynamic Background Glows */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full bg-brand-primary/10 blur-[140px]" />
            <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[130px]" />
            <div className="absolute bottom-[10%] left-[20%] w-[700px] h-[700px] rounded-full bg-brand-secondary/10 blur-[160px]" />
          </div>

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold mb-8 backdrop-blur-md shadow-inner">
            <SparklesIcon className="w-3.5 h-3.5 text-emerald-500" />
            <span>Spatio-Temporal Graph Neural Network + Dynamic DFS Recovery</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl font-black font-heading tracking-tight max-w-4xl mx-auto mb-8 leading-[1.08] text-neutral-900">
            Intelligent urban routing that <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">thinks ahead.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            SmartPath predicts traffic waves before they happen, calculates real-time risk scores, and navigates vehicles around road blockages in milliseconds.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16">
            <Link to="/planner" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/30 gap-2 border border-emerald-400/30 text-base">
                <Play className="w-4 h-4 fill-current" />
                Launch Interactive Map
              </Button>
            </Link>
            <a
              href="https://github.com/ShreeshaN2006/SmartPath"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="lg" className="w-full border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900 font-semibold px-6 py-4 rounded-2xl gap-2 text-base">
                <GitBranch className="w-4 h-4" />
                Star on GitHub
              </Button>
            </a>
          </div>

          {/* Interactive Hero Telemetry Showcase Mockup */}
          <div className="w-full max-w-5xl rounded-3xl p-1 bg-gradient-to-b from-brand-primary/10 via-neutral-100/50 to-transparent shadow-2xl relative">
            <div className="bg-white/95 backdrop-blur-md rounded-[22px] p-6 sm:p-8 relative overflow-hidden text-left">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-xs uppercase font-bold text-emerald-600">Live Simulated Corridor: Cubbon Park ➔ Koramangala</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200">Topology: OSMnx 1.9</span>
                  <span className="px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/30">DCRNN Speed: 42 km/h</span>
                </div>
              </div>

              {/* Cockpit Grid in Hero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-500 font-mono mb-1">OPTIMAL DISTANCE</p>
                  <p className="text-2xl sm:text-3xl font-black text-neutral-900 font-mono">5.28 <span className="text-xs text-neutral-500">km</span></p>
                  <p className="text-[11px] text-emerald-600 mt-1">✓ 18% lower risk vs fastest</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-500 font-mono mb-1">PREDICTED ETA</p>
                  <p className="text-2xl sm:text-3xl font-black text-brand-primary font-mono">9.3 <span className="text-xs text-neutral-500">min</span></p>
                  <p className="text-[11px] text-brand-primary mt-1">Live traffic adjusted</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-500 font-mono mb-1">DFS DETOUR TIME</p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">14.2 <span className="text-xs text-neutral-500">ms</span></p>
                  <p className="text-[11px] text-neutral-500 mt-1">Bypassing road blockage</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <p className="text-xs font-semibold text-neutral-500 font-mono mb-1">RELIABILITY INDEX</p>
                  <p className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">96.4<span className="text-xs text-neutral-500">%</span></p>
                  <p className="text-[11px] text-emerald-600 mt-1">High weather confidence</p>
                </div>
              </div>

              {/* Action Preview bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                  <span>Real GPS Positioning & Live 60fps Turn-by-Turn Guidance active</span>
                </div>
                <Link to="/planner" className="text-brand-primary hover:text-brand-secondary font-bold flex items-center gap-1">
                  Open in Interactive Map <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid: Core Intelligence Features */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-primary font-mono">
              ENGINEERING ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-neutral-900 mt-3 mb-4">
              Built on Next-Gen Graph AI
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg">
              Combining Deep Spatio-Temporal neural forecasting with ultra-fast heuristic graph search.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-neutral-200 hover:border-brand-primary/40 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <f.icon className="w-7 h-7 text-brand-primary" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-500">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3 font-heading">{f.title}</h3>
                <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Algorithm Benchmark Comparison Section */}
        <section id="benchmarks" className="py-24 bg-neutral-50/60 border-y border-neutral-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
                EMPIRICAL VALIDATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-heading text-neutral-900 mt-3 mb-4">
                Algorithm Performance Benchmarks
              </h2>
              <p className="text-neutral-600 text-sm sm:text-lg">
                Measured on Bangalore urban graph (10,482 edges) under real simulated road blockages.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left bg-white/80 backdrop-blur-xl rounded-3xl border border-neutral-200 overflow-hidden">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-mono uppercase tracking-wider text-neutral-500">
                    <th className="p-4 sm:p-6">Algorithm Engine</th>
                    <th className="p-4 sm:p-6">Nodes Expanded</th>
                    <th className="p-4 sm:p-6">Execution Time</th>
                    <th className="p-4 sm:p-6">Detour Path Cost</th>
                    <th className="p-4 sm:p-6">Operational Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm sm:text-base font-medium">
                  {benchmarkData.map((row, i) => (
                    <tr key={row.algorithm} className={i === 0 ? 'bg-brand-primary/5' : 'hover:bg-neutral-50 transition-colors'}>
                      <td className="p-4 sm:p-6 font-bold text-neutral-900 flex items-center gap-2">
                        {i === 0 && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                        {row.algorithm}
                      </td>
                      <td className="p-4 sm:p-6 font-mono text-neutral-500">{row.nodes}</td>
                      <td className="p-4 sm:p-6 font-mono text-neutral-500">{row.time}</td>
                      <td className="p-4 sm:p-6 font-mono text-neutral-500">{row.detourCost}</td>
                      <td className="p-4 sm:p-6">
                        <Badge variant={i === 0 ? 'success' : 'warning'}>
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Final CTA Strip */}
        <section className="py-24 max-w-5xl mx-auto px-6 text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 sm:p-14 border border-brand-primary/20 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-neutral-900 mb-6">
              Experience the Future of Route Intelligence
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Simulate deliveries, trigger real-time road blockages, and watch the dynamic DFS recovery engine reroute vehicles in real-time.
            </p>
            <Link to="/planner">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-base px-10 py-5 rounded-2xl shadow-2xl shadow-brand-primary/30 gap-2">
                Launch Live Simulator Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-12 px-6 bg-neutral-50 relative z-10 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-brand-primary" />
            <span className="font-bold text-neutral-900 text-sm">SmartPath</span>
            <span>— AI Delivery Route Optimization</span>
          </div>
          <p>© {new Date().getFullYear()} Shreesha N. Open source under ISC License.</p>
          <div className="flex gap-4">
            <a href="https://github.com/ShreeshaN2006/SmartPath" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">
              GitHub Repository
            </a>
            <Link to="/planner" className="hover:text-brand-primary transition-colors">
              Route Planner
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}