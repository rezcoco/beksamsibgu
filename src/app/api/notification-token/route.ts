import { NextRequest, NextResponse } from "next/server";
import { Knock } from "@knocklabs/node";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const clerk = auth()

  if (!clerk.sessionId) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const token = await Knock.signUserToken(clerk.userId)

    return NextResponse.json({
      token,
    })
  } catch (error) {
    console.error(error)
    return new NextResponse("InternalServerError", { status: 500 })
  }
}