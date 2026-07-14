import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const states = await prisma.state.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json({ success: true, data: states })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch states" },
      { status: 500 }
    )
  }
}
