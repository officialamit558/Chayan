export type Role = "USER" | "ADMIN"
export type JobStatus = "ACTIVE" | "EXPIRED" | "UPCOMING"

export interface UserProfile {
  id: string
  name: string | null
  email: string
  password: string | null
  image: string | null
  role: Role
  emailVerified: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
}

export type UserWithRole = Pick<UserProfile, "id" | "name" | "email" | "image" | "role">

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
  jobCount?: number
}

export interface Department {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
}

export interface State {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface Job {
  id: string
  title: string
  slug: string
  departmentId: string
  categoryId: string
  stateId: string | null
  advertisementNo: string | null
  totalVacancies: number | null
  salary: string | null
  location: string | null
  ageLimit: string | null
  ageRelaxation: string | null
  education: string | null
  selectionProcess: string | null
  applicationFee: string | null
  importantDates: Record<string, string> | null
  documentsRequired: string | null
  howToApply: string | null
  officialNotification: string | null
  officialWebsite: string | null
  applyLink: string | null
  status: JobStatus
  experience: string | null
  startDate: string | null
  lastDate: string | null
  createdAt: string
  updatedAt: string
}

export interface JobWithRelations extends Job {
  department: Department
  category: Category
  state: State | null
  bookmarks?: Bookmark[]
  comments?: Comment[]
}

export interface Result {
  id: string
  title: string
  slug: string
  description: string | null
  departmentId: string
  categoryId: string
  jobId: string | null
  pdfUrl: string | null
  resultDate: string | null
  status: string | null
  createdAt: string
}

export interface ResultWithRelations extends Result {
  department: Department
  category: Category
  job: Job | null
}

export interface AdmitCard {
  id: string
  title: string
  slug: string
  description: string | null
  departmentId: string
  categoryId: string
  jobId: string | null
  examDate: string | null
  downloadUrl: string | null
  status: string | null
  createdAt: string
}

export interface AdmitCardWithRelations extends AdmitCard {
  department: Department
  category: Category
  job: Job | null
}

export interface AnswerKey {
  id: string
  title: string
  slug: string
  description: string | null
  departmentId: string
  categoryId: string
  jobId: string | null
  pdfUrl: string | null
  status: string | null
  createdAt: string
}

export interface AnswerKeyWithRelations extends AnswerKey {
  department: Department
  category: Category
  job: Job | null
}

export interface Admission {
  id: string
  title: string
  slug: string
  description: string | null
  departmentId: string
  categoryId: string
  startDate: string | null
  lastDate: string | null
  applicationFee: string | null
  pdfUrl: string | null
  status: string | null
  createdAt: string
}

export interface AdmissionWithRelations extends Admission {
  department: Department
  category: Category
}

export interface Syllabus {
  id: string
  title: string
  slug: string
  description: string | null
  departmentId: string
  categoryId: string
  jobId: string | null
  pdfUrl: string | null
  subjects: string | null
  status: string | null
  createdAt: string
}

export interface SyllabusWithRelations extends Syllabus {
  department: Department
  category: Category
  job: Job | null
}

export interface Notification {
  id: string
  title: string
  slug: string
  content: string | null
  categoryId: string
  type: string | null
  isTrending: boolean
  views: number
  createdAt: string
}

export interface NotificationWithRelations extends Notification {
  category: Category
}

export interface Exam {
  id: string
  name: string
  slug: string
  description: string | null
  categoryId: string
  createdAt: string
}

export interface Bookmark {
  id: string
  userId: string
  jobId: string | null
  resultId: string | null
  admitCardId: string | null
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  userId: string
  jobId: string | null
  resultId: string | null
  createdAt: string
  user: UserWithRole
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface SearchParams {
  q?: string
  category?: string
  department?: string
  state?: string
  status?: JobStatus
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
}

export interface FilterParams {
  category?: string[]
  department?: string[]
  state?: string[]
  status?: JobStatus[]
  qualification?: string[]
  salaryMin?: number
  salaryMax?: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: Pagination
  message?: string
}
