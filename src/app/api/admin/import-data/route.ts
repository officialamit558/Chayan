import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { importByType, importAllTypes } from "@/lib/fetchers/registry"

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
  const type = body.type as string | undefined

  let result
  if (type) {
    result = [await importByType(type)]
  } else {
    result = await importAllTypes()
  }

  return NextResponse.json({ success: true, results: result })
}
