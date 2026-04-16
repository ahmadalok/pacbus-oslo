import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchVehicles } from "@/lib/entur";
import { CITIES, DEFAULT_CITY } from "@/lib/cities";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cityId = req.nextUrl.searchParams.get("city") ?? DEFAULT_CITY;
  const city = CITIES[cityId] ?? CITIES[DEFAULT_CITY];

  try {
    const buses = await fetchVehicles(city);
    return NextResponse.json(
      { buses, timestamp: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "s-maxage=10, stale-while-revalidate=5",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch bus data" },
      { status: 500 }
    );
  }
}
