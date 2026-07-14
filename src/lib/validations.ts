import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  departmentId: z.string().min(1, "Department is required"),
  categoryId: z.string().min(1, "Category is required"),
  stateId: z.string().nullable().optional(),
  advertisementNo: z.string().nullable().optional(),
  totalVacancies: z.coerce.number().int().positive().nullable().optional(),
  salary: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  ageLimit: z.string().nullable().optional(),
  ageRelaxation: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
  selectionProcess: z.string().nullable().optional(),
  applicationFee: z.string().nullable().optional(),
  importantDates: z.any().nullable().optional(),
  documentsRequired: z.string().nullable().optional(),
  howToApply: z.string().nullable().optional(),
  officialNotification: z.string().nullable().optional(),
  officialWebsite: z.string().nullable().optional(),
  applyLink: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "EXPIRED", "UPCOMING"]).default("ACTIVE"),
  experience: z.string().nullable().optional(),
  startDate: z.coerce.date().nullable().optional(),
  lastDate: z.coerce.date().nullable().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().nullable().optional(),
})

export const resultSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().nullable().optional(),
  departmentId: z.string().min(1, "Department is required"),
  categoryId: z.string().min(1, "Category is required"),
  jobId: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  resultDate: z.coerce.date().nullable().optional(),
  status: z.string().nullable().optional(),
})

export const admitCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().nullable().optional(),
  departmentId: z.string().min(1, "Department is required"),
  categoryId: z.string().min(1, "Category is required"),
  jobId: z.string().nullable().optional(),
  examDate: z.coerce.date().nullable().optional(),
  downloadUrl: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
})

export const answerKeySchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().nullable().optional(),
  departmentId: z.string().min(1, "Department is required"),
  categoryId: z.string().min(1, "Category is required"),
  jobId: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
})

export const admissionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().nullable().optional(),
  departmentId: z.string().min(1, "Department is required"),
  categoryId: z.string().min(1, "Category is required"),
  startDate: z.coerce.date().nullable().optional(),
  lastDate: z.coerce.date().nullable().optional(),
  applicationFee: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
})

export const syllabusSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().nullable().optional(),
  departmentId: z.string().min(1, "Department is required"),
  categoryId: z.string().min(1, "Category is required"),
  jobId: z.string().nullable().optional(),
  pdfUrl: z.string().nullable().optional(),
  subjects: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
})

export const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().nullable().optional(),
  categoryId: z.string().min(1, "Category is required"),
  type: z.string().nullable().optional(),
  isTrending: z.boolean().default(false),
})

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  jobId: z.string().nullable().optional(),
  resultId: z.string().nullable().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").nullable().optional(),
  image: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
})

export const bookmarkSchema = z.object({
  jobId: z.string().nullable().optional(),
  resultId: z.string().nullable().optional(),
  admitCardId: z.string().nullable().optional(),
})

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  department: z.string().optional(),
  state: z.string().optional(),
  status: z.enum(["ACTIVE", "EXPIRED", "UPCOMING"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type JobInput = z.infer<typeof jobSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type ResultInput = z.infer<typeof resultSchema>
export type AdmitCardInput = z.infer<typeof admitCardSchema>
export type AnswerKeyInput = z.infer<typeof answerKeySchema>
export type AdmissionInput = z.infer<typeof admissionSchema>
export type SyllabusInput = z.infer<typeof syllabusSchema>
export type NotificationInput = z.infer<typeof notificationSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type BookmarkInput = z.infer<typeof bookmarkSchema>
export type SearchInput = z.infer<typeof searchSchema>
