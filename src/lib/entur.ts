import type { EnturVehicle, Bus, StopArrival, CityConfig, TransportMode } from "./types";

const VEHICLES_API = "https://api.entur.io/realtime/v2/vehicles/graphql";
const JOURNEY_PLANNER_API =
  "https://api.entur.io/journey-planner/v3/graphql";
const CLIENT_NAME =
  process.env.ENTUR_CLIENT_NAME ?? "pacbus-oslo-dev";

const headers = {
  "Content-Type": "application/json",
  "ET-Client-Name": CLIENT_NAME,
};

function buildVehiclesQuery(codespaceId?: string): string {
  const filter = codespaceId ? `(codespaceId: "${codespaceId}")` : "";
  return `{
  vehicles${filter} {
    line {
      lineRef
      lineName
      publicCode
    }
    lastUpdated
    location {
      latitude
      longitude
    }
    mode
    delay
    bearing
    vehicleId
    originName
    destinationName
    speed
  }
}`;
}

function toMode(raw: string): TransportMode {
  switch (raw) {
    case "BUS": return "BUS";
    case "RAIL": return "RAIL";
    case "TRAM": return "TRAM";
    case "FERRY": return "FERRY";
    default: return "UNKNOWN";
  }
}

export async function fetchVehicles(city: CityConfig): Promise<Bus[]> {
  const query = buildVehiclesQuery(city.codespaceId);

  const res = await fetch(VEHICLES_API, {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Entur vehicles API error: ${res.status}`);
  }

  const json = await res.json();
  const vehicles: EnturVehicle[] = json.data?.vehicles ?? [];
  const { bounds, modeFilter } = city;

  return vehicles
    .filter(
      (v) =>
        v.location &&
        v.line &&
        v.location.latitude >= bounds.minLat &&
        v.location.latitude <= bounds.maxLat &&
        v.location.longitude >= bounds.minLng &&
        v.location.longitude <= bounds.maxLng &&
        (!modeFilter || v.mode === modeFilter)
    )
    .map((v) => ({
      id: v.vehicleId,
      line: v.line.publicCode || v.line.lineRef,
      lineName: v.line.lineName || v.line.publicCode,
      destination: v.destinationName || "Unknown",
      origin: v.originName || "Unknown",
      lat: v.location.latitude,
      lng: v.location.longitude,
      bearing: v.bearing ?? 0,
      delay: v.delay ?? 0,
      speed: v.speed ?? 0,
      lastUpdated: v.lastUpdated,
      mode: toMode(v.mode),
    }));
}

const STOP_DEPARTURES_QUERY = `
query StopDepartures($id: String!) {
  stopPlace(id: $id) {
    name
    estimatedCalls(numberOfDepartures: 10, timeRange: 3600) {
      expectedDepartureTime
      aimedDepartureTime
      realtime
      destinationDisplay {
        frontText
      }
      serviceJourney {
        line {
          publicCode
        }
      }
    }
  }
}`;

export async function fetchStopArrivals(
  stopId: string
): Promise<{ stopName: string; arrivals: StopArrival[] }> {
  const res = await fetch(JOURNEY_PLANNER_API, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: STOP_DEPARTURES_QUERY,
      variables: { id: stopId },
    }),
  });

  if (!res.ok) {
    throw new Error(`Entur journey planner error: ${res.status}`);
  }

  const json = await res.json();
  const stop = json.data?.stopPlace;

  if (!stop) {
    return { stopName: "Unknown", arrivals: [] };
  }

  const arrivals: StopArrival[] = (stop.estimatedCalls ?? []).map(
    (call: {
      expectedDepartureTime: string;
      aimedDepartureTime: string;
      realtime: boolean;
      destinationDisplay: { frontText: string };
      serviceJourney: { line: { publicCode: string } };
    }) => {
      const aimed = new Date(call.aimedDepartureTime).getTime();
      const expected = new Date(call.expectedDepartureTime).getTime();
      return {
        line: call.serviceJourney?.line?.publicCode ?? "?",
        destination: call.destinationDisplay?.frontText ?? "Unknown",
        expectedArrival: call.expectedDepartureTime,
        aimedArrival: call.aimedDepartureTime,
        delay: Math.round((expected - aimed) / 1000),
        realtime: call.realtime,
      };
    }
  );

  return { stopName: stop.name, arrivals };
}
