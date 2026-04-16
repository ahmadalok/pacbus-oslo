"use client";

import type { Bus } from "@/lib/types";
import { getOnTimeScore, getDelayLabel } from "@/lib/pacman";

interface BusInfoSheetProps {
  bus: Bus | null;
  onClose: () => void;
}

export default function BusInfoSheet({ bus, onClose }: BusInfoSheetProps) {
  if (!bus) return null;

  const score = getOnTimeScore(bus.delay);
  const delayLabel = getDelayLabel(bus.delay);
  const isGhost = bus.delay > 300;
  const modeIcon: Record<string, string> = {
    BUS: "🚌", RAIL: "🚆", TRAM: "🚊", FERRY: "⛴️", UNKNOWN: "🚍",
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-gray-900/95 backdrop-blur-sm border-t border-yellow-500/30 p-4 transition-transform duration-300 rounded-t-2xl">
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        aria-label="Close"
      >
        ×
      </button>

      <div className="flex items-start gap-4">
        <div className="text-4xl">{isGhost ? "👻" : modeIcon[bus.mode] ?? "🟡"}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-yellow-400 font-mono">
              {bus.line}
            </span>
            <span className="text-gray-400">→</span>
            <span className="text-white font-medium">{bus.destination}</span>
          </div>
          <div className="text-sm text-gray-400 mt-0.5">
            From {bus.origin}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Score</div>
          <div
            className={`text-3xl font-bold font-mono ${
              score > 70
                ? "text-green-400"
                : score > 30
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {score}
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-4 text-sm">
        <div className="bg-gray-800 rounded-lg px-3 py-2 flex-1 text-center">
          <div className="text-gray-400">Delay</div>
          <div className={`font-mono font-bold ${bus.delay > 60 ? "text-red-400" : "text-green-400"}`}>
            {delayLabel}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg px-3 py-2 flex-1 text-center">
          <div className="text-gray-400">Speed</div>
          <div className="font-mono font-bold text-blue-400">
            {Math.round(bus.speed)} km/h
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg px-3 py-2 flex-1 text-center">
          <div className="text-gray-400">Status</div>
          <div className="font-mono font-bold">
            {isGhost ? "🔴 Ghost" : score > 70 ? "🟢 Good" : "🟡 Slow"}
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center font-mono">
        Vehicle {bus.id} · Updated{" "}
        {new Date(bus.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
}
