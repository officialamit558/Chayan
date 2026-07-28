import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [companies, jobs] = await Promise.all([
      prisma.company.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.privateJob.findMany({
        where: { status: "ACTIVE" },
        select: { location: true, type: true },
      }),
    ])

    const locationSet = new Set<string>()
    const typeSet = new Set<string>()
    for (const job of jobs) {
      if (job.location) locationSet.add(job.location)
      if (job.type) typeSet.add(job.type)
    }

    return NextResponse.json({
      success: true,
      data: {
        companies,
        locations: Array.from(locationSet).sort(),
        types: Array.from(typeSet).sort(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch filters" },
      { status: 500 }
    )
  }
}
