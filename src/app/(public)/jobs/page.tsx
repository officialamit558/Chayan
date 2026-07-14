import type { Metadata } from "next"
import { JobsClient } from "./jobs-client"

export const metadata: Metadata = {
  title: "Latest Government Jobs",
  description: "Browse latest government job notifications across India. Filter by category, department, state, and status to find your dream government job.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://chayanjobs.com"}/jobs` },
  twitter: { card: "summary_large_image", title: "Latest Government Jobs | Chayan", description: "Browse latest government job notifications across India." },
}

export const dynamic = "force-dynamic"

export default function JobsPage() {
  return <JobsClient />
}
