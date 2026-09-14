import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, CircleMarker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import type { Coordinates, RouteResponse, GPSPosition, LiveTrackingState, VehicleType, MapLayerType } from '../../types'

// Fix Leaflet default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

// Tile layer URL map
const tileLayerUrls: Record<MapLayerType, { url: string; attribution: string }> = {
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors | SmartPath',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap | SmartPath Dark',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  positron: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap | SmartPath Light',
  },
}

interface RouteLayerProps {
  coords: Coordinates[]
  color: string
  weight?: number
  opacity?: number
  dashArray?: string
  layerId?: string
}

function RouteLayer({ coords, color, weight = 6, opacity = 0.9, dashArray, layerId }: RouteLayerProps) {
  const map = useMapEvents({})
  const layerRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (coords.length < 2) return

    const latLngs = coords.map((c) => [c.lat, c.lng] as L.LatLngExpression)

    layerRef.current = L.polyline(latLngs, {
      color,
      weight,
      opacity,
      dashArray,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map)

    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current)
    }
  }, [coords, color, weight, opacity, dashArray, map])

  useEffect(() => {
    if (layerId && coords.length > 0) {
      const latLngs = coords.map((c) => [c.lat, c.lng] as L.LatLngExpression)
      map.fitBounds(L.polyline(latLngs).getBounds().pad(0.2), {
        animate: true,
        duration: 1,
      })
    }
  }, [coords, layerId, map])

  return null
}

interface MarkerProps {
  position: Coordinates
  icon: L.DivIcon
  popup?: string
  zIndexOffset?: number
}

function MapMarker({ position, icon, popup, zIndexOffset = 0 }: MarkerProps) {
  return (
    <Marker position={[position.lat, position.lng]} icon={icon} zIndexOffset={zIndexOffset}>
      {popup && <Popup>{popup}</Popup>}
    </Marker>
  )
}

