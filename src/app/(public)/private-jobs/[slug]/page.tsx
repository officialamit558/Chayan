import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PrivateJobDetail } from "./private-job-detail"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const job = await prisma.privateJob.findUnique({
    where: { slug },
    include: { company: true },
  })

  if (!job) return { title: "Not Found" }

  return {
    title: `${job.title} - ${job.company.name}`,
    description: `Apply for ${job.title} at ${job.company.name}. ${job.location ? `Location: ${job.location}.` : ""} ${job.salary ? `Salary: ${job.salary}.` : ""}`,
  }
}

export const dynamic = "force-dynamic"

export default async function PrivateJobPage({ params }: Props) {
  const { slug } = await params
  const job = await prisma.privateJob.findUnique({
    where: { slug },
    include: { company: true },
  })

  if (!job) notFound()

  return <PrivateJobDetail job={JSON.parse(JSON.stringify(job))} />
}