export type TransportMode = "BUS" | "RAIL" | "TRAM" | "FERRY" | "UNKNOWN";

export interface Bus {
  id: string;
  line: string;
  lineName: string;
  destination: string;
  origin: string;
  lat: number;
  lng: number;
  bearing: number;
  delay: number;
  speed: number;
  lastUpdated: string;
  mode: TransportMode;
}

export interface VehiclesResponse {
  buses: Bus[];
  timestamp: string;
}

export interface CityConfig {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  codespaceId?: string;
  modeFilter?: TransportMode;
}

export interface StopArrival {
  line: string;
  destination: string;
  expectedArrival: string;
  aimedArrival: string;
  delay: number;
  realtime: boolean;
}

export interface StopArrivalsResponse {
  stopName: string;
  arrivals: StopArrival[];
}

export interface EnturVehicle {
  line: {
    lineRef: string;
    lineName: string;
    publicCode: string;
  };
  lastUpdated: string;
  location: {
    latitude: number;
    longitude: number;
  };
  mode: string;
  delay: number;
  bearing: number;
  vehicleId: string;
  originName: string;
  destinationName: string;
  speed: number;
}

export interface EnturVehiclesResponse {
  data: {
    vehicles: EnturVehicle[];
  };
}
