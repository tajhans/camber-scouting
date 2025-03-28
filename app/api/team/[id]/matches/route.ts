import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { match } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamId = request.nextUrl.pathname.split("/")[3];
    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is missing" },
        { status: 400 },
      );
    }

    const matches = await db
      .select()
      .from(match)
      .where(eq(match.teamId, parseInt(teamId)))
      .orderBy(match.matchNumber);

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 },
    );
  }
}
