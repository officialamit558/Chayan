import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const searchSelect = {
  id: true,
  title: true,
  slug: true,
  department: { select: { name: true } },
  createdAt: true,
} as const

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || ""
    const category = searchParams.get("category") || ""
    const department = searchParams.get("department") || ""
    const state = searchParams.get("state") || ""
    const status = searchParams.get("status") || ""
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "5")))
    const skip = (page - 1) * limit

    const baseWhere: Record<string, unknown> = {}
    if (q) {
      baseWhere.OR = [
        { title: { contains: q, mode: "insensitive" as const } },
        { department: { name: { contains: q, mode: "insensitive" as const } } },
      ]
    }
    if (category) baseWhere.categoryId = category
    if (department) baseWhere.departmentId = department

    const jobWhere = { ...baseWhere }
    if (state) (jobWhere as Record<string, unknown>).stateId = state
    if (status) (jobWhere as Record<string, unknown>).status = status

    const [jobs, results, admitCards, answerKeys] = await Promise.all([
      prisma.job.findMany({
        where: jobWhere,
        select: { ...searchSelect, department: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.result.findMany({
        where: baseWhere,
        select: searchSelect,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.admitCard.findMany({
        where: baseWhere,
        select: searchSelect,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.answerKey.findMany({
        where: baseWhere,
        select: searchSelect,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    ])

    return NextResponse.json(
      {
        success: true,
        data: { jobs, results, admitCards, answerKeys },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    )
  }
}
