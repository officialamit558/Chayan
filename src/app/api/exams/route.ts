import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, data: exams })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch exams" },
      { status: 500 }
    )
  }
}
