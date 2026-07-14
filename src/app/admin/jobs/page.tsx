"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, fetcher } from "@/lib/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { jobSchema, type JobInput } from "@/lib/validations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "@/components/ui/toast"
import { formatDate, getStatusColor, slugify } from "@/lib/utils"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Department { id: string; name: string }
interface Category { id: string; name: string }
interface State { id: string; name: string }
interface JobItem {
  id: string; title: string; slug: string; status: string; totalVacancies: number | null; lastDate: string | null; createdAt: string
  department: Department; category: Category; state: State | null
}

export default function AdminJobs() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: jobsData, isLoading } = useQuery<{ success: boolean; data: JobItem[]; pagination: { page: number; totalPages: number; total: number } }>({
    queryKey: ["admin-jobs", page, search, statusFilter],
    queryFn: () => fetcher(`/api/jobs?page=${page}&limit=10&search=${search}&status=${statusFilter}`),
  })

  const { data: deptsData } = useQuery<{ success: boolean; data: Department[] }>({
    queryKey: ["admin-departments"],
    queryFn: () => fetcher("/api/departments"),
  })

  const { data: catsData } = useQuery<{ success: boolean; data: Category[] }>({
    queryKey: ["admin-categories"],
    queryFn: () => fetcher("/api/categories"),
  })

  const { data: statesData } = useQuery<{ success: boolean; data: State[] }>({
    queryKey: ["admin-states"],
    queryFn: () => fetcher("/api/states"),
  })

  const form = useForm<JobInput>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: {
      title: "", slug: "", departmentId: "", categoryId: "", stateId: null,
      advertisementNo: null, totalVacancies: null, salary: null, location: null,
      ageLimit: null, ageRelaxation: null, education: null, selectionProcess: null,
      applicationFee: null, importantDates: null, documentsRequired: null,
      howToApply: null, officialNotification: null, officialWebsite: null,
      applyLink: null, status: "ACTIVE", experience: null, startDate: null, lastDate: null,
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: JobInput) => api.post("/api/jobs", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }); setDialogOpen(false); form.reset(); toast("Job created", "success") },
    onError: (err: Error) => toast(err.message, "destructive"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: JobInput }) => api.put(`/api/jobs/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }); setDialogOpen(false); setEditingId(null); form.reset(); toast("Job updated", "success") },
    onError: (err: Error) => toast(err.message, "destructive"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/jobs/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }); setDeleteId(null); toast("Job deleted", "success") },
    onError: (err: Error) => toast(err.message, "destructive"),
  })

  if (status === "loading") return <Skeleton className="h-96" />
  if (!session || session.user.role !== "ADMIN") { router.push("/login"); return null }

  const jobs = jobsData?.data || []
  const pagination = jobsData?.pagination
  const departments = deptsData?.data || []
  const categories = catsData?.data || []
  const states = statesData?.data || []

  const onSubmit = (data: JobInput) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const openEdit = (job: JobItem) => {
    setEditingId(job.id)
    form.reset({
      title: job.title,
      slug: job.slug,
      departmentId: job.department.id,
      categoryId: job.category.id,
      stateId: job.state?.id || null,
      advertisementNo: null,
      totalVacancies: job.totalVacancies,
      salary: null,
      location: null,
      ageLimit: null,
      ageRelaxation: null,
      education: null,
      selectionProcess: null,
      applicationFee: null,
      importantDates: null,
      documentsRequired: null,
      howToApply: null,
      officialNotification: null,
      officialWebsite: null,
      applyLink: null,
      status: job.status as "ACTIVE" | "EXPIRED" | "UPCOMING",
      experience: null,
      startDate: null,
      lastDate: job.lastDate ? new Date(job.lastDate) : null,
    })
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditingId(null)
    form.reset({
      title: "", slug: "", departmentId: "", categoryId: "", stateId: null,
      advertisementNo: null, totalVacancies: null, salary: null, location: null,
      ageLimit: null, ageRelaxation: null, education: null, selectionProcess: null,
      applicationFee: null, importantDates: null, documentsRequired: null,
      howToApply: null, officialNotification: null, officialWebsite: null,
      applyLink: null, status: "ACTIVE", experience: null, startDate: null, lastDate: null,
    })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Button onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Add New Job</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-64" /> : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Date</TableHead>
                    <TableHead>Vacancies</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {jobs.map((job) => (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border-b border-gray-200 transition-colors hover:bg-gray-50"
                      >
                        <TableCell className="max-w-[250px] truncate font-medium">{job.title}</TableCell>
                        <TableCell>{job.department.name}</TableCell>
                        <TableCell>{job.category.name}</TableCell>
                        <TableCell><Badge className={getStatusColor(job.status)}>{job.status}</Badge></TableCell>
                        <TableCell>{formatDate(job.lastDate)}</TableCell>
                        <TableCell>{job.totalVacancies ?? "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(job)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(job.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {jobs.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-gray-500">No jobs found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              {pagination && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total: {pagination.total} jobs</p>
                  <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Job" : "Add New Job"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); form.setValue("slug", slugify(e.target.value)) }} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="departmentId" render={({ field }) => (
                  <FormItem><FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="categoryId" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="stateId" render={({ field }) => (
                  <FormItem><FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value=" ">None</SelectItem>{states.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="EXPIRED">Expired</SelectItem><SelectItem value="UPCOMING">Upcoming</SelectItem></SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="advertisementNo" render={({ field }) => (
                  <FormItem><FormLabel>Advertisement No</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="totalVacancies" render={({ field }) => (
                  <FormItem><FormLabel>Total Vacancies</FormLabel><FormControl><Input type="number" {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="salary" render={({ field }) => (
                  <FormItem><FormLabel>Salary</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem><FormLabel>Experience</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="ageLimit" render={({ field }) => (
                  <FormItem><FormLabel>Age Limit</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="ageRelaxation" render={({ field }) => (
                  <FormItem><FormLabel>Age Relaxation</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="education" render={({ field }) => (
                <FormItem><FormLabel>Education</FormLabel><FormControl><Textarea {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="selectionProcess" render={({ field }) => (
                <FormItem><FormLabel>Selection Process</FormLabel><FormControl><Textarea {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="applicationFee" render={({ field }) => (
                <FormItem><FormLabel>Application Fee</FormLabel><FormControl><Textarea {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="documentsRequired" render={({ field }) => (
                <FormItem><FormLabel>Documents Required</FormLabel><FormControl><Textarea {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="howToApply" render={({ field }) => (
                <FormItem><FormLabel>How to Apply</FormLabel><FormControl><Textarea {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-3 gap-4">
                <FormField control={form.control} name="officialNotification" render={({ field }) => (
                  <FormItem><FormLabel>Notification URL</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="officialWebsite" render={({ field }) => (
                  <FormItem><FormLabel>Website URL</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="applyLink" render={({ field }) => (
                  <FormItem><FormLabel>Apply Link</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" value={field.value ? formatDate(field.value, "yyyy-MM-dd") : ""} onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="lastDate" render={({ field }) => (
                  <FormItem><FormLabel>Last Date</FormLabel><FormControl><Input type="date" value={field.value ? formatDate(field.value, "yyyy-MM-dd") : ""} onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? "Update" : "Create"} Job
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete Job</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">Are you sure? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
