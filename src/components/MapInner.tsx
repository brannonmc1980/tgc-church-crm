"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon as turfPolygon } from "@turf/helpers";

// Fix default icon paths for Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const STATUS_PIN_COLORS: Record<string, string> = {
  COUNCIL: "#7c3aed",
  ENGAGED: "#6d9960",
  AWARE: "#3b82f6",
  POTENTIAL: "#f59e0b",
  LOW_POTENTIAL: "#9ca3af",
  OPPOSED: "#ef4444",
};

function createIcon(color: string, isSelected: boolean) {
  const size = isSelected ? 18 : 14;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:${isSelected ? "3px solid #20272a" : "2px solid white"};border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export type ChurchPin = {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  denomination?: string | null;
  pastorName?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status?: string | null;
};

function FlyToSelected({ church }: { church: ChurchPin | null }) {
  const map = useMap();
  useEffect(() => {
    if (church?.latitude && church?.longitude) {
      map.flyTo([church.latitude, church.longitude], Math.max(map.getZoom(), 12), { duration: 0.8 });
    }
  }, [church, map]);
  return null;
}

function DrawControl({ onSelectionChange, churches, clearTrigger }: {
  onSelectionChange: (churches: ChurchPin[]) => void;
  churches: ChurchPin[];
  clearTrigger: number;
}) {
  const map = useMap();
  const drawGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const churchesRef = useRef(churches);
  churchesRef.current = churches;

  // Clear drawn shapes when parent requests it
  useEffect(() => {
    if (clearTrigger > 0) {
      drawGroupRef.current.clearLayers();
    }
  }, [clearTrigger]);

  useEffect(() => {
    const drawGroup = drawGroupRef.current;
    drawGroup.addTo(map);

    const LDraw = (L.Control as unknown as { Draw: new (opts: unknown) => L.Control }).Draw;
    if (!LDraw) return;

    const drawControl = new LDraw({
      position: "topright",
      draw: {
        polygon: { shapeOptions: { color: "#87b575", fillOpacity: 0.15, weight: 2 } },
        rectangle: { shapeOptions: { color: "#87b575", fillOpacity: 0.15, weight: 2 } },
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
      },
      edit: { featureGroup: drawGroup },
    });
    map.addControl(drawControl);

    const handleCreated = (e: unknown) => {
      const event = e as { layer: L.Polygon };
      drawGroup.clearLayers();
      drawGroup.addLayer(event.layer);

      const geoJson = event.layer.toGeoJSON();
      const coords = (geoJson.geometry as { coordinates: number[][][] }).coordinates;
      const poly = turfPolygon(coords);

      const inside = churchesRef.current.filter((c) => {
        if (!c.latitude || !c.longitude) return false;
        return booleanPointInPolygon(point([c.longitude, c.latitude]), poly);
      });
      onSelectionChange(inside);
    };

    const handleDeleted = () => onSelectionChange([]);
    const handleEdited = () => {
      // Re-run selection after editing the polygon
      const layers = drawGroup.getLayers();
      if (layers.length === 0) { onSelectionChange([]); return; }
      const layer = layers[0] as L.Polygon;
      const geoJson = layer.toGeoJSON();
      const coords = (geoJson.geometry as { coordinates: number[][][] }).coordinates;
      const poly = turfPolygon(coords);
      const inside = churchesRef.current.filter((c) => {
        if (!c.latitude || !c.longitude) return false;
        return booleanPointInPolygon(point([c.longitude, c.latitude]), poly);
      });
      onSelectionChange(inside);
    };

    map.on("draw:created", handleCreated);
    map.on("draw:deleted", handleDeleted);
    map.on("draw:edited", handleEdited);

    return () => {
      map.removeControl(drawControl);
      map.off("draw:created", handleCreated);
      map.off("draw:deleted", handleDeleted);
      map.off("draw:edited", handleEdited);
      drawGroup.clearLayers();
      map.removeLayer(drawGroup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

export default function MapInner({
  churches,
  onSelect,
  selected,
  onSelection,
  clearDrawTrigger,
}: {
  churches: ChurchPin[];
  onSelect: (c: ChurchPin) => void;
  selected: ChurchPin | null;
  onSelection: (churches: ChurchPin[]) => void;
  clearDrawTrigger: number;
}) {
  const center: [number, number] = [33.8, -83.0];

  return (
    <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected church={selected} />
      <DrawControl onSelectionChange={onSelection} churches={churches} clearTrigger={clearDrawTrigger} />
      {churches.map((church) => {
        if (!church.latitude || !church.longitude) return null;
        const color = STATUS_PIN_COLORS[church.status ?? ""] ?? "#87b575";
        const isSelected = selected?.id === church.id;
        return (
          <Marker
            key={church.id}
            position={[church.latitude, church.longitude]}
            icon={createIcon(color, isSelected)}
            eventHandlers={{ click: () => onSelect(church) }}
            zIndexOffset={isSelected ? 1000 : 0}
          >
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}>
                <p style={{ fontWeight: "600", marginBottom: "2px" }}>{church.name}</p>
                <p style={{ color: "#7a756e" }}>{[church.city, church.state].filter(Boolean).join(", ")}</p>
                {church.denomination && <p style={{ color: "#9e9890" }}>{church.denomination}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