// Live Dynamic Vehicle Marker that moves & rotates smoothly
function LiveVehicleMarker({
  coord,
  heading,
  vehicle,
  cameraFollow,
}: {
  coord: Coordinates
  heading: number
  vehicle: VehicleType
  cameraFollow: boolean
}) {
  const map = useMapEvents({})
  const markerRef = useRef<L.Marker | null>(null)

  const vehicleEmoji = vehicle === 'ambulance' ? '🚑' : vehicle === 'truck' ? '🚛' : vehicle === 'car' ? '🚗' : '🚐'

  const customIcon = L.divIcon({
    className: 'live-tracking-vehicle-icon',
    html: `
      <div style="
        position: relative;
        width: 44px; height: 44px;
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.25);
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 34px; height: 34px;
          background: #4f46e5;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.6);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          transform: rotate(${heading}deg);
          transition: transform 0.15s ease-out;
        ">
          <span style="transform: rotate(-${heading}deg); display: inline-block;">${vehicleEmoji}</span>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })

  useEffect(() => {
    if (!markerRef.current) {
      markerRef.current = L.marker([coord.lat, coord.lng], {
        icon: customIcon,
        zIndexOffset: 1200,
      }).addTo(map)
    } else {
      markerRef.current.setLatLng([coord.lat, coord.lng])
      markerRef.current.setIcon(customIcon)
    }

    if (cameraFollow) {
      map.panTo([coord.lat, coord.lng], { animate: true, duration: 0.2 })
    }

return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
    };
  }, [coord.lat, coord.lng, heading, cameraFollow, map])

  return null
}

function createIcon(color: string, symbol: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px; height: 30px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 800;
        box-shadow: 0 3px 14px ${color}88;
        color: white;
      ">${symbol}</div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

const sourceIcon = createIcon('#10b981', 'S')
const destIcon = createIcon('#ef4444', 'D')
const waypointIcon = (num: number) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="width: 26px; height: 26px; background: #8b5cf6; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; box-shadow: 0 2px 10px #8b5cf688; color: white;">${num}</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
})

const gpsIcon = L.divIcon({
  className: 'gps-pulse-marker',
  html: `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 16px; height: 16px; background: #2563eb; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(37, 99, 235, 0.8);"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

interface MapViewProps {
  center: Coordinates
  zoom: number
  source?: Coordinates
  destination?: Coordinates
  waypoints?: Coordinates[]
  route?: RouteResponse | null
  blockedCoords?: Coordinates[]
  gpsPosition?: GPSPosition | null
  liveTracking?: LiveTrackingState
  vehicle?: VehicleType
  mapLayer?: MapLayerType
  onMapClick: (lat: number, lng: number) => void
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number; center_lat: number; center_lon: number }) => void
}

export function MapView({
  center,
  zoom,
  source,
  destination,
  waypoints = [],
  route,
  blockedCoords = [],
  gpsPosition,
  liveTracking,
  vehicle = 'delivery_van',
  mapLayer = 'streets',
  onMapClick,
  onBoundsChange,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)

  // Handle map click
  const ClickHandler = () => {
    useMapEvents({
      click(e: any) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      },
    })
    return null
  }

  // Handle bounds change
  const BoundsHandler = () => {
    useMapEvents({
      moveend() {
        if (mapRef.current) {
          const bounds = mapRef.current.getBounds()
          const center = mapRef.current.getCenter()
          onBoundsChange({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
            center_lat: center.lat,
            center_lon: center.lng,
          })
        }
      },
    })
    return null
  }

  const selectedTile = tileLayerUrls[mapLayer] || tileLayerUrls.streets

  return (
    <div className="map-container w-full h-full">
      <MapContainer
        ref={mapRef}
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        attributionControl={false}
      >
        <TileLayer
          key={mapLayer}
          url={selectedTile.url}
          attribution={selectedTile.attribution}
          maxZoom={19}
        />

        <ClickHandler />
        <BoundsHandler />

        {/* GPS Position Marker & Accuracy Halo */}
        {gpsPosition && (
          <>
            <MapMarker
              position={{ lat: gpsPosition.lat, lng: gpsPosition.lng }}
              icon={gpsIcon}
              zIndexOffset={900}
              popup={`<strong>📍 Your GPS Location</strong><br/>Accuracy: ±${gpsPosition.accuracy}m`}
            />
            {gpsPosition.accuracy > 0 && (
              <Circle
                center={[gpsPosition.lat, gpsPosition.lng]}
                radius={Math.min(500, gpsPosition.accuracy)}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.12,
                  weight: 1.5,
                  dashArray: '4, 4',
                }}
              />
            )}
          </>
        )}

        {/* Source, Destination, and Waypoints */}
        {source && <MapMarker position={source} icon={sourceIcon} zIndexOffset={800} popup="<strong>📍 Source</strong><br/>Start location" />}
        {destination && <MapMarker position={destination} icon={destIcon} zIndexOffset={800} popup="<strong>🎯 Destination</strong><br/>End location" />}
        {waypoints.map((wp, i) => (
          <MapMarker key={i} position={wp} icon={waypointIcon(i + 1)} zIndexOffset={750} popup={`<strong>🟣 Waypoint #${i + 1}</strong><br/>Delivery stop`} />
        ))}

        {/* Road Blockages */}
        {blockedCoords.map((coord, i) => (
          <MapMarker
            key={i}
            position={coord}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<div style="width: 28px; height: 28px; background: #f43f5e; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; box-shadow: 0 3px 12px #f43f5e88; color: white;">✕</div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            })}
            zIndexOffset={850}
            popup="<strong>⛔ Road Blockage</strong><br/>Route dynamically detoured around this point"
          />
        ))}

        {/* Route Polyline */}
        {route && route.segments.length > 0 && (
          <RouteLayer
            coords={route.segments.flatMap((s) => s.coords)}
            color="#6366f1"
            weight={6}
            opacity={0.9}
            layerId="merged"
          />
        )}

        {/* Active Live Vehicle Marker */}
        {liveTracking?.currentCoord && (liveTracking.isActive || liveTracking.isPaused || liveTracking.isCompleted) && (
          <LiveVehicleMarker
            coord={liveTracking.currentCoord}
            heading={liveTracking.heading}
            vehicle={vehicle}
            cameraFollow={liveTracking.cameraFollow}
          />
        )}
      </MapContainer>
      </div>
    )
  }