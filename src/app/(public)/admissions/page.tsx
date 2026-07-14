import type { Metadata } from "next"
import { AdmissionsClient } from "./admissions-client"

export const metadata: Metadata = {
  title: "Admissions",
  description: "Latest government admission notifications. Check admission dates, application fees, and download admission PDFs for various government courses and programs.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://chayanjobs.com"}/admissions` },
  twitter: { card: "summary_large_image", title: "Admissions | Chayan", description: "Latest government admission notifications and dates." },
}

export const dynamic = "force-dynamic"

export default function AdmissionsPage() {
  return <AdmissionsClient />
}
