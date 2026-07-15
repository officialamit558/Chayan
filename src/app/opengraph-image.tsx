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
          background: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 28,
              background: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 172 174"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", inset: 0, margin: "auto" }}
            >
              <path
                d="M32 108L58 134L112 68"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, fontWeight: 500, color: "#0b0b0b", letterSpacing: -1 }}>
              Chayan
            </div>
            <div style={{ fontSize: 20, fontWeight: 400, color: "#52514e", marginTop: 4 }}>
              select right. serve right.
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 18,
            color: "#64748b",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.5,
            marginTop: 40,
          }}
        >
          Your trusted government job portal — Latest notifications, results, admit cards, answer keys and more
        </div>
      </div>
    ),
    { ...size },
  )
}
