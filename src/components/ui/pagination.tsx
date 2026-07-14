import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex items-center gap-1">
        <li>
          <PaginationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </PaginationButton>
        </li>
        {pages.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <PaginationButton
                onClick={() => onPageChange(page as number)}
                variant={page === currentPage ? "default" : "outline"}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </PaginationButton>
            )}
          </li>
        ))}
        <li>
          <PaginationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </PaginationButton>
        </li>
      </ul>
    </nav>
  )
}

function PaginationButton({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn("h-9 w-9", className)}
      variant={variant}
      size={size}
      {...props}
    />
  )
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const delta = 1
  const range: number[] = []
  const rangeWithDots: (number | "...")[] = []
  let l: number | null = null

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l !== null && i - l !== 1) {
      rangeWithDots.push("...")
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

export { Pagination }
