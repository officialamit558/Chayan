import { extractSkills, extractExperienceYears, extractEducationLevel, extractLocations } from "./skills"

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
    const { PDFParse } = await import("pdf-parse")
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    const result = await parser.getText({})
    text = result?.text || result?.pages?.map((p: { text: string }) => p.text).join("\n") || ""
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