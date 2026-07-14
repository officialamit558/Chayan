import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Chayan - Latest Government Jobs, Results, Admit Cards"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d9488 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: "#0d9488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>Chayan</div>
        </div>
        <div style={{ fontSize: 28, color: "#cbd5e1", marginBottom: 12 }}>
          select right. serve right.
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Your trusted government job portal — Latest notifications, results, admit cards, answer keys and more
        </div>
      </div>
    ),
    { ...size },
  )
}
