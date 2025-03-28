import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { match } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const matchCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(match);

    const recentMatches = await db
      .select({ count: sql<number>`count(*)` })
      .from(match)
      .where(sql`${match.createdAt} > NOW() - INTERVAL '24 hours'`);

    return NextResponse.json({
      totalMatches: matchCount[0].count,
      recentMatches: recentMatches[0].count,
    });
  } catch (error) {
    console.error("Error fetching match stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch match statistics" },
      { status: 500 },
    );
  }
}
