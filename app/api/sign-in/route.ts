import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { headers } = await auth.api.signInEmail({
      returnHeaders: true,
      body: {
        email: email,
        password: password,
      },
    });

    return NextResponse.json(
      { message: "Sign in successful" },
      {
        status: 200,
        headers: headers,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }
}
