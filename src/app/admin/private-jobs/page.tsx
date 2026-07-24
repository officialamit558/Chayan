"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, fetcher } from "@/lib/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { privateJobSchema, type PrivateJobInput } from "@/lib/validations"
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
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "@/components/ui/toast"
import { formatDate, slugify } from "@/lib/utils"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Company { id: string; name: string }
interface PrivateJobItem {
  id: string; title: string; slug: string; type: string; status: string; company: Company; lastDate: string | null; createdAt: string
}
interface PaginationInfo { total: number; page: number; limit: number; totalPages: number }

export default function AdminPrivateJobs() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: jobsData, isLoading } = useQuery<{ success: boolean; data: PrivateJobItem[]; pagination: PaginationInfo }>({
    queryKey: ["admin-private-jobs", page, search, typeFilter],
    queryFn: () => fetcher(`/api/private-jobs?page=${page}&limit=10&search=${search}&type=${typeFilter}`),
  })

  const { data: companiesData } = useQuery<{ success: boolean; data: Company[] }>({
    queryKey: ["admin-companies"],
    queryFn: () => fetcher("/api/companies"),
  })

  const form = useForm<PrivateJobInput>({
    resolver: zodResolver(privateJobSchema) as any,
    defaultValues: {
      title: "", slug: "", companyId: "", type: "FULL_TIME",
      category: null, description: null, location: null, salary: null,
      experience: null, applicationUrl: null, applicationEmail: null,
      lastDate: null, status: "ACTIVE",
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: PrivateJobInput) => api.post("/api/private-jobs", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-private-jobs"] }); setDialogOpen(false); form.reset(); toast("Private job created", "success") },
    onError: (err: Error) => toast(err.message, "destructive"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PrivateJobInput }) => api.put(`/api/private-jobs/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-private-jobs"] }); setDialogOpen(false); setEditingId(null); form.reset(); toast("Private job updated", "success") },
    onError: (err: Error) => toast(err.message, "destructive"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/private-jobs/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-private-jobs"] }); setDeleteId(null); toast("Private job deleted", "success") },
    onError: (err: Error) => toast(err.message, "destructive"),
  })

  if (status === "loading") return <Skeleton className="h-96" />
  if (!session || session.user.role !== "ADMIN") { router.push("/login"); return null }

  const jobs = jobsData?.data || []
  const pagination = jobsData?.pagination
  const companies = companiesData?.data || []

  const onSubmit = (data: PrivateJobInput) => {
    if (editingId) updateMutation.mutate({ id: editingId, data })
    else createMutation.mutate(data)
  }

  const openEdit = (job: PrivateJobItem) => {
    setEditingId(job.id)
    form.reset({
      title: job.title, slug: job.slug, companyId: job.company.id,
      type: job.type as any, category: null, description: null,
      location: null, salary: null, experience: null,
      applicationUrl: null, applicationEmail: null,
      lastDate: job.lastDate ? new Date(job.lastDate) : null,
      status: job.status as "ACTIVE" | "EXPIRED",
    })
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditingId(null)
    form.reset({ title: "", slug: "", companyId: "", type: "FULL_TIME", category: null, description: null, location: null, salary: null, experience: null, applicationUrl: null, applicationEmail: null, lastDate: null, status: "ACTIVE" })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Private Jobs</h1>
        <Button onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> Add New Private Job</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search private jobs..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Types</SelectItem>
                <SelectItem value="FULL_TIME">Full-Time</SelectItem>
                <SelectItem value="PART_TIME">Part-Time</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
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
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {jobs.map((job: PrivateJobItem) => (
                      <motion.tr key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border-b border-gray-200 transition-colors hover:bg-gray-50">
                        <TableCell className="max-w-[250px] truncate font-medium">{job.title}</TableCell>
                        <TableCell>{job.company.name}</TableCell>
                        <TableCell><Badge variant="outline">{job.type.replace("_", " ")}</Badge></TableCell>
                        <TableCell><Badge variant={job.status === "ACTIVE" ? "default" : "secondary"}>{job.status}</Badge></TableCell>
                        <TableCell>{job.lastDate ? formatDate(job.lastDate) : "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(job)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(job.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {jobs.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-gray-500">No private jobs found</TableCell></TableRow>}
                </TableBody>
              </Table>
              {pagination && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total: {pagination.total} private jobs</p>
                  <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader><DialogTitle>{editingId ? "Edit Private Job" : "Add New Private Job"}</DialogTitle></DialogHeader>
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
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="companyId" render={({ field }) => (
                  <FormItem><FormLabel>Company</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger></FormControl>
                      <SelectContent>{companies.map((c: Company) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem><FormLabel>Job Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full-Time</SelectItem>
                        <SelectItem value="PART_TIME">Part-Time</SelectItem>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Industry / Category</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="EXPIRED">Expired</SelectItem></SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description (Rich Text / HTML)</FormLabel><FormControl><Textarea {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} rows={5} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="salary" render={({ field }) => (
                  <FormItem><FormLabel>Salary</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem><FormLabel>Experience Required</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="lastDate" render={({ field }) => (
                  <FormItem><FormLabel>Last Date</FormLabel><FormControl><Input type="date" value={field.value ? formatDate(field.value, "yyyy-MM-dd") : ""} onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="applicationUrl" render={({ field }) => (
                  <FormItem><FormLabel>Application URL</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="applicationEmail" render={({ field }) => (
                  <FormItem><FormLabel>Application Email</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? "Update" : "Create"} Private Job
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete Private Job</DialogTitle></DialogHeader>
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