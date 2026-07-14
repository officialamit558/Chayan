import type { Metadata } from "next"
import { ResultsClient } from "./results-client"

export const metadata: Metadata = {
  title: "Exam Results",
  description: "Check latest government exam results. Download PDF result notifications for various government job exams across India.",
}

export const dynamic = "force-dynamic"

export default function ResultsPage() {
  return <ResultsClient />
}
