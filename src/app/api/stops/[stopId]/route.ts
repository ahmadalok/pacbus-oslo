import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchStopArrivals } from "@/lib/entur";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ stopId: string }> }
) {
  const { stopId } = await params;

  try {
    const data = await fetchStopArrivals(stopId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch stop arrivals:", error);
    return NextResponse.json(
      { error: "Failed to fetch stop data" },
      { status: 500 }
    );
  }
}
