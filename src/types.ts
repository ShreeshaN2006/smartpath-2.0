export interface LatLng {
  lat: number;
  lng: number;
}

export type ResponseMode =
  | 'Ambulance'
  | 'Fire & Rescue'
  | 'Police'
  | 'Disaster Response'
  | 'Relief Vehicle';

export interface Landmark {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  type: 'station' | 'hospital' | 'incident' | 'hub' | 'tech_park' | 'commercial' | 'residential';
  stationType?: string;
}

export type VehicleType =
  | 'Ambulance'
  | 'Fire Engine'
  | 'Police Vehicle'
  | 'Relief Truck'
  | 'Delivery Bike'
  | 'Mini Truck'
  | 'Delivery Van'
  | 'Heavy Truck';

export interface VehicleConfig {
  type: VehicleType;
  icon: string;
  speedMultiplier: number;
  riskTolerance: 'low' | 'medium' | 'high';
  fuelCostFactor: number;
  accessRestrictions: string[];
  sirenClearanceFactor?: number;
  emergencyTier?: 'Priority 1' | 'Priority 2' | 'Heavy Rescue';
}

export type RoutingStrategy =
  | 'Fastest Response'
  | 'Safest Route'
  | 'Balanced: Time + Risk'
  | 'Avoid Blocked Roads'
  | 'Fastest Route'
  | 'Avoid Blockages'
  | 'D* Lite Dynamic Replan';

export type TrafficStatus = 'Normal' | 'Moderate' | 'Heavy' | 'Severe';

export type RouteStatus = 'CLEAR' | 'DELAYED' | 'HIGH RISK' | 'BLOCKED';

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface BlockedRoad {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  reason: string;
  timestamp: string;
}

export interface RouteSegment {
  name: string;
  distanceKm: number;
  timeMin: number;
  speedLimitKmh: number;
  trafficFactor: number;
  riskScore: number;
}

export type TurnManeuver =
  | 'depart'
  | 'straight'
  | 'turn-left'
  | 'turn-right'
  | 'slight-left'
  | 'slight-right'
  | 'merge'
  | 'uturn'
  | 'hazard-avoid'
  | 'waypoint'
  | 'arrive';

export interface NavigationStep {
  id: string;
  stepNumber: number;
  maneuver: TurnManeuver;
  instruction: string;
  roadName: string;
  distanceKm: number;
  timeMin: number;
  tacticalNote?: string;
  isHazardBypass?: boolean;
}

export interface RouteResult {
  id: string;
  source: Landmark;
  destination: Landmark;
  waypoints: Waypoint[];
  path: [number, number][]; // lat, lng
  alternativePath?: [number, number][];
  totalDistanceKm: number;
  estimatedTimeMin: number;
  baseTimeMin: number;
  alternativeDistanceKm?: number;
  alternativeTimeMin?: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  trafficCondition: TrafficStatus;
  routeStatus: RouteStatus;
  algorithm: string;
  roadSegments: number;
  blockagesAvoided: number;
  co2SavingsKg?: number;
  confidenceScore: number;
  instructions: string[];
  steps?: NavigationStep[];
  vehicle: VehicleType;
  responseMode?: ResponseMode;
  strategy: RoutingStrategy;
  trafficMultiplier: number;
  sirenAssistMinutesSaved?: number;
  replanningLatencyMs?: number;
  incrementalUpdatesCount?: number;
}

export interface AlgorithmMetrics {
  algorithm: 'D* Lite' | 'BFS' | 'A*' | 'Hybrid A* + DFS';
  distanceKm: number;
  timeMin: number;
  executionTimeMs: number;
  nodesExplored: number;
  memoryKb: number;
  status: 'Optimal' | 'Sub-optimal' | 'Best Trade-off';
  description: string;
}

export interface TrafficForecastData {
  currentTraffic: TrafficStatus;
  predictedTraffic: TrafficStatus;
  predictedAvgSpeedKmh: number;
  forecastHorizon: string;
  model: string;
  confidenceScore: number;
  corridorRiskHotspots: string[];
  lastUpdated: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}

