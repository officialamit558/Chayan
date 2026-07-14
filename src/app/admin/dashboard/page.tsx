"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api, fetcher } from "@/lib/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate, getStatusColor } from "@/lib/utils"
import { Briefcase, Users, FileText, IdCard, Plus } from "lucide-react"
import Link from "next/link"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { startOfDay, subDays, format } from "date-fns"

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalResults: number
  totalUsers: number
  totalAdmitCards: number
  totalCategories: number
  totalDepartments: number
  totalAnswerKeys: number
  recentJobs: Array<{
    id: string
    title: string
    status: string
    totalVacancies: number | null
    lastDate: string | null
    createdAt: string
    department: { name: string }
    category: { name: string }
  }>
}

interface UserData {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const { data: statsData, isLoading: statsLoading } = useQuery<{ success: boolean; data: DashboardStats }>({
    queryKey: ["admin-stats"],
    queryFn: () => fetcher("/api/stats"),
  })

  const { data: usersData, isLoading: usersLoading } = useQuery<{ success: boolean; data: UserData[] }>({
    queryKey: ["admin-recent-users"],
    queryFn: () => fetcher("/api/users?limit=5"),
  })

  const { data: analyticsData } = useQuery<{ success: boolean; data: { jobsCreatedPerMonth: Array<{ month: number; count: number }> } }>({
    queryKey: ["admin-analytics-chart"],
    queryFn: () => fetcher("/api/admin/analytics"),
  })

  if (status === "loading") {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
  }
  if (!session || session.user.role !== "ADMIN") { router.push("/login"); return null }

  const stats = statsData?.data
  const users = usersData?.data || []
  const chartData = analyticsData?.data?.jobsCreatedPerMonth || []
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), i)
    return { date: d, label: format(d, "EEE") }
  }).reverse()

  const jobsByDay = stats?.recentJobs?.reduce<Record<string, number>>((acc, job) => {
    const day = startOfDay(new Date(job.createdAt)).toISOString()
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {}) || {}

  const barChartData = days.map((d) => ({
    name: d.label,
    count: jobsByDay[startOfDay(d.date).toISOString()] || 0,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/admin/jobs">
              <Plus className="mr-1 h-4 w-4" /> Add Job
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/results">
              <Plus className="mr-1 h-4 w-4" /> Add Result
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/categories">
              <Plus className="mr-1 h-4 w-4" /> Add Category
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-20" /> : (
              <>
                <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
                <p className="text-xs text-gray-500">{stats?.activeJobs || 0} active</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-20" /> : (
              <>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-gray-500">Registered users</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-20" /> : (
              <>
                <div className="text-2xl font-bold">{stats?.totalResults || 0}</div>
                <p className="text-xs text-gray-500">Published results</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admit Cards</CardTitle>
            <IdCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-8 w-20" /> : (
              <>
                <div className="text-2xl font-bold">{stats?.totalAdmitCards || 0}</div>
                <p className="text-xs text-gray-500">Available admit cards</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jobs Created (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? <Skeleton className="h-40" /> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(stats?.recentJobs || []).slice(0, 5).map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="max-w-[200px] truncate font-medium">{job.title}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(job.lastDate)}</TableCell>
                    </TableRow>
                  ))}
                  {(!stats?.recentJobs || stats.recentJobs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">No jobs found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? <Skeleton className="h-40" /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">No users found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
