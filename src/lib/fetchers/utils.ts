import { prisma } from "@/lib/prisma"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function ensureDepartment(name: string): Promise<string> {
  const slug = slugify(name)
  const existing = await prisma.department.findUnique({ where: { slug } })
  if (existing) return existing.id
  const dept = await prisma.department.create({ data: { name, slug } })
  return dept.id
}

export async function ensureCategory(name: string): Promise<string> {
  const slug = slugify(name)
  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) return existing.id
  const cat = await prisma.category.create({ data: { name, slug } })
  return cat.id
}

export async function ensureState(name: string): Promise<string> {
  const slug = slugify(name)
  const existing = await prisma.state.findUnique({ where: { slug } })
  if (existing) return existing.id
  const state = await prisma.state.create({ data: { name, slug } })
  return state.id
}

export function parseLastDate(text: string): Date | undefined {
  if (!text) return undefined
  const match = text.match(/(\d{1,2})[-/]\s*(\d{1,2})[-/](\d{4})/)
  if (match) {
    const d = new Date(`${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`)
    if (!isNaN(d.getTime())) return d
  }
  const d = new Date(text)
  if (!isNaN(d.getTime())) return d
  return undefined
}

export { slugify }
