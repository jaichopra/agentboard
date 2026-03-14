"use client";

import { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";

interface MapWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function MapWidget({ widget, data }: MapWidgetProps) {
  const config = widget.config as {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    markers?: { lat: number; lng: number; label?: string; color?: string }[];
    mapStyle?: string;
  };

  const markers = config.markers || data.map((d) => ({
    lat: Number(d.lat || d.latitude || 0),
    lng: Number(d.lng || d.longitude || 0),
    label: d.label ? String(d.label) : undefined,
    color: d.color ? String(d.color) : undefined,
  }));

  const defaultLat = markers.length > 0
    ? markers.reduce((sum, m) => sum + m.lat, 0) / markers.length
    : 40.7128;
  const defaultLng = markers.length > 0
    ? markers.reduce((sum, m) => sum + m.lng, 0) / markers.length
    : -74.006;

  const [viewState, setViewState] = useState({
    latitude: config.latitude ?? defaultLat,
    longitude: config.longitude ?? defaultLng,
    zoom: config.zoom ?? 10,
  });

  const mapStyle = config.mapStyle || "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle={mapStyle}
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="top-right" />
          {markers.map((marker, i) => (
            <Marker key={i} latitude={marker.lat} longitude={marker.lng}>
              <div
                className="h-3 w-3 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: marker.color || "#06b6d4" }}
                title={marker.label}
              />
            </Marker>
          ))}
        </Map>
      </div>
    </WidgetShell>
  );
}
