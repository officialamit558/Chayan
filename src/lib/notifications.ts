import { prisma } from "@/lib/prisma"

type NotificationType = "JOB" | "RESULT" | "ADMIT_CARD"

export async function notifyUsers(type: NotificationType, title: string, slug: string) {
  try {
    const prefField =
      type === "JOB" ? "jobAlerts" :
      type === "RESULT" ? "resultAlerts" :
      "admitCardAlerts"

    const users = await prisma.notificationPreference.findMany({
      where: { [prefField]: true },
      select: { userId: true },
    })

    if (users.length === 0) return

    await prisma.userNotification.createMany({
      data: users.map((u) => ({
        userId: u.userId,
        type,
        title,
        slug,
      })),
    })
  } catch (error) {
    console.error("Failed to send notifications:", error)
  }
}
