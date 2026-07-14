import type { Metadata } from "next"
import { AdmissionsClient } from "./admissions-client"

export const metadata: Metadata = {
  title: "Admissions",
  description: "Latest government admission notifications. Check admission dates, application fees, and download admission PDFs for various government courses and programs.",
}

export const dynamic = "force-dynamic"

export default function AdmissionsPage() {
  return <AdmissionsClient />
}
