"use client";

import { useQuery } from "@tanstack/react-query";
import type { VehiclesResponse } from "@/lib/types";

async function fetchBuses(cityId: string): Promise<VehiclesResponse> {
  const res = await fetch(`/api/vehicles?city=${cityId}`);
  if (!res.ok) throw new Error("Failed to fetch buses");
  return res.json();
}

export function useVehicles(cityId: string) {
  return useQuery({
    queryKey: ["vehicles", cityId],
    queryFn: () => fetchBuses(cityId),
    refetchInterval: 10_000,
    staleTime: 8_000,
  });
}
