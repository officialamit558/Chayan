"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, FileText, CheckCircle, X, Loader2, Briefcase, GraduationCap, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"

interface ResumeData {
  id: string
  fileName: string
  skills: string[]
  experience: number
  education: string
  locations: string[]
  createdAt: string
  updatedAt: string
}

export function ResumeUpload({ onResumeChange }: { onResumeChange?: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/user/resume")
      .then(r => r.json())
      .then(d => { if (!cancelled && d.success && d.data) setResume(d.data) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const handleFile = async (file: File) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]
    if (!allowed.includes(file.type)) {
      toast("Only PDF, DOCX, and TXT files are supported", "destructive")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("File must be under 5MB", "destructive")
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/user/resume", { method: "POST", body: formData })
      const json = await res.json()
      if (json.success) {
        setResume(json.data)
        toast("Resume uploaded and analyzed successfully", "success")
        if (onResumeChange) onResumeChange()
      } else {
        toast(json.error || "Upload failed", "destructive")
      }
    } catch {
      toast("Failed to upload resume", "destructive")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </CardContent>
      </Card>
    )
  }

  if (resume) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            Your Resume
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => { setResume(null); inputRef.current?.click() }}>
            <Upload className="mr-1 h-4 w-4" /> Update
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            {resume.fileName}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Briefcase className="h-4 w-4" /> Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.slice(0, 12).map(s => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
              {resume.skills.length > 12 && (
                <Badge variant="outline" className="text-xs">+{resume.skills.length - 12} more</Badge>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap className="h-4 w-4" />
              {resume.education === "unknown" ? "Not detected" : resume.education}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="h-4 w-4" />
              {resume.experience > 0 ? `${resume.experience} years` : "Entry level"}
            </div>
            {(resume.locations || []).length > 0 && (
              <div className="flex items-center gap-2 text-gray-600 col-span-2">
                <MapPin className="h-4 w-4" />
                {resume.locations.join(", ")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5 text-teal-600" />
          Upload Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            dragOver ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-400"
          }`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mb-4 h-10 w-10 text-gray-400" />
          <p className="mb-1 text-sm font-medium text-gray-700">Drop your resume here or click to browse</p>
          <p className="text-xs text-gray-500">Supports PDF, DOCX, TXT (max 5MB)</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
          <Button variant="outline" size="sm" className="mt-4" disabled={uploading}>
            {uploading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Upload className="mr-1 h-4 w-4" />}
            {uploading ? "Analyzing..." : "Choose File"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}