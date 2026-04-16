"use client";

import { useQuery } from "@tanstack/react-query";
import type { StopArrivalsResponse } from "@/lib/types";

async function fetchArrivals(stopId: string): Promise<StopArrivalsResponse> {
  const res = await fetch(`/api/stops/${encodeURIComponent(stopId)}`);
  if (!res.ok) throw new Error("Failed to fetch arrivals");
  return res.json();
}

export function useStopArrivals(stopId: string | null) {
  return useQuery({
    queryKey: ["stopArrivals", stopId],
    queryFn: () => fetchArrivals(stopId!),
    enabled: !!stopId,
    refetchInterval: 30_000,
  });
}
