import type { Metadata } from "next"
import { PrivateJobsClient } from "./private-jobs-client"

export const metadata: Metadata = {
  title: "Private Jobs",
  description: "Browse private job vacancies including full-time, part-time, internships, and contract positions across top companies.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://chayanjobs.com"}/private-jobs` },
  twitter: { card: "summary_large_image", title: "Private Jobs | Chayan", description: "Browse private job vacancies across top companies." },
}

export const dynamic = "force-dynamic"

export default function PrivateJobsPage() {
  return <PrivateJobsClient />
}