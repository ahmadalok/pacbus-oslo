"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Bus, CityConfig } from "@/lib/types";
import { useVehicles } from "@/hooks/useVehicles";
import { CITIES, DEFAULT_CITY } from "@/lib/cities";
import BusMarker from "./BusMarker";
import BusInfoSheet from "./BusInfoSheet";
import StatsPanel from "./StatsPanel";
import Header from "../UI/Header";
import { playSelect } from "@/lib/sounds";

const DARK_BASE =
  "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
const DARK_LABELS =
  "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png";

function MapPanner({ city }: { city: CityConfig }) {
  const map = useMap();
  const prevCity = useRef(city.id);

  useEffect(() => {
    if (prevCity.current !== city.id) {
      prevCity.current = city.id;
      map.flyTo(city.center, city.zoom, { duration: 1.5 });
    }
  }, [city, map]);

  return null;
}

export default function MapView() {
  const [cityId, setCityId] = useState(DEFAULT_CITY);
  const city = CITIES[cityId] ?? CITIES[DEFAULT_CITY];

  const { data, isLoading, error } = useVehicles(cityId);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [spriteStyle, setSpriteStyle] = useState<"pacman" | "clean">("pacman");

  // Deduplicate buses by ID, keeping the most recently updated
  const buses = (() => {
    const raw = data?.buses ?? [];
    const map = new Map<string, Bus>();
    for (const bus of raw) {
      const existing = map.get(bus.id);
      if (!existing || bus.lastUpdated > existing.lastUpdated) {
        map.set(bus.id, bus);
      }
    }
    return Array.from(map.values());
  })();

  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    playSelect();
  };

  const handleCityChange = (newCityId: string) => {
    setCityId(newCityId);
    setSelectedBus(null);
    setStatsOpen(false);
  };

  return (
    <div className="relative w-full h-full">
      <Header currentCity={city} onCityChange={handleCityChange} spriteStyle={spriteStyle} onSpriteToggle={() => setSpriteStyle(s => s === "pacman" ? "clean" : "pacman")} />

      <LeafletMap
        center={city.center}
        zoom={city.zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapPanner city={city} />
        <TileLayer
          url={DARK_BASE}
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        {buses.map((bus) => (
          <BusMarker
            key={bus.id}
            bus={bus}
            isSelected={selectedBus?.id === bus.id}
            onSelect={handleSelectBus}
            spriteStyle={spriteStyle}
          />
        ))}
        <TileLayer
          url={DARK_LABELS}
          attribution=""
          zIndex={250}
        />
      </LeafletMap>

      <StatsPanel
        buses={buses}
        cityName={city.name}
        isOpen={statsOpen}
        onToggle={() => setStatsOpen(!statsOpen)}
      />

      <BusInfoSheet
        bus={selectedBus ? buses.find((b) => b.id === selectedBus.id) ?? selectedBus : null}
        onClose={() => setSelectedBus(null)}
      />

      {isLoading && buses.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]">
          <div className="bg-gray-900/90 rounded-xl px-6 py-4 text-yellow-400 font-mono text-lg flex items-center gap-3">
            <span className="animate-pulse text-3xl">🟡</span>
            Loading {city.name} vehicles...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]">
          <div className="bg-red-900/90 rounded-xl px-6 py-4 text-red-300 font-mono">
            Failed to load data. Retrying...
          </div>
        </div>
      )}
    </div>
  );
}
