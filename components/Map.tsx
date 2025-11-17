"use client";
import { redirect } from "next/navigation";
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { PollutionFormModal } from "./pollution-form-modal";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import { Box, Button, Typography } from "@mui/material";
import L from "leaflet";

export default function PollutionMap() {
  const DEFAULT_LOCATION: [number, number] = [9.03, 38.75]; // Addis Ababa default
  const [userLocation, setUserLocation] = useState<[number, number]>(DEFAULT_LOCATION);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [hideLocationButton, setHideLocationButton] = useState(false);
  const [zoom, setZoom] = useState(14); // Default zoom when using DEFAULT_LOCATION


  // Fix Leaflet marker icon issue
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setSelectedLocation({ lat, lng });
      },
    });
    return null;
  };

  // ✅ A helper component to access and move the map instance
 const FlyToUserLocation = ({ location, zoom }: { location: [number, number]; zoom: number }) => {
  const map = useMap();

  React.useEffect(() => {
    if (location) {
      map.flyTo(location, zoom, { duration: 2 }); // 👈 dynamic zoom
    }
  }, [location, zoom, map]);

  return null;
};


  // ✅ Trigger geolocation manually
  const handleUseMyLocation = () => {
  setIsLocating(true);
  setLocationError(null);

  if (!("geolocation" in navigator)) {
    setLocationError("Geolocation not supported by your browser.");
    setIsLocating(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      console.log("📍 Got location:", { latitude, longitude, accuracy });

      if (accuracy > 1000) {
        setLocationError(
          `⚠️ Location may be imprecise (accuracy: ${Math.round(accuracy)}m)`
        );
      }

      setUserLocation([latitude, longitude]);
      setZoom(18); // 👈 zoom in less aggressively when GPS is used
      setIsLocating(false);
    },
    (err) => {
      console.error("Geolocation error:", err);
      setLocationError("Unable to get your location. Using default center.");
      setIsLocating(false);
      setUserLocation(DEFAULT_LOCATION);
      setZoom(14); // 👈 revert to default zoom when error
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    }
  );
};





  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Floating control panel */}
      {!hideLocationButton && (
     <Box
  sx={{
    position: "absolute",
    bottom: 60,
    left: 10,
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: 2,
    p: 1.5,
    boxShadow: 3,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  }}
>
  {/* X to hide the button */}

    <Button
      variant="text"
      color="error"
      size="small"
      onClick={() =>setHideLocationButton(false)}
      sx={{
        minWidth: 32,
        height: 32,
        fontSize: "1.2rem",
        lineHeight: 1,
        p: 0,
      }}
    >
      ✕
    </Button>
 

  {/* Main location button */}
  <Button
    variant="contained"
    onClick={handleUseMyLocation}
    disabled={isLocating}
    sx={{
      whiteSpace: "nowrap",
    }}
  >
    {isLocating ? "Getting location..." : "Use My Location"}
  </Button>
</Box>
      )}

      {/* Map */}
      <MapContainer
        center={userLocation}
        zoom={zoom}
        style={{ height: "600px", width: "100%", zIndex: 1 }}
      >
        <LayersControl position="topright">
            {userLocation[1]===38.75?(
          <LayersControl.BaseLayer checked  name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              />
          </LayersControl.BaseLayer>):(
            <LayersControl.BaseLayer  name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              />
          </LayersControl.BaseLayer>
          )}

          <LayersControl.BaseLayer name="GPS Map">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution="Map data: &copy; OpenTopoMap & contributors"
            />
          </LayersControl.BaseLayer>
         {userLocation[1]===38.75?(
          <LayersControl.BaseLayer  name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics, and the GIS User Community"
            />
          </LayersControl.BaseLayer>):(
            <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics, and the GIS User Community"
            />
          </LayersControl.BaseLayer>
          )}
        </LayersControl>

        {/* Smooth fly-to behavior when userLocation changes */}
        <FlyToUserLocation location={userLocation} zoom={zoom} />

        <MapClickHandler />

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <Box sx={{ padding:2, width: 300,}}>
                <PollutionFormModal
                  lat={selectedLocation.lat}
                  lng={selectedLocation.lng}
                />
              </Box>
              </Popup> 
          </Marker>
        )}
      </MapContainer>
  <Box
  sx={{
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 1000,
    borderRadius: 2,
    p: 1.5,
    boxShadow: 3,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    height: "40px", // make sure to include units
    width: "100%",
    background: "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)"
  }}
></Box>
    </Box>
  );
}
