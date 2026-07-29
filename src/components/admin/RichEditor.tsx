"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyleKit } from "@tiptap/extension-text-style"
import Highlight from "@tiptap/extension-highlight"
import LinkExtension from "@tiptap/extension-link"
import ImageExtension from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Dropcursor from "@tiptap/extension-dropcursor"
import CharacterCount from "@tiptap/extension-character-count"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Heading4,
  List, ListOrdered, ListChecks,
  Quote, Code, Code2, Minus,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link, Image, Table as TableIcon,
  Palette, Highlighter, Type, Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Undo2, Redo2, Eraser, Maximize2, Minimize2,
  Pilcrow,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCallback, useState, useRef, useEffect } from "react"
import { toast } from "@/components/ui/toast"

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const ResizableImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        parseHTML: (el) => el.getAttribute("data-align") || "center",
        renderHTML: (attrs) => {
          if (!attrs.align || attrs.align === "center") return {}
          return { "data-align": attrs.align }
        },
      },
    }
  },
})

const FONT_FAMILIES = [
  { label: "Default", value: "Inter, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
]

const FONT_SIZES = [
  { label: "Small", value: "12px" },
  { label: "Normal", value: "16px" },
  { label: "Medium", value: "18px" },
  { label: "Large", value: "24px" },
  { label: "XL", value: "32px" },
  { label: "2XL", value: "40px" },
]

const TEXT_COLORS = [
  "#000000", "#ffffff", "#dc2626", "#ea580c", "#d97706",
  "#65a30d", "#16a34a", "#0891b2", "#2563eb", "#7c3aed",
  "#db2777", "#78716c",
]

const HIGHLIGHT_COLORS = [
  "#fef08a", "#fecaca", "#fed7aa", "#bbf7d0", "#bfdbfe",
  "#e9d5ff", "#fecdd3", "#fde68a", "#d1d5db",
]

const IMAGE_SIZES = [
  { label: "Auto", value: "" },
  { label: "25%", value: "25%" },
  { label: "50%", value: "50%" },
  { label: "75%", value: "75%" },
  { label: "100%", value: "100%" },
]

const ALIGN_OPTIONS = [
  { value: "left", label: "L", icon: AlignLeft, title: "Float Left" },
  { value: "center", label: "C", icon: AlignCenter, title: "Center" },
  { value: "right", label: "R", icon: AlignRight, title: "Float Right" },
]

function ToolBtn({
  active,
  onClick,
  children,
  title,
  disabled,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded text-sm transition-colors",
        active
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  )
}

function Dropdown({
  trigger,
  open,
  onToggle,
  children,
}: {
  trigger: React.ReactNode
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded text-sm transition-colors",
          open
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
        )}
      >
        {trigger}
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  )
}

const Divider = () => (
  <div className="mx-1 h-6 w-px shrink-0 bg-gray-300 dark:bg-gray-600" />
)

function DropItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {children}
    </button>
  )
}

