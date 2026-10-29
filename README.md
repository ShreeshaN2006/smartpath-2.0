<div align="center">

# 🚑 SmartPath — AI-Powered Emergency Route Optimization

### Real-Time Intelligent Routing for Bengaluru Emergency Services

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](#)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google&logoColor=white)](#)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet&logoColor=white)](#)

<br/>

**SmartPath** is an AI-powered emergency dispatch and route optimization prototype built for Bengaluru.  
It uses the **D\* Lite pathfinding algorithm** with real-time hazard avoidance, Gemini AI traffic prediction, and multi-corridor route comparison to get emergency vehicles to their destination faster.

</div>

---

## 🚀 Quick Start (Run in 3 Steps)

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |

### Step 1 — Clone & Install

```bash
git clone https://github.com/ShreeshaN2006/smartpath-2.0.git
cd smartpath-2.0
npm install
```

### Step 2 — Configure Environment (optional)

Copy the example env file and add your API keys:

```bash
cp .env.example .env          # macOS / Linux
Copy-Item .env.example .env   # Windows (PowerShell)
```

Then edit `.env` and set your keys:

```env
# Optional — powers Gemini AI traffic predictions (get yours at https://aistudio.google.com/apikey)
GEMINI_API_KEY="your-gemini-api-key-here"

# Optional — enables the Google Maps satellite view
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-key-here"
```

> **Note:** The app works without API keys using the built-in **Leaflet/OpenStreetMap** fallback and pre-trained traffic model data. API keys unlock Gemini AI predictions and Google Maps satellite view.

### Step 3 — Run the App

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📦 All Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build optimized production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove `dist/` and `server.js` |

---

## 🏗️ Project Architecture

```
smartpath-2.0/
├── public/                          # Static assets
├── src/
│   ├── App.tsx                      # Main application — state management & orchestration
│   ├── main.tsx                     # React entry point
│   ├── index.css                    # Global styles (Tailwind CSS v4)
│   ├── types.ts                     # TypeScript type definitions
│   ├── components/
│   │   ├── Header.tsx               # Top navigation bar
│   │   ├── Sidebar.tsx              # Left panel — route config & controls
│   │   ├── MapView.tsx              # Leaflet/OSM interactive map
│   │   ├── GoogleMapView.tsx        # Google Maps satellite view (optional)
│   │   ├── RouteSummary.tsx         # Route result card — metrics, steps, corridors
│   │   ├── LocationInput.tsx        # Source/destination landmark picker
│   │   ├── ResponseUnitSelector.tsx # Emergency unit type selector
│   │   ├── VehicleSelector.tsx      # Vehicle type picker
│   │   ├── RoutingPolicySelector.tsx    # Routing strategy selector
│   │   ├── RoutingPrioritySelector.tsx  # Priority mode selector
│   │   ├── RouteTargetControls.tsx  # Waypoint & blocked road controls
│   │   ├── MissionControl.tsx       # Dispatch action buttons
│   │   ├── LiveConditions.tsx       # Real-time traffic conditions panel
│   │   ├── TrafficForecastCard.tsx  # AI traffic predictions
│   │   ├── MetricCard.tsx           # Reusable metric display card
│   │   ├── EmergencyHeader.tsx      # Emergency mode header bar
│   │   ├── TrafficControl.tsx       # Traffic signal controls
│   │   ├── SharePanel.tsx           # Share/export functionality
│   │   ├── AlgorithmComparisonModal.tsx # A* vs D* Lite comparison
│   │   └── Notification.tsx         # Toast notification system
│   ├── data/
│   │   ├── bengaluruData.ts         # Bengaluru landmarks & bottleneck presets
│   │   └── trainedTrafficModel.json # Pre-trained traffic prediction model
│   └── services/
│       ├── api.ts                   # Gemini AI & routing API service layer
│       └── dstarLite.ts             # D* Lite pathfinding algorithm engine
├── .env.example                     # Environment variable template
├── package.json                     # Dependencies & scripts
├── vite.config.ts                   # Vite build configuration
├── tsconfig.json                    # TypeScript configuration
├── train_model.py                   # Python script for traffic model training
├── smartpath_traffic_model_ready.csv    # Training dataset
├── smartpath_traffic_sequence_ready.csv # Sequence training data
├── smartpath_training_manifest.csv      # Training manifest
└── traffic_nodes.csv                    # Bengaluru traffic node data
```

---

## ✨ Key Features

### 🧭 D\* Lite Pathfinding Engine
- Incremental replanning algorithm that efficiently recalculates routes when conditions change
- Real-time hazard detection and blockage avoidance
- Sub-millisecond replanning latency

### 🛣️ Multi-Route Corridor Comparison
- Primary emergency corridor with optimal priority routing
- Secondary arterial bypass with one-click map preview
- Side-by-side time/distance comparison

### 🤖 Gemini AI Integration
- AI-powered traffic density prediction
- Natural language route reasoning
- Smart algorithm selection

### 🗺️ Dual Map Support
- **Leaflet/OpenStreetMap** — works out of the box, no API key needed
- **Google Maps Satellite** — optional premium view with API key

### 🚨 Emergency Vehicle Types
- Ambulance, Fire Engine, Police, Disaster Response
- Vehicle-specific routing priorities and signal clearance

### 📊 Dispatch Telemetry
- Navigation engine metrics
- Replanning latency monitoring
- Node expansion counts
- Hazard evasion statistics

### 📋 Turn-by-Turn Navigation
- Detailed step-by-step directions
- Maneuver-type badges (straight, turn, merge, hazard-avoid)
- Tactical notes and hazard warnings
- Copy-to-clipboard and filter controls

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Build** | Vite 6 |
| **Maps** | Leaflet + OpenStreetMap / Google Maps |
| **AI** | Google Gemini API (`@google/genai`) |
| **Routing** | D\* Lite Algorithm (custom implementation) |
| **Animation** | Motion (Framer Motion) |
| **Icons** | Lucide React |
| **ML Training** | Python (train_model.py) |

---

## 🔑 API Keys Setup

### Gemini API Key (Recommended)
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Add to `.env`: `GEMINI_API_KEY="your-key"`

### Google Maps API Key (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create credentials → API Key
4. Add to `.env`: `VITE_GOOGLE_MAPS_API_KEY="your-key"`

---

## ☁️ Deploy on Render

The repo ships a [`render.yaml`](render.yaml) blueprint, so Render can build it as a static site with no manual configuration.

### Blueprint deploy (recommended)

1. Open the [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
2. Connect the `ShreeshaN2006/smartpath-2.0` repository
3. Click **Apply** — Render reads `render.yaml`, runs `npm ci && npm run build`, and publishes `dist/`

### Manual static site

| Setting | Value |
|---------|-------|
| **Build Command** | `npm ci && npm run build` |
| **Publish Directory** | `dist` |
| **Rewrite Rule** | `/*` → `/index.html` |

> **Note on API keys when deploying:** `vite.config.ts` deliberately exposes `GEMINI_API_KEY` to the browser, so any Gemini key you set on a public deployment is bundled into the client JavaScript and readable by anyone. Leave it unset on public hosting — the app falls back to the bundled pre-trained traffic model. `VITE_GOOGLE_MAPS_API_KEY` is expected to be public; restrict it by HTTP referrer in Google Cloud Console.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|---------|
| `npm install` fails | Ensure Node.js 18+ is installed. Try deleting `node_modules` and `package-lock.json`, then re-run. |
| Port 3000 in use | Kill the process: `npx kill-port 3000` or change the port in `package.json` |
| Map not loading | The Leaflet map works without API keys. For Google Maps, verify your `VITE_GOOGLE_MAPS_API_KEY`. |
| AI features not working | Verify `GEMINI_API_KEY` is set. The app falls back to the pre-trained model without it. |
| Build fails | Run `npm run lint` to check for TypeScript errors first. |

---

## 📄 License

This is a prototype project. All rights reserved.

---

<div align="center">

**Built with ❤️ for Bengaluru Emergency Services**

*SmartPath Prototype — Intelligent Emergency Dispatch Routing*

</div>
