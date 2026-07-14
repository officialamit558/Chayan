import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { NotificationsClient } from "./notifications-client"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Latest government job notifications, trending updates and category-wise alerts.",
}

export const dynamic = "force-dynamic"

export default async function NotificationsPage() {
  const [notifications, categories] = await Promise.all([
    prisma.notification.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  return <NotificationsClient notifications={JSON.parse(JSON.stringify(notifications))} categories={JSON.parse(JSON.stringify(categories))} />
}
