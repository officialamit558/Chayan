import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ bookmarked: false })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const resultId = searchParams.get("resultId")
    const admitCardId = searchParams.get("admitCardId")

    const where: Record<string, unknown> = { userId: session.user.id }
    if (jobId) where.jobId = jobId
    else if (resultId) where.resultId = resultId
    else if (admitCardId) where.admitCardId = admitCardId
    else {
      return NextResponse.json({ bookmarked: false, id: null })
    }

    const bookmark = await prisma.bookmark.findFirst({ where: where as any })

    return NextResponse.json({
      bookmarked: !!bookmark,
      id: bookmark?.id || null,
    })
  } catch {
    return NextResponse.json({ bookmarked: false, id: null })
  }
}
