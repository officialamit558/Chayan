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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Pagination } from "@/components/ui/pagination"
import { toast } from "@/components/ui/toast"
import { formatDate, slugify } from "@/lib/utils"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { RichEditor } from "@/components/admin/RichEditor"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Image, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BlogItem {
  id: string; title: string; slug: string; excerpt: string | null; author: string | null; image: string | null; tags: string | null; categoryId: string | null; category: { id: string; name: string; slug: string; color: string | null } | null; published: boolean; views: number; createdAt: string
}

interface BlogCategoryItem {
  id: string; name: string; slug: string; color: string | null
}

const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  teal: "bg-teal-100 text-teal-700",
  violet: "bg-violet-100 text-violet-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
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

  const { data: categoriesData } = useQuery<{ success: boolean; data: BlogCategoryItem[] }>({
    queryKey: ["blog-categories"],
    queryFn: () => fetcher("/api/blog-categories"),
  })

  const categories = categoriesData?.data || []

  const form = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema) as any,
    defaultValues: { title: "", slug: "", excerpt: null, content: null, author: null, image: null, tags: null, categoryId: null, published: false },
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
      content: (post as any).content || null,
      author: post.author,
      image: post.image,
      tags: post.tags,
      categoryId: post.categoryId,
      published: post.published,
    })
    setDialogOpen(true)
  }

  const openCreate = () => {
    setEditingId(null)
    form.reset({ title: "", slug: "", excerpt: null, content: null, author: null, image: null, tags: null, categoryId: null, published: false })
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
                    <TableHead>Category</TableHead>
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
                        <TableCell>
                          {post.category ? (
                            <Badge className={CATEGORY_BADGE_CLASSES[post.category.color || ""] || "bg-blue-100 text-blue-700"}>
                              {post.category.name}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Uncategorized</Badge>
                          )}
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
                    <TableRow><TableCell colSpan={7} className="text-center text-gray-500">No posts found</TableCell></TableRow>
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
        <DialogContent className="!flex !max-w-[95vw] !max-h-[95vh] flex-col p-0 gap-0">
          <DialogHeader className="flex flex-row items-center justify-between border-b px-6 py-4 shrink-0">
            <div>
              <DialogTitle className="text-xl">{editingId ? "Edit Post" : "New Blog Post"}</DialogTitle>
              <DialogDescription>Create and manage your blog content</DialogDescription>
            </div>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 overflow-hidden">
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormControl>
                        <input
                          {...field}
                          placeholder="Post title..."
                          onChange={(e) => { field.onChange(e); if (!editingId) form.setValue("slug", slugify(e.target.value)) }}
                          className="w-full border-0 bg-transparent text-3xl font-bold outline-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RichEditor value={field.value || ""} onChange={(val) => field.onChange(val || null)} placeholder="Start writing..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
              <div className="w-80 shrink-0 overflow-y-auto border-l bg-gray-50 p-6 dark:bg-gray-900/50">
                <div className="space-y-5">
                  <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">Slug</FormLabel>
                      <FormControl><Input {...field} className="text-sm" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="author" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">Author</FormLabel>
                      <FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} placeholder="Chayan" className="text-sm" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="tags" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tags</FormLabel>
                      <FormControl><Input {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} placeholder="exam-tips, ssc, govt-jobs" className="text-sm" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="categoryId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">Category</FormLabel>
                      <FormControl>
                        <Select value={field.value || ""} onValueChange={(val) => field.onChange(val === "none" ? null : val)}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No category</SelectItem>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">Featured Image</FormLabel>
                      <FormControl>
                        <ImageUpload value={field.value} onChange={field.onChange} folder="chayan/blog" className="!p-3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="excerpt" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-gray-500">Excerpt</FormLabel>
                      <FormControl><Textarea {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value || null)} rows={3} className="text-sm" placeholder="Brief summary for listings..." /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="published" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                      <div>
                        <FormLabel className="text-sm font-medium">Published</FormLabel>
                        <p className="text-xs text-gray-500">{field.value ? "Visible to readers" : "Saved as draft"}</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex flex-col gap-2 pt-2">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      {editingId ? "Update Post" : "Publish Post"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="w-full">
                      Cancel
                    </Button>
                  </div>
                </div>
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
