"use client";

import type { Bus } from "@/lib/types";

interface StatsPanelProps {
  buses: Bus[];
  cityName: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function StatsPanel({ buses, cityName, isOpen, onToggle }: StatsPanelProps) {
  if (buses.length === 0) return null;

  const onTime = buses.filter((b) => b.delay <= 120).length;
  const delayed = buses.filter((b) => b.delay > 300).length;
  const avgDelay = Math.round(
    buses.reduce((sum, b) => sum + b.delay, 0) / buses.length
  );

  const fastest = [...buses].sort((a, b) => b.speed - a.speed)[0];
  const mostDelayed = [...buses].sort((a, b) => b.delay - a.delay)[0];

  return (
    <div className="absolute top-16 left-3 z-[1000]">
      <button
        onClick={onToggle}
        className="bg-gray-900/90 backdrop-blur-sm text-yellow-400 px-3 py-1.5 rounded-lg text-sm font-mono border border-yellow-500/30 hover:bg-gray-800"
      >
        {isOpen ? "▼" : "▶"} {onTime}/{buses.length} on time
      </button>

      {isOpen && (
        <div className="mt-2 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-yellow-500/30 p-3 text-sm min-w-[220px]">
          <div className="space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">{cityName} vehicles</span>
              <span className="text-white">{buses.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-400">On time</span>
              <span className="text-green-400">{onTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400">Ghosts (delayed)</span>
              <span className="text-red-400">{delayed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg delay</span>
              <span className="text-yellow-400">{avgDelay}s</span>
            </div>
            <hr className="border-gray-700" />
            {fastest && (
              <div className="text-xs">
                <span className="text-gray-400">Fastest: </span>
                <span className="text-blue-400">
                  Line {fastest.line} ({Math.round(fastest.speed)} km/h)
                </span>
              </div>
            )}
            {mostDelayed && mostDelayed.delay > 60 && (
              <div className="text-xs">
                <span className="text-gray-400">Most delayed: </span>
                <span className="text-red-400">
                  Line {mostDelayed.line} (+{Math.round(mostDelayed.delay / 60)}m)
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
