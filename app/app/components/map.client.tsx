// MapComponent.tsx
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

      // Use standard OSM tile URL
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance);

      // Create polygons for each neighborhood
      data.forEach((neighborhood) => {
        const polygon = L.polygon(neighborhood.coordinates as L.LatLngTuple[], {
          color: "blue",
          weight: 2,
          fillColor: "#3388ff",
          fillOpacity: 0.2,
          interactive: true,
          className: "cursor-pointer",
        });

        polygon.addTo(mapInstance);
        polygon.on("click", () => onNeighborhoodClick(neighborhood.id));

        neighborhoodPolygons.current[neighborhood.id] = polygon;
      });

      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 200);
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
      const isSelected = selectedNeighborhoods.includes(Number(id));
      polygon.setStyle({
        color: isSelected ? "red" : "blue",
        fillColor: isSelected ? "red" : "#3388ff",
        fillOpacity: 0.2,
      });
    });
  }, [selectedNeighborhoods]);

  return (
    <div
      ref={mapRef}
      id="map"
      className="
        /* Fill the parent container */
        absolute top-0 left-0 w-full h-full
        /* Optional rounding if you want corners rounded */
        rounded
      "
    />
  );
}
