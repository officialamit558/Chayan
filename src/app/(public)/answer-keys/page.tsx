import type { Metadata } from "next"
import { AnswerKeysClient } from "./answer-keys-client"

export const metadata: Metadata = {
  title: "Answer Keys",
  description: "Download answer keys for government exams. Check your answers with official answer keys for various government job examinations.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://chayanjobs.com"}/answer-keys` },
  twitter: { card: "summary_large_image", title: "Answer Keys | Chayan", description: "Download answer keys for government exams across India." },
}

export const dynamic = "force-dynamic"

export default function AnswerKeysPage() {
  return <AnswerKeysClient />
}
