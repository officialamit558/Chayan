import type { Metadata } from "next"
import { AnswerKeysClient } from "./answer-keys-client"

export const metadata: Metadata = {
  title: "Answer Keys",
  description: "Download answer keys for government exams. Check your answers with official answer keys for various government job examinations.",
}

export const dynamic = "force-dynamic"

export default function AnswerKeysPage() {
  return <AnswerKeysClient />
}
