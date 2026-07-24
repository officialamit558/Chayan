import { createRequire } from "module"
import { extractSkills, extractExperienceYears, extractEducationLevel, extractLocations } from "./skills"

const require = createRequire(import.meta.url)

export interface ParsedResume {
  rawText: string
  skills: string[]
  experience: number
  education: string
  locations: string[]
}

export async function parseResumeBuffer(buffer: Buffer, fileType: string): Promise<ParsedResume> {
  let text = ""

  if (fileType === "application/pdf") {
    const pdfParse = require("pdf-parse/lib/pdf-parse.js")
    const data = await pdfParse(buffer)
    text = data.text || ""
  } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const mammoth = await import("mammoth")
    const result = await mammoth.extractRawText({ buffer })
    text = result.value
  } else {
    text = buffer.toString("utf-8")
  }

  return {
    rawText: text,
    skills: extractSkills(text),
    experience: extractExperienceYears(text),
    education: extractEducationLevel(text),
    locations: extractLocations(text),
  }
}