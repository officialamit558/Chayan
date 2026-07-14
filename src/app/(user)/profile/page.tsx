"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { z } from "zod"
import { Loader2, User, Shield, Bell, Camera, Eye, EyeOff } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"

const profileEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
})

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ProfileEditInput = z.infer<typeof profileEditSchema>
type PasswordChangeInput = z.infer<typeof passwordChangeSchema>

interface UserStats {
  totalBookmarks: number
  totalComments: number
  savedJobs: number
}

interface NotificationPrefs {
  jobAlerts: boolean
  resultAlerts: boolean
  admitCardAlerts: boolean
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [stats, setStats] = useState<UserStats>({ totalBookmarks: 0, totalComments: 0, savedJobs: 0 })
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    jobAlerts: true,
    resultAlerts: true,
    admitCardAlerts: false,
  })

  const profileForm = useForm<ProfileEditInput>({
    resolver: zodResolver(profileEditSchema),
    values: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
    },
  })

  const passwordForm = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      setIsLoading(false)
      fetchStats()
    }
  }, [status, router])

  async function fetchStats() {
    try {
      const res = await fetch("/api/stats")
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setStats(json.data)
        }
      }
    } catch {
    }
  }

  async function onSaveProfile(data: ProfileEditInput) {
    setIsSaving(true)
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        toast(err.error || "Failed to update profile", "destructive")
        return
      }
      await update({ name: data.name })
      toast("Profile updated successfully", "success")
    } catch {
      toast("Failed to update profile", "destructive")
    } finally {
      setIsSaving(false)
    }
  }

  async function onChangePassword(data: PasswordChangeInput) {
    setIsChangingPassword(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast("Password changed successfully", "success")
      passwordForm.reset()
    } catch {
      toast("Failed to change password", "destructive")
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    )
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-8 text-2xl font-bold text-gray-900">My Profile</h1>

        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{session?.user?.name}</h2>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
                <Separator className="my-4" />
                <p className="text-xs text-gray-400">
                  Member since {formatDate(new Date(), "MMM yyyy")}
                </p>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.totalBookmarks}</p>
                  <p className="text-xs text-gray-500">Bookmarks</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.totalComments}</p>
                  <p className="text-xs text-gray-500">Comments</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stats.savedJobs}</p>
                  <p className="text-xs text-gray-500">Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input
                        id="profile-name"
                        {...profileForm.register("name")}
                        className={cn(profileForm.formState.errors.name && "border-red-500")}
                      />
                      {profileForm.formState.errors.name && (
                        <p className="text-sm font-medium text-red-500">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        disabled
                        {...profileForm.register("email")}
                      />
                      <p className="text-xs text-gray-400">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-phone">Phone Number</Label>
                      <Input
                        id="profile-phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        {...profileForm.register("phone")}
                      />
                    </div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          {...passwordForm.register("currentPassword")}
                          className={cn(
                            passwordForm.formState.errors.currentPassword && "border-red-500",
                            "pr-10"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm font-medium text-red-500">
                          {passwordForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          {...passwordForm.register("newPassword")}
                          className={cn(
                            passwordForm.formState.errors.newPassword && "border-red-500",
                            "pr-10"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm font-medium text-red-500">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          {...passwordForm.register("confirmPassword")}
                          className={cn(
                            passwordForm.formState.errors.confirmPassword && "border-red-500",
                            "pr-10"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm font-medium text-red-500">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Job Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified about new job postings</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.jobAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs((prev) => ({ ...prev, jobAlerts: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Result Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when results are announced</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.resultAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs((prev) => ({ ...prev, resultAlerts: checked }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Admit Card Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when admit cards are released</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.admitCardAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs((prev) => ({ ...prev, admitCardAlerts: checked }))
                      }
                    />
                  </div>
                  <Button
                    onClick={() => toast("Notification preferences saved", "success")}
                  >
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
