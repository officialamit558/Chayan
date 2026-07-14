import type { Metadata } from "next"
import { JobsClient } from "./jobs-client"

export const metadata: Metadata = {
  title: "Latest Government Jobs",
  description: "Browse latest government job notifications across India. Filter by category, department, state, and status to find your dream government job.",
}

export const dynamic = "force-dynamic"

export default function JobsPage() {
  return <JobsClient />
}
