"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Bus } from "@/lib/types";
import { drawPacman, drawCleanIcon, getOnTimeScore, getDelayLabel } from "@/lib/pacman";
import { useAnimatedPosition } from "@/hooks/useAnimatedPosition";

interface BusMarkerProps {
  bus: Bus;
  isSelected: boolean;
  onSelect: (bus: Bus) => void;
  spriteStyle: "pacman" | "clean";
}

const MODE_ICON: Record<string, string> = {
  BUS: "🚌",
  RAIL: "🚆",
  TRAM: "🚊",
  FERRY: "⛴️",
  UNKNOWN: "🚍",
};

function createIcon(
  size: number,
  bearing: number,
  isGhost: boolean,
  isDelayed: boolean,
  isSelected: boolean,
  lineNumber: string,
  style: "pacman" | "clean"
): L.DivIcon {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  if (style === "clean") {
    drawCleanIcon(ctx, size, bearing, isDelayed, isSelected);
  } else {
    drawPacman(ctx, size, bearing, 0.4, isGhost, isSelected);
  }

  const dataUrl = canvas.toDataURL();

  return L.divIcon({
    html: `<div class="pacman-icon-wrapper">
      <img src="${dataUrl}" width="${size}" height="${size}" style="display:block;" />
      <span class="line-badge${isSelected ? " line-badge--selected" : ""}">${lineNumber}</span>
    </div>`,
    className: "pacman-marker",
    iconSize: [size, size + 16],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function BusMarker({ bus, isSelected, onSelect, spriteStyle }: BusMarkerProps) {
  const animated = useAnimatedPosition(
    { lat: bus.lat, lng: bus.lng, bearing: bus.bearing },
    10_000
  );

  const isGhost = bus.delay > 300;
  const isDelayed = bus.delay > 300;
  const size = isSelected ? 44 : 30;

  const icon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return createIcon(size, animated.bearing, isGhost, isDelayed, isSelected, bus.line, spriteStyle);
  }, [size, isGhost, isDelayed, isSelected, animated.bearing, bus.line, spriteStyle]);

  const score = getOnTimeScore(bus.delay);
  const delayLabel = getDelayLabel(bus.delay);
  const modeIcon = MODE_ICON[bus.mode] ?? "🚍";

  if (!icon) return null;

  return (
    <Marker
      position={[animated.lat, animated.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(bus),
      }}
    >
      <Popup className="pacman-popup">
        <div className="text-sm">
          <div className="font-bold text-lg">
            {modeIcon} Line {bus.line}
          </div>
          <div className="text-gray-300">→ {bus.destination}</div>
          <div className="mt-1">
            Score: <span className={score > 70 ? "text-green-400" : score > 30 ? "text-yellow-400" : "text-red-400"}>{score}</span>
            {" · "}
            {delayLabel}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
