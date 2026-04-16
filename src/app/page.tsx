"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/Map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-950">
      <div className="text-yellow-400 font-mono text-xl flex items-center gap-3">
        <span className="animate-pulse text-4xl">🟡</span>
        Initializing PacBus...
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden relative">
      <MapView />
    </main>
  );
}
