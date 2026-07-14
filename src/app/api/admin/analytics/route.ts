import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const now = new Date()
    const currentYear = now.getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)

    const [totalJobs, totalActiveJobs, totalUsers, totalResults, totalAdmitCards, totalAnswerKeys, totalComments, totalBookmarks] =
      await Promise.all([
        prisma.job.count(),
        prisma.job.count({ where: { status: "ACTIVE" } }),
        prisma.user.count(),
        prisma.result.count(),
        prisma.admitCard.count(),
        prisma.answerKey.count(),
        prisma.comment.count(),
        prisma.bookmark.count(),
      ])

    const jobsCreatedPerMonth = await prisma.$queryRaw<
      Array<{ month: number; count: number }>
    >`
      SELECT EXTRACT(MONTH FROM "createdAt") as month, COUNT(*)::int as count
      FROM "Job"
      WHERE "createdAt" >= ${startOfYear}
      GROUP BY month
      ORDER BY month ASC
    `

    const usersCreatedPerMonth = await prisma.$queryRaw<
      Array<{ month: number; count: number }>
    >`
      SELECT EXTRACT(MONTH FROM "createdAt") as month, COUNT(*)::int as count
      FROM "User"
      WHERE "createdAt" >= ${startOfYear}
      GROUP BY month
      ORDER BY month ASC
    `

    const yearlyJobViews = await prisma.jobView.aggregate({
      _sum: { views: true },
      where: { date: { gte: startOfYear } },
    })

    const popularJobs = await prisma.job.findMany({
      where: { status: "ACTIVE" },
      include: {
        department: true,
        category: true,
        _count: { select: { jobView: true, bookmark: true, comment: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    const categories = await prisma.category.findMany({
      include: { _count: { select: { job: true, result: true, admitCard: true, answerKey: true } } },
    })

    const activeJobCountByStatus = await Promise.all([
      prisma.job.count({ where: { status: "ACTIVE" } }),
      prisma.job.count({ where: { status: "EXPIRED" } }),
      prisma.job.count({ where: { status: "UPCOMING" } }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalJobs,
          totalActiveJobs,
          totalUsers,
          totalResults,
          totalAdmitCards,
          totalAnswerKeys,
          totalComments,
          totalBookmarks,
          totalViews: yearlyJobViews._sum.views || 0,
        },
        jobsCreatedPerMonth: jobsCreatedPerMonth.map((r) => ({
          month: Number(r.month),
          count: Number(r.count),
        })),
        usersCreatedPerMonth: usersCreatedPerMonth.map((r) => ({
          month: Number(r.month),
          count: Number(r.count),
        })),
        jobStatusDistribution: {
          active: Number(activeJobCountByStatus[0]),
          expired: Number(activeJobCountByStatus[1]),
          upcoming: Number(activeJobCountByStatus[2]),
        },
        popularJobs,
        categories,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
