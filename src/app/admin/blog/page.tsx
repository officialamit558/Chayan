"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, fetcher } from "@/lib/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { blogPostSchema, type BlogPostInput } from "@/lib/validations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "@/components/ui/toast"
import { formatDate, slugify } from "@/lib/utils"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Image } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BlogItem {
  id: string; title: string; slug: string; excerpt: string | null; author: string | null; image: string | null; tags: string | null; published: boolean; views: number; createdAt: string
}

export default function AdminBlog() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: postsData, isLoading } = useQuery<{ success: boolean; data: BlogItem[]; pagination: { page: number; totalPages: number; total: number } }>({
    queryKey: ["admin-blog", page, search],
    queryFn: () => fetcher(`/api/blog?page=${page}&limit=10&search=${search}`),
  })

  const form = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema) as any,
    defaultValues: { title: "", slug: "", excerpt: null, content: null, author: null, image: null, tags: null, published: false },
  })

  const createMutation = useMutation({
    mutationFn: (data: BlogPostInput) => api.post("/api/blog", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-blog"] }); setDialogOpen(false); form.reset(); toast("Post created", "success") },
    onError: (err: Error) => toast(err.message, "destructive"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPostInput }) => api.put(`/api/blog/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-blog"] }); setDialogOpen(false); setEditingId(null); form.reset(); toast("Post updated", "success") },
    onError: (err: Error) => toast(err.message, "destructive"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/blog/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-blog"] }); setDeleteId(null); toast("Post deleted", "success") },
    onError: (err: Error) => toast(err.message, "destructive"),
  })

  if (status === "loading") return <Skeleton className="h-96" />
  if (!session || session.user.role !== "ADMIN") { router.push("/login"); return null }

  const posts = postsData?.data || []
  const pagination = postsData?.pagination

  const onSubmit = (data: BlogPostInput) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const openEdit = (post: BlogItem) => {
    setEditingId(post.id)
    form.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: null,
      author: post.author,
      image: post.image,
      tags: post.tags,
      published: post.published,
    })
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditingId(null)
    form.reset({ title: "", slug: "", excerpt: null, content: null, author: null, image: null, tags: null, published: false })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button onClick={openCreate}><Plus className="mr-1 h-4 w-4" /> New Post</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-64" /> : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {posts.map((post) => (
                      <motion.tr
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border-b border-gray-200 transition-colors hover:bg-gray-50"
                      >
                        <TableCell className="max-w-[300px] truncate font-medium">
                          <div className="flex items-center gap-2">
                            {post.image && <Image className="h-4 w-4 shrink-0 text-gray-400" />}
                            <span className="truncate">{post.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{post.author || "Chayan"}</TableCell>
                        <TableCell>
                          {post.published ? (
                            <Badge className="bg-green-100 text-green-700"><Eye className="mr-1 h-3 w-3" /> Published</Badge>
                          ) : (
                            <Badge variant="secondary"><EyeOff className="mr-1 h-3 w-3" /> Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell>{post.views}</TableCell>
                        <TableCell>{formatDate(post.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(post.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {posts.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-gray-500">No posts found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              {pagination && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total: {pagination.total} posts</p>
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
            <DialogTitle>{editingId ? "Edit Post" : "New Blog Post"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} onChange={(e) => { field.onChange(e); if (!editingId) form.setValue("slug", slugify(e.target.value)) }} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                  <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="author" render={({ field }) => (
                  <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem><FormLabel>Tags (comma separated)</FormLabel><FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} placeholder="exam-tips, ssc, govt-jobs" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} folder="chayan/blog" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem><FormLabel>Excerpt (short summary)</FormLabel><FormControl><Textarea {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} rows={2} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem><FormLabel>Content (HTML)</FormLabel><FormControl><Textarea {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} rows={12} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="published" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mb-0">Published</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? "Update" : "Create"} Post
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => { if (!o) setDeleteId(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete Post</DialogTitle></DialogHeader>
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
