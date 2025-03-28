import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { match, team } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const {
            matchNumber,
            teamId,
            alliance,
            position,
            redAlliance,
            blueAlliance,
        } = body;

        const [newMatch] = await db
            .insert(match)
            .values({
                matchNumber,
                teamId,
                alliance,
                position: parseInt(position),
                redAlliance,
                blueAlliance,
            })
            .returning();

        await db
            .update(team)
            .set({
                matches: sql`array_append(${team.matches}, ${newMatch.matchNumber})`,
            })
            .where(eq(team.id, teamId));

        return NextResponse.json(newMatch, { status: 201 });
    } catch (error) {
        console.error("Error creating match:", error);
        return NextResponse.json(
            { error: "Failed to create match" },
            { status: 500 },
        );
    }
}
