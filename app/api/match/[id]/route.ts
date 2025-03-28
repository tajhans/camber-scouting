import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { match } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const matchNumber = request.nextUrl.pathname.split("/").pop();
        if (!matchNumber) {
            return NextResponse.json(
                { error: "Match ID is missing" },
                { status: 400 },
            );
        }
        const body = await request.json();

        const [updatedMatch] = await db
            .update(match)
            .set(body)
            .where(eq(match.matchNumber, parseInt(matchNumber)))
            .returning();

        return NextResponse.json(updatedMatch);
    } catch (error) {
        console.error("Error updating match:", error);
        return NextResponse.json(
            { error: "Failed to update match" },
            { status: 500 },
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const matchNumber = request.nextUrl.pathname.split("/").pop();
        if (!matchNumber) {
            return NextResponse.json(
                { error: "Match ID is missing" },
                { status: 400 },
            );
        }

        const matchData = await db
            .select()
            .from(match)
            .where(eq(match.matchNumber, parseInt(matchNumber)));

        if (!matchData.length) {
            return NextResponse.json(
                { error: "Match not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(matchData[0]);
    } catch (error) {
        console.error("Error fetching match:", error);
        return NextResponse.json(
            { error: "Failed to fetch match" },
            { status: 500 },
        );
    }
}
