import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { importFromSource, getAvailableSources, importAllSources } from "@/lib/fetchers/registry"

async function checkAdmin(): Promise<NextResponse | null> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

export async function POST(req: NextRequest) {
  const unauthorized = await checkAdmin()
  if (unauthorized) return unauthorized

  const body = await req.json().catch(() => ({}))
  const sourceName = body.source as string | undefined

  let result
  if (sourceName) {
    result = [await importFromSource(sourceName)]
  } else {
    result = await importAllSources()
  }

  return NextResponse.json({ success: true, results: result })
}

export async function GET() {
  const unauthorized = await checkAdmin()
  if (unauthorized) return unauthorized

  return NextResponse.json({
    sources: getAvailableSources(),
  })
}
