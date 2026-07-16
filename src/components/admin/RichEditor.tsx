"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import LinkExtension from "@tiptap/extension-link"
import ImageExtension from "@tiptap/extension-image"
import FontFamily from "@tiptap/extension-font-family"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, AlignLeft, AlignCenter, AlignRight,
  Link, Image, Highlighter, Palette, Type, Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCallback, useState } from "react"

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const FONT_FAMILIES = [
  "Inter, sans-serif",
  "Arial, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Courier New, monospace",
  "Verdana, sans-serif",
  "Trebuchet MS, sans-serif",
]

const TEXT_COLORS = [
  "#000000", "#ffffff", "#dc2626", "#ea580c", "#d97706",
  "#65a30d", "#16a34a", "#0891b2", "#2563eb", "#7c3aed",
  "#db2777", "#78716c",
]

const HIGHLIGHT_COLORS = [
  "#fef08a", "#fecaca", "#fed7aa", "#bbf7d0", "#bfdbfe",
  "#e9d5ff", "#fecdd3", "#fde68a",
]

export function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const [showColors, setShowColors] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)
  const [showFont, setShowFont] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      FontFamily,
      Placeholder.configure({ placeholder: placeholder || "Start writing your blog content..." }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const toggleLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter URL", previousUrl || "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt("Enter image URL", "https://")
    if (url && url !== "https://") {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const ToolBtn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded text-sm transition-colors",
        active
          ? "bg-teal-100 text-teal-700"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      )}
    >
      {children}
    </button>
  )

  return (
    <div className="overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-300 bg-gray-50 p-1.5 dark:border-gray-700 dark:bg-gray-900">
        <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
          <UnderlineIcon className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        <ToolBtn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
          <List className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">
          <ListOrdered className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
          <Quote className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block">
          <Code className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        <ToolBtn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align Left">
          <AlignLeft className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align Center">
          <AlignCenter className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align Right">
          <AlignRight className="h-4 w-4" />
        </ToolBtn>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        <div className="relative">
          <ToolBtn active={showFont} onClick={() => setShowFont(!showFont)} title="Font Family">
            <Type className="h-4 w-4" />
          </ToolBtn>
          {showFont && (
            <div className="absolute left-0 top-full z-50 mt-1 flex flex-col gap-0.5 rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {FONT_FAMILIES.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setFontFamily(font).run()
                    setShowFont(false)
                  }}
                  className="whitespace-nowrap rounded px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{ fontFamily: font }}
                >
                  {font.split(",")[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <ToolBtn active={showColors} onClick={() => setShowColors(!showColors)} title="Text Color">
            <Palette className="h-4 w-4" />
          </ToolBtn>
          {showColors && (
            <div className="absolute left-0 top-full z-50 mt-1 grid grid-cols-6 gap-1 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setColor(color).run()
                    setShowColors(false)
                  }}
                  className="h-6 w-6 rounded border border-gray-200 hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <ToolBtn active={showHighlight} onClick={() => setShowHighlight(!showHighlight)} title="Highlight">
            <Highlighter className="h-4 w-4" />
          </ToolBtn>
          {showHighlight && (
            <div className="absolute left-0 top-full z-50 mt-1 grid grid-cols-4 gap-1 rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run()
                    setShowHighlight(false)
                  }}
                  className="h-6 w-6 rounded border border-gray-200 hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />

        <ToolBtn active={editor.isActive("link")} onClick={toggleLink} title="Link">
          <Link className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={addImage} title="Image">
          <Image className="h-4 w-4" />
        </ToolBtn>

        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus className="h-4 w-4" />
        </ToolBtn>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 focus:outline-none dark:prose-invert min-h-[300px]"
      />
    </div>
  )
}
