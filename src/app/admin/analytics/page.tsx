"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetcher } from "@/lib/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts"
import { Briefcase, Users, FileText, Eye, Bookmark, MessageSquare } from "lucide-react"

interface AnalyticsData {
  overview: {
    totalJobs: number; totalActiveJobs: number; totalUsers: number; totalResults: number
    totalAdmitCards: number; totalAnswerKeys: number; totalComments: number; totalBookmarks: number; totalViews: number
  }
  jobsCreatedPerMonth: Array<{ month: number; count: number }>
  usersCreatedPerMonth: Array<{ month: number; count: number }>
  jobStatusDistribution: { active: number; expired: number; upcoming: number }
  popularJobs: Array<{ id: string; title: string; department: { name: string }; _count: { jobView: number; bookmark: number; comment: number } }>
  categories: Array<{ id: string; name: string; _count: { job: number } }>
}

const COLORS = ["#2563eb", "#ef4444", "#eab308"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function AdminAnalytics() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dateRange, setDateRange] = useState<"30d" | "90d" | "1y">("30d")

  const { data: analyticsData, isLoading } = useQuery<{ success: boolean; data: AnalyticsData }>({
    queryKey: ["admin-analytics"],
    queryFn: () => fetcher("/api/admin/analytics"),
  })

  if (status === "loading") return <Skeleton className="h-96" />
  if (!session || session.user.role !== "ADMIN") { router.push("/login"); return null }

  const data = analyticsData?.data
  if (!data) return <p className="text-center text-gray-500">No analytics data available</p>

  const jobsByCategory = data.categories.map((c) => ({
    name: c.name,
    count: c._count.job,
  })).filter((c) => c.count > 0)

  const jobsByStatus = [
    { name: "Active", value: data.jobStatusDistribution.active },
    { name: "Expired", value: data.jobStatusDistribution.expired },
    { name: "Upcoming", value: data.jobStatusDistribution.upcoming },
  ]

  const usersChartData = data.usersCreatedPerMonth.map((d) => ({
    month: MONTHS[d.month - 1] || `Month ${d.month}`,
    users: d.count,
    jobs: data.jobsCreatedPerMonth.find((j) => j.month === d.month)?.count || 0,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          {(["30d", "90d", "1y"] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "1 Year"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalActiveJobs}</div>
            <p className="text-xs text-gray-500">of {data.overview.totalJobs} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Results</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalResults}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalBookmarks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Users & Jobs Over Time</CardTitle></CardHeader>
          <CardContent>
            {usersChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usersChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} name="Users" />
                  <Line type="monotone" dataKey="jobs" stroke="#16a34a" strokeWidth={2} name="Jobs" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Jobs by Category</CardTitle></CardHeader>
          <CardContent>
            {jobsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobsByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" stroke="#888888" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Jobs by Status</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            {jobsByStatus.some((s) => s.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine
                    label={(entry: { name?: string; percent?: number }) => `${entry.name ?? ''} ${((entry.percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {jobsByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Popular Jobs</CardTitle></CardHeader>
          <CardContent>
            {data.popularJobs.length > 0 ? (
              <div className="space-y-3">
                {(data.popularJobs || []).slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium truncate max-w-[250px]">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.department.name}</p>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{job._count.jobView}</span>
                      <span className="flex items-center gap-1"><Bookmark className="h-3 w-3" />{job._count.bookmark}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{job._count.comment}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">No popular jobs data</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
