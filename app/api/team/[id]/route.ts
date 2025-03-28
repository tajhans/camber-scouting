import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { team } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Team ID is missing" },
        { status: 400 },
      );
    }

    const selectedTeam = await db
      .select()
      .from(team)
      .where(eq(team.id, parseInt(id)));

    if (!selectedTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json(selectedTeam);
  } catch (error) {
    console.error("Error fetching battery:", error);

    return NextResponse.json(
      { error: "Failed to fetch battery" },
      { status: 500 },
    );
  }
}
