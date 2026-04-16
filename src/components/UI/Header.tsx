"use client";

import { setSoundEnabled } from "@/lib/sounds";
import { useState } from "react";
import { CITIES } from "@/lib/cities";
import type { CityConfig } from "@/lib/types";

interface HeaderProps {
  currentCity: CityConfig;
  onCityChange: (cityId: string) => void;
}

export default function Header({ currentCity, onCityChange }: HeaderProps) {
  const [sound, setSound] = useState(false);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] bg-gray-900/80 backdrop-blur-sm border-b border-yellow-500/30">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🟡</span>
          <h1 className="text-yellow-400 font-bold text-lg font-mono tracking-wider">
            PACBUS
          </h1>
          <div className="flex gap-1 ml-1">
            {Object.values(CITIES).map((city) => (
              <button
                key={city.id}
                onClick={() => onCityChange(city.id)}
                className={`text-xs font-mono px-2.5 py-1 rounded-full border transition-all ${
                  currentCity.id === city.id
                    ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                    : "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="text-sm px-2 py-1 rounded border border-gray-600 hover:border-yellow-500/50 transition-colors"
            title={sound ? "Mute sounds" : "Enable sounds"}
          >
            {sound ? "🔊" : "🔇"}
          </button>
          <span className="text-xs text-gray-500 font-mono hidden sm:block">
            LIVE
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1 animate-pulse" />
          </span>
        </div>
      </div>
    </header>
  );
}
