"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, BellRing, Check, X, Loader2, ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface UserNotification {
  id: string
  type: string
  title: string
  slug: string
  read: boolean
  createdAt: string
}

const typeHref: Record<string, string> = {
  JOB: "/apply",
  RESULT: "/result",
  ADMIT_CARD: "/admit-card",
}

export function NotificationBell() {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<UserNotification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  const fetchNotifications = React.useCallback(async () => {
    if (!session?.user?.id) return
    setLoading(true)
    try {
      const res = await fetch("/api/user/notifications?limit=10")
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setNotifications(json.data)
          setUnreadCount(json.unreadCount)
        }
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  React.useEffect(() => {
    if (open) fetchNotifications()
  }, [open, fetchNotifications])

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/user/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
    }
  }

  if (!session?.user) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-gray-500">{unreadCount} unread</span>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "group flex items-start gap-3 border-b px-4 py-3 transition-colors last:border-0",
                  n.read ? "bg-white" : "bg-teal-50/60"
                )}
              >
                <Link
                  href={`${typeHref[n.type] || "#"}/${n.slug}`}
                  className="min-w-0 flex-1"
                  onClick={() => {
                    if (!n.read) markRead(n.id)
                    setOpen(false)
                  }}
                >
                  <p
                    className={cn(
                      "text-sm leading-snug",
                      n.read ? "text-gray-600" : "font-medium text-gray-900"
                    )}
                  >
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {n.type === "JOB"
                      ? "New Job"
                      : n.type === "RESULT"
                        ? "New Result"
                        : "New Admit Card"}
                  </p>
                </Link>
                <div className="flex shrink-0 items-center gap-1">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
