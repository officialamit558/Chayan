import type { Metadata } from "next"
import { SyllabusClient } from "./syllabus-client"

export const metadata: Metadata = {
  title: "Syllabus",
  description: "Download syllabus for government exams. Get detailed subject-wise syllabus for various government job examinations across India.",
}

export const dynamic = "force-dynamic"

export default function SyllabusPage() {
  return <SyllabusClient />
}
