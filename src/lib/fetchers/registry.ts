import { importJobs, importAdmitCards, importResults, importAdmissions, importSyllabus, importConfigs } from "./importers"
import type { FetchResult, ImportConfig } from "./types"

export { importConfigs }
export type { ImportConfig }

const importers: Record<string, () => Promise<FetchResult>> = {
  jobs: importJobs,
  "admit-cards": importAdmitCards,
  results: importResults,
  admissions: importAdmissions,
  syllabus: importSyllabus,
}

export function getAvailableImporters(): string[] {
  return Object.keys(importers)
}

export async function importByType(type: string): Promise<FetchResult> {
  const importer = importers[type]
  if (!importer) {
    return { source: type, success: false, imported: 0, skipped: 0, errors: [`Unknown import type: ${type}`] }
  }
  return importer()
}

export async function importAllTypes(): Promise<FetchResult[]> {
  const results: FetchResult[] = []
  for (const [type, importer] of Object.entries(importers)) {
    results.push(await importer())
  }
  return results
}
