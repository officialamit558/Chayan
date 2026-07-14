import type { Metadata } from "next"
import { SyllabusClient } from "./syllabus-client"

export const metadata: Metadata = {
  title: "Syllabus",
  description: "Download syllabus for government exams. Get detailed subject-wise syllabus for various government job examinations across India.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://chayanjobs.com"}/syllabus` },
  twitter: { card: "summary_large_image", title: "Syllabus | Chayan", description: "Download subject-wise syllabus for government exams." },
}

export const dynamic = "force-dynamic"

export default function SyllabusPage() {
  return <SyllabusClient />
}
