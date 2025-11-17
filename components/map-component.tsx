"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void
}

export default function MapComponent({ onLocationSelect }: MapComponentProps) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<any>(null) // 🧭 store marker instance

  useEffect(() => {
    if (typeof window === "undefined") return

    import("leaflet").then((L) => {
      if (mapRef.current || !containerRef.current) return

      // 🗺️ Initialize map centered on Addis Ababa
      const map = L.map(containerRef.current).setView([9.0102, 38.7613], 13)
      mapRef.current = map

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            map.setView([latitude, longitude], 14)    
          },
          () => {
            map.setView([9.0102, 38.7613], 13)
          },
        )
      }       

      // 🖱️ Handle clicks: add or move marker
      const handleMapClick = (e: any) => {
        const { lat, lng } = e.latlng

        // If marker doesn't exist, create it
        if (!markerRef.current) {
          markerRef.current = L.marker([lat, lng]).addTo(map)
        } else {
          // Move existing marker
          markerRef.current.setLatLng([lat, lng])
        }

        // Pass coordinates up to parent
        onLocationSelect(lat, lng)
      }

      map.on("click", handleMapClick)

      // ✅ Cleanup
      return () => {
        map.off("click", handleMapClick)
        map.remove()
        mapRef.current = null
        markerRef.current = null
      }
    })
  }, [onLocationSelect])

  return <div ref={containerRef} className="w-full h-full" />
}
