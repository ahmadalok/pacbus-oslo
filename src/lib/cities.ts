import type { CityConfig } from "./types";

export const CITIES: Record<string, CityConfig> = {
  oslo: {
    id: "oslo",
    name: "Oslo",
    center: [59.9139, 10.7522],
    zoom: 13,
    bounds: { minLat: 59.8, maxLat: 60.05, minLng: 10.5, maxLng: 11.0 },
  },
  bergen: {
    id: "bergen",
    name: "Bergen",
    center: [60.3913, 5.3221],
    zoom: 13,
    bounds: { minLat: 60.2, maxLat: 60.55, minLng: 5.1, maxLng: 5.6 },
    codespaceId: "SKY",
    modeFilter: "BUS",
  },
};

export const DEFAULT_CITY = "bergen";
