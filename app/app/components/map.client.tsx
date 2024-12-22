import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  data: { id: number; coordinates: number[][] }[];
  onNeighborhoodClick: (id: number) => void;
  selectedNeighborhoods: number[];
}

export default function MapComponent({
  data,
  onNeighborhoodClick,
  selectedNeighborhoods,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const neighborhoodPolygons = useRef<{ [id: number]: L.Polygon }>({});

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      const mapInstance = L.map(mapRef.current).setView([42.6975, 23.3242], 12);
      mapInstanceRef.current = mapInstance;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance);

      data.forEach((neighborhood) => {
        const polygon = L.polygon(neighborhood.coordinates as L.LatLngTuple[], { color: "blue" });
        polygon.addTo(mapInstance);
        polygon.on("click", () => onNeighborhoodClick(neighborhood.id));
        neighborhoodPolygons.current[neighborhood.id] = polygon;
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data, onNeighborhoodClick]);

  useEffect(() => {
    Object.entries(neighborhoodPolygons.current).forEach(([id, polygon]) => {
      polygon.setStyle({
        color: selectedNeighborhoods.includes(Number(id)) ? "red" : "blue",
      });
    });
  }, [selectedNeighborhoods]);

  return <div ref={mapRef} id="map" className="h-full rounded"></div>;
}
