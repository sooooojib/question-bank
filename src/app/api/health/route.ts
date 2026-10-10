import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    // Lightweight 1-row check to verify DB connectivity and keep free-tier Supabase active
    const { data, error } = await supabase
      .from("batches")
      .select("id")
      .limit(1);

    const latency = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        { status: "error", message: error.message, latency: `${latency}ms` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      latency: `${latency}ms`,
    });
  } catch (err: unknown) {
    const latency = Date.now() - startTime;
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { status: "error", message: msg, latency: `${latency}ms` },
      { status: 500 }
    );
  }
}
