import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { team } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const search = searchParams.get("search") || "";
        const limit = 10;
        const offset = (page - 1) * limit;

        const teams = await db
            .select()
            .from(team)
            .where(
                sql`CAST(id AS TEXT) LIKE ${`%${search}%`} OR name LIKE ${`%${search}%`}`,
            )
            .orderBy(sql`CAST(id AS INTEGER)`)
            .limit(limit)
            .offset(offset);

        const totalCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(team)
            .where(
                sql`CAST(id AS TEXT) LIKE ${`%${search}%`} OR name LIKE ${`%${search}%`}`,
            );

        return NextResponse.json({
            teams,
            totalPages: Math.ceil(totalCount[0].count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { id, name } = body;

        if (!id || !name) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        await db.insert(team).values({
            id: id,
            name: name,
        });

        return NextResponse.json(
            { message: "Team created successfully" },
            { status: 201 },
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
