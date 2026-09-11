import { useState, useEffect, useRef, useCallback } from 'react'
import type { Coordinates, RouteResponse, LiveTrackingState } from '../types'
import { haversineDistance } from '../lib/api'

function calculateBearing(startLat: number, startLng: number, destLat: number, destLng: number): number {
  const startLatRad = (startLat * Math.PI) / 180
  const startLngRad = (startLng * Math.PI) / 180
  const destLatRad = (destLat * Math.PI) / 180
  const destLngRad = (destLng * Math.PI) / 180

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad)
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad)

  let brng = (Math.atan2(y, x) * 180) / Math.PI
  return (brng + 360) % 360
}

export function useLiveTracking(route: RouteResponse | null) {
  const [trackingState, setTrackingState] = useState<LiveTrackingState>({
    isActive: false,
    isPaused: false,
    isCompleted: false,
    progress: 0,
    currentCoord: null,
    heading: 0,
    currentSpeedKmh: 0,
    distanceCoveredKm: 0,
    distanceRemainingKm: 0,
    etaRemainingMin: 0,
    currentSegmentIndex: 0,
    instruction: 'Ready to start navigation',
    simulationSpeed: 2,
    cameraFollow: true,
  })

  const animFrameRef = useRef<number | null>(null)
  const pathPointsRef = useRef<Coordinates[]>([])
  const progressRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  // Extract flat coordinate list from route
  useEffect(() => {
    if (route && route.segments.length > 0) {
      const allCoords = route.segments.flatMap((s) => s.coords)
      // Interpolate finely for sub-meter smoothness
      const finePoints: Coordinates[] = []
      for (let i = 0; i < allCoords.length - 1; i++) {
        const p1 = allCoords[i]
        const p2 = allCoords[i + 1]
        const segDist = haversineDistance(p1.lat, p1.lng, p2.lat, p2.lng)
        const subSteps = Math.max(8, Math.round(segDist * 50))
        for (let s = 0; s <= subSteps; s++) {
          if (i > 0 && s === 0) continue
          const t = s / subSteps
          finePoints.push({
            lat: p1.lat + (p2.lat - p1.lat) * t,
            lng: p1.lng + (p2.lng - p1.lng) * t,
          })
        }
      }
      pathPointsRef.current = finePoints.length > 0 ? finePoints : allCoords

      if (!trackingState.isActive) {
        const first = pathPointsRef.current[0]
        const second = pathPointsRef.current[1] || first
        const initialHeading = calculateBearing(first.lat, first.lng, second.lat, second.lng)
        setTrackingState((prev) => ({
          ...prev,
          currentCoord: first,
          heading: initialHeading,
          distanceCoveredKm: 0,
          distanceRemainingKm: route.distance_km,
          etaRemainingMin: route.eta_min,
          instruction: 'Proceed to route start',
        }))
      }
    } else {
      pathPointsRef.current = []
      if (trackingState.isActive) {
        stopTracking()
      }
    }
  }, [route])

  // Animation Loop
  const animate = useCallback((currentTime: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = currentTime
    const deltaTime = (currentTime - lastTimeRef.current) / 1000 // in seconds
    lastTimeRef.current = currentTime

    if (pathPointsRef.current.length < 2 || !route) {
      return
    }

    const totalPoints = pathPointsRef.current.length
    // Base speed: complete entire trip in ~45 seconds at 1x simulation speed
    const baseStepRate = (1 / Math.max(20, route.eta_min * 10)) * trackingState.simulationSpeed
    progressRef.current = Math.min(1, progressRef.current + baseStepRate * deltaTime)

    const exactIndex = progressRef.current * (totalPoints - 1)
    const currentIndex = Math.floor(exactIndex)
    const nextIndex = Math.min(totalPoints - 1, currentIndex + 1)
    const ratio = exactIndex - currentIndex

    const p1 = pathPointsRef.current[currentIndex]
    const p2 = pathPointsRef.current[nextIndex]

    const currentCoord: Coordinates = {
      lat: p1.lat + (p2.lat - p1.lat) * ratio,
      lng: p1.lng + (p2.lng - p1.lng) * ratio,
    }

    const heading = calculateBearing(p1.lat, p1.lng, p2.lat, p2.lng)
    const coveredKm = Number((route.distance_km * progressRef.current).toFixed(2))
    const remainingKm = Number(Math.max(0, route.distance_km - coveredKm).toFixed(2))
    const remainingEta = Number(Math.max(0, route.eta_min * (1 - progressRef.current)).toFixed(1))

    // Dynamic speed with natural road micro-variations
    const baseSpeed = (route.distance_km / (route.eta_min / 60)) || 35
    const speedVariation = Math.sin(progressRef.current * Math.PI * 6) * 4
    const liveSpeed = Math.max(15, Math.round(baseSpeed + speedVariation))

    // Determine current instruction
    let instruction = 'Follow highlighted path'
    const totalSegments = route.segments.length || 1
    const segIdx = Math.min(totalSegments - 1, Math.floor(progressRef.current * totalSegments))

    if (progressRef.current >= 0.98) {
      instruction = '🎯 Arriving at destination on the right'
    } else if (progressRef.current > 0.8) {
      instruction = 'Continue straight toward final destination'
    } else if (route.algorithm.includes('dfs')) {
      instruction = '⚠️ Detour active: navigating around blockage'
    } else if (segIdx > 0) {
      instruction = `Continue on ${route.segments[segIdx]?.road_class || 'primary'} corridor`
    } else {
      instruction = 'Head towards destination along route'
    }

    const isCompleted = progressRef.current >= 1

    setTrackingState((prev) => ({
      ...prev,
      progress: progressRef.current,
      currentCoord,
      heading,
      currentSpeedKmh: isCompleted ? 0 : liveSpeed,
      distanceCoveredKm: coveredKm,
      distanceRemainingKm: remainingKm,
      etaRemainingMin: remainingEta,
      currentSegmentIndex: segIdx,
      instruction,
      isCompleted,
      isActive: !isCompleted,
    }))

    if (!isCompleted && !trackingState.isPaused) {
      animFrameRef.current = requestAnimationFrame(animate)
    }
  }, [route, trackingState.simulationSpeed, trackingState.isPaused])

  const startTracking = useCallback(() => {
    if (pathPointsRef.current.length < 2) return
    progressRef.current = 0
    lastTimeRef.current = 0
    setTrackingState((prev) => ({
      ...prev,
      isActive: true,
      isPaused: false,
      isCompleted: false,
      progress: 0,
      instruction: 'Navigation active: head towards route start',
    }))
  }, [])

  const pauseTracking = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    setTrackingState((prev) => ({ ...prev, isPaused: true }))
  }, [])

  const resumeTracking = useCallback(() => {
    lastTimeRef.current = 0
    setTrackingState((prev) => ({ ...prev, isPaused: false }))
  }, [])

  const stopTracking = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    progressRef.current = 0
    setTrackingState((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      isCompleted: false,
      progress: 0,
      currentSpeedKmh: 0,
      currentCoord: pathPointsRef.current[0] || null,
      instruction: 'Navigation stopped',
    }))
  }, [])

  const setSimulationSpeed = useCallback((speed: number) => {
    setTrackingState((prev) => ({ ...prev, simulationSpeed: speed }))
  }, [])

  const toggleCameraFollow = useCallback(() => {
    setTrackingState((prev) => ({ ...prev, cameraFollow: !prev.cameraFollow }))
  }, [])

  // Manage animation frame lifecycle
  useEffect(() => {
    if (trackingState.isActive && !trackingState.isPaused && !trackingState.isCompleted) {
      animFrameRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [trackingState.isActive, trackingState.isPaused, trackingState.isCompleted, animate])

  return {
    trackingState,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    setSimulationSpeed,
    toggleCameraFollow,
  }
}
