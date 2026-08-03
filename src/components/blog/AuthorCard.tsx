import { Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuthorCardProps {
  name: string
  bio?: string
  category?: string | null
}

export function AuthorCard({ name, bio, category }: AuthorCardProps) {
  return (
    <div className="mt-8 flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/60">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1e3a5f] to-blue-700 text-xl font-bold text-white">
        {name.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{name}</p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {bio || "Editor at Chayan — writes practical guides on careers, skills and money."}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {category && <Badge variant="secondary" className="text-[10px]">{category}</Badge>}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Mail className="h-3 w-3" /> Chayan Editorial
          </span>
        </div>
      </div>
    </div>
  )
}