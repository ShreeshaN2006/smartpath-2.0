import { useState, useCallback, useEffect } from 'react'
import type { GPSPosition } from '../types'

interface GeolocationState {
  position: GPSPosition | null
  error: string | null
  isLoading: boolean
  isWatching: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    isLoading: false,
    isWatching: false,
  })

  // One-shot GPS acquisition
  const getCurrentLocation = useCallback((onSuccess?: (pos: GPSPosition) => void): Promise<GPSPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errMsg = 'Geolocation is not supported by your browser'
        setState((prev) => ({ ...prev, error: errMsg, isLoading: false }))
        reject(new Error(errMsg))
        return
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const gpsPos: GPSPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            timestamp: pos.timestamp,
          }
          setState((prev) => ({
            ...prev,
            position: gpsPos,
            isLoading: false,
            error: null,
          }))
          if (onSuccess) onSuccess(gpsPos)
          resolve(gpsPos)
        },
        (err) => {
          let errorMsg = 'Failed to retrieve GPS location'
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMsg = 'Location permission was denied. Please allow location access in your browser settings.'
              break
            case err.POSITION_UNAVAILABLE:
              errorMsg = 'GPS location is currently unavailable.'
              break
            case err.TIMEOUT:
              errorMsg = 'Location request timed out.'
              break
          }
          setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }))
          reject(new Error(errorMsg))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      )
    })
  }, [])

  return {
    position: state.position,
    error: state.error,
    isLoading: state.isLoading,
    getCurrentLocation,
  }
}
