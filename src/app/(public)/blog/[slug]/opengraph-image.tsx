import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"

export const alt = "Chayan Blog Article"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  })

  const title = post?.title || "Chayan Blog"
  const categoryName = post?.category?.name || "Chayan Blog"

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 55%, #1d4ed8 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: 64,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -140,
            top: -140,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "30%",
            bottom: -160,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(251,191,36,0.10)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 172 174" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 108L58 134L112 68" stroke="#451a03" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 600, color: "#ffffff", letterSpacing: -0.5 }}>Chayan</div>
            <div style={{ fontSize: 15, color: "#93c5fd" }}>select right. serve right.</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", position: "relative", maxWidth: 1000 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              background: "rgba(255,255,255,0.15)",
              color: "#ffffff",
              padding: "10px 22px",
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            {categoryName.toUpperCase()}
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: "#ffffff", lineHeight: 1.15, letterSpacing: -1 }}>
            {title.slice(0, 110)}
            {title.length > 110 ? "…" : ""}
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
