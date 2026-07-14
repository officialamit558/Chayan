"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastVariant = "default" | "destructive" | "success"

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastState {
  toasts: Toast[]
}

type ToastAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: string }

let listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }

function dispatch(action: ToastAction) {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState = { toasts: [...memoryState.toasts, action.toast] }
      break
    case "REMOVE_TOAST":
      memoryState = {
        toasts: memoryState.toasts.filter((t) => t.id !== action.id),
      }
      break
  }
  listeners.forEach((listener) => listener(memoryState))
}

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

function toast(message: string, variant: ToastVariant = "default") {
  const id = genId()
  dispatch({ type: "ADD_TOAST", toast: { id, message, variant } })
  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", id })
  }, 4000)
  return id
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      listeners = listeners.filter((l) => l !== setState)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (id: string) => dispatch({ type: "REMOVE_TOAST", id }),
  }
}

const variantStyles: Record<ToastVariant, string> = {
  default: "border-gray-200 bg-white text-gray-950",
  destructive: "border-red-200 bg-red-50 text-red-800",
  success: "border-green-200 bg-green-50 text-green-800",
}

function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-2 rounded-md border px-4 py-3 shadow-lg transition-all animate-in slide-in-from-bottom-2",
            variantStyles[t.variant]
          )}
        >
          <p className="text-sm">{t.message}</p>
          <button
            onClick={() => dismiss(t.id)}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm opacity-60 transition-opacity hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

export { toast, useToast, Toaster }
export type { ToastVariant }