export function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const [showFont, setShowFont] = useState(false)
  const [showSize, setShowSize] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const closeAllDropdowns = useCallback(() => {
    setShowFont(false)
    setShowSize(false)
    setShowColors(false)
    setShowHighlight(false)
    setShowTable(false)
    setShowLinkInput(false)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        closeAllDropdowns()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [closeAllDropdowns])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: { HTMLAttributes: { class: "!bg-muted" } },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyleKit.configure({
        color: { types: ["textStyle"] },
        fontFamily: { types: ["textStyle"] },
        fontSize: { types: ["textStyle"] },
        lineHeight: false,
        backgroundColor: false,
      }),
      Highlight.configure({ multicolor: true }),
      LinkExtension.configure({ openOnClick: false }),
      ResizableImage,
      Placeholder.configure({ placeholder: placeholder || "Start writing your blog content..." }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({ nested: true }),
      Subscript,
      Superscript,
      Dropcursor.configure({ color: "#2563eb", width: 2 }),
      CharacterCount.configure({ limit: 50000 }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return
      if (!file.type.startsWith("image/")) {
        toast("Please select an image file", "destructive")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast("Image must be under 5MB", "destructive")
        return
      }
      setUploading(true)
      try {
        const formData = new FormData()
        formData.set("file", file)
        formData.set("folder", "chayan/blog")
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const json = await res.json()
        if (json.success) {
          editor.chain().focus().setImage({ src: json.url, align: "center" } as any).run()
          toast("Image inserted", "success")
        } else {
          toast(json.error || "Upload failed", "destructive")
        }
      } catch {
        toast("Upload failed. Check connection.", "destructive")
      } finally {
        setUploading(false)
      }
    },
    [editor],
  )

  const handleImageButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) uploadImage(file)
      e.target.value = ""
    },
    [uploadImage],
  )

  const updateImageAttr = useCallback(
    (attr: string, value: string | null) => {
      if (!editor) return
      editor.chain().focus().updateAttributes("image", { [attr]: value }).run()
    },
    [editor],
  )

  const toggleLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href || ""
    if (previousUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    setLinkUrl("https://")
    setShowLinkInput(true)
  }, [editor])

  const applyLink = useCallback(() => {
    if (!editor) return
    if (linkUrl === "" || linkUrl === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    }
    setShowLinkInput(false)
    setLinkUrl("")
  }, [editor, linkUrl])

  const insertTable = useCallback(
    (rows: number, cols: number) => {
      if (!editor) return
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
      setShowTable(false)
    },
    [editor],
  )

  const clearFormatting = useCallback(() => {
    if (!editor) return
    editor.chain().focus().clearNodes().unsetAllMarks().run()
  }, [editor])

  if (!editor) return null

  const chars = editor.storage.characterCount?.characters?.() ?? 0
  const words = editor.storage.characterCount?.words?.() ?? 0
  const isImageSelected = editor.isActive("image")
  const imgAttrs = editor.getAttributes("image")
  const hasTable = editor.isActive("table")

  return (
    <div
      ref={editorRef}
      className={cn(
        "overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700",
        fullscreen && "fixed inset-4 z-[100] flex flex-col bg-background shadow-2xl",
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Image Toolbar (shown when image is selected) */}
      {isImageSelected && (
        <div className="flex flex-wrap items-center gap-2 border-b bg-blue-50 px-4 py-2 dark:bg-blue-950">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Image</span>
          <Divider />
          <div className="flex items-center gap-0.5">
            {ALIGN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                title={opt.title}
                onClick={() => updateImageAttr("align", opt.value === imgAttrs.align ? "center" : opt.value)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded text-xs transition-colors",
                  imgAttrs.align === opt.value
                    ? "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                    : "text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800",
                )}
              >
                <opt.icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <Divider />
          <div className="flex items-center gap-1">
            <span className="text-xs text-blue-600 dark:text-blue-400">Size:</span>
            <select
              value={imgAttrs.width || ""}
              onChange={(e) => updateImageAttr("width", e.target.value || null)}
              className="rounded border border-blue-200 bg-white px-2 py-1 text-xs outline-none dark:border-blue-800 dark:bg-gray-800"
            >
              {IMAGE_SIZES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="px"
              value={imgAttrs.width ? parseInt(imgAttrs.width) || "" : ""}
              onChange={(e) => updateImageAttr("width", e.target.value ? e.target.value + "px" : null)}
              className="w-16 rounded border border-blue-200 bg-white px-2 py-1 text-xs outline-none dark:border-blue-800 dark:bg-gray-800"
            />
            <span className="text-xs text-blue-400">px</span>
          </div>
          <Divider />
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().deleteSelection().run()
            }}
            className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            Delete
          </button>
        </div>
      )}

      {/* Main Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 border-b border-gray-300 bg-gray-50 p-1.5 dark:border-gray-700 dark:bg-gray-900"
        onClick={closeAllDropdowns}
      >
        {/* History */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)" disabled={!editor.can().undo()}>
          <Undo2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Shift+Z)" disabled={!editor.can().redo()}>
          <Redo2 className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        {/* Text Formatting */}
        <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (Ctrl+B)">
          <Bold className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (Ctrl+I)">
          <Italic className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline (Ctrl+U)">
          <UnderlineIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()} title="Subscript">
          <SubscriptIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()} title="Superscript">
          <SuperscriptIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline Code">
          <Code className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} title="Paragraph">
          <Pilcrow className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} title="Heading 4">
          <Heading4 className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        {/* Lists & Blocks */}
        <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
          <List className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">
          <ListOrdered className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()} title="Task List">
          <ListChecks className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
          <Quote className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block">
          <Code2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align Left">
          <AlignLeft className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align Center">
          <AlignCenter className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align Right">
          <AlignRight className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify (Ctrl+Shift+J)">
          <AlignJustify className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        {/* Insert: Link, Image, Table */}
        <ToolBtn active={editor.isActive("link")} onClick={toggleLink} title="Link">
          <Link className="h-4 w-4" />
        </ToolBtn>

        {showLinkInput && (
          <div className="flex items-center gap-1 rounded border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") setShowLinkInput(false) }}
              className="h-7 w-48 rounded border-0 bg-transparent px-2 text-xs outline-none"
              placeholder="https://..."
              autoFocus
            />
            <button type="button" onClick={applyLink} className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">Set</button>
          </div>
        )}

        <ToolBtn onClick={handleImageButtonClick} title="Upload Image" active={uploading}>
          {uploading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <Image className="h-4 w-4" />
          )}
        </ToolBtn>

        <Dropdown trigger={<TableIcon className="h-4 w-4" />} open={showTable} onToggle={() => { closeAllDropdowns(); setShowTable(!showTable) }}>
          <div className="min-w-[180px]">
            {hasTable && (
              <>
                <p className="px-2 py-1 text-xs font-medium text-gray-500">Table Actions</p>
                <DropItem onClick={() => { editor.chain().focus().addColumnBefore().run(); setShowTable(false) }}>Add Column Before</DropItem>
                <DropItem onClick={() => { editor.chain().focus().addColumnAfter().run(); setShowTable(false) }}>Add Column After</DropItem>
                <DropItem onClick={() => { editor.chain().focus().addRowBefore().run(); setShowTable(false) }}>Add Row Before</DropItem>
                <DropItem onClick={() => { editor.chain().focus().addRowAfter().run(); setShowTable(false) }}>Add Row After</DropItem>
                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                <DropItem onClick={() => { editor.chain().focus().deleteColumn().run(); setShowTable(false) }}>Delete Column</DropItem>
                <DropItem onClick={() => { editor.chain().focus().deleteRow().run(); setShowTable(false) }}>Delete Row</DropItem>
                <DropItem onClick={() => { editor.chain().focus().deleteTable().run(); setShowTable(false) }}>Delete Table</DropItem>
                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
              </>
            )}
            <p className="px-2 py-1 text-xs font-medium text-gray-500">Insert Table</p>
            {[2, 3, 4, 5].map((n) => (
              <DropItem key={n} onClick={() => insertTable(n, n)}>
                {n} x {n} Table
              </DropItem>
            ))}
          </div>
        </Dropdown>

        <Divider />

        {/* Style Dropdowns */}
        <Dropdown trigger={<Type className="h-4 w-4" />} open={showFont} onToggle={() => { closeAllDropdowns(); setShowFont(!showFont) }}>
          {FONT_FAMILIES.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => {
                const activeFont = editor.getAttributes("textStyle").fontFamily
                if (activeFont === font.value) {
                  editor.chain().focus().unsetFontFamily().run()
                } else {
                  editor.chain().focus().setFontFamily(font.value).run()
                }
                setShowFont(false)
              }}
              className={cn(
                "flex w-full items-center gap-2 whitespace-nowrap rounded px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800",
                editor.getAttributes("textStyle").fontFamily === font.value && "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
              )}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </button>
          ))}
        </Dropdown>

        <Dropdown trigger={<span className="text-xs font-medium">16</span>} open={showSize} onToggle={() => { closeAllDropdowns(); setShowSize(!showSize) }}>
          {FONT_SIZES.map((size) => (
            <button
              key={size.value}
              type="button"
              onClick={() => {
                const currentSize = editor.getAttributes("textStyle").fontSize
                if (currentSize === size.value) {
                  editor.chain().focus().unsetFontSize().run()
                } else {
                  editor.chain().focus().setFontSize(size.value).run()
                }
                setShowSize(false)
              }}
              className={cn(
                "flex w-full items-center gap-2 whitespace-nowrap rounded px-3 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800",
                editor.getAttributes("textStyle").fontSize === size.value && "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
              )}
            >
              {size.label}
            </button>
          ))}
        </Dropdown>

        {/* Text Color */}
        <Dropdown trigger={<Palette className="h-4 w-4" />} open={showColors} onToggle={() => { closeAllDropdowns(); setShowColors(!showColors) }}>
          <div className="grid grid-cols-6 gap-1 p-1">
            {TEXT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  const activeColor = editor.getAttributes("textStyle").color
                  if (activeColor === color) {
                    editor.chain().focus().unsetColor().run()
                  } else {
                    editor.chain().focus().setColor(color).run()
                  }
                  setShowColors(false)
                }}
                className="h-6 w-6 rounded border border-gray-200 hover:scale-110 dark:border-gray-600"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            <button
              type="button"
              onClick={() => { editor.chain().focus().unsetColor().run(); setShowColors(false) }}
              className="col-span-6 mt-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            >
              Remove Color
            </button>
          </div>
        </Dropdown>

        {/* Highlight */}
        <Dropdown trigger={<Highlighter className="h-4 w-4" />} open={showHighlight} onToggle={() => { closeAllDropdowns(); setShowHighlight(!showHighlight) }}>
          <div className="grid grid-cols-5 gap-1 p-1">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color }).run()
                  setShowHighlight(false)
                }}
                className="h-6 w-6 rounded border border-gray-200 hover:scale-110 dark:border-gray-600"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            <button
              type="button"
              onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlight(false) }}
              className="col-span-5 mt-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            >
              Remove Highlight
            </button>
          </div>
        </Dropdown>

        <Divider />

        <ToolBtn onClick={clearFormatting} title="Clear Formatting">
          <Eraser className="h-4 w-4" />
        </ToolBtn>

        <ToolBtn onClick={() => setFullscreen(!fullscreen)} title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </ToolBtn>
      </div>

      {/* Editor Content */}
      <div className={cn("overflow-y-auto", fullscreen && "flex-1")}>
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-6 focus:outline-none dark:prose-invert"
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-gray-300 bg-gray-50 px-4 py-1.5 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>{words} words</span>
          <span>{chars} characters</span>
        </div>
        <div className="flex items-center gap-2">
          {editor.isActive("bold") && <span className="font-semibold">B</span>}
          {editor.isActive("italic") && <span className="italic">I</span>}
          {editor.isActive("underline") && <span className="underline">U</span>}
        </div>
      </div>
    </div>
  )
}
