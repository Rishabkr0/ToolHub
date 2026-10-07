export interface DuplicateCleanerOptions {
  caseSensitive: boolean
  trimWhitespace: boolean
  removeEmptyLines: boolean
  sortOrder: "original" | "asc" | "desc" | "length-asc" | "length-desc"
}

export interface DuplicateCleanerResult {
  cleanedText: string
  originalCount: number
  cleanedCount: number
  removedCount: number
}

export function cleanDuplicateLines(
  rawText: string,
  options: DuplicateCleanerOptions
): DuplicateCleanerResult {
  if (!rawText) {
    return {
      cleanedText: "",
      originalCount: 0,
      cleanedCount: 0,
      removedCount: 0,
    }
  }

  let lines = rawText.split("\n")
  const originalCount = lines.length

  if (options.trimWhitespace) {
    lines = lines.map((l) => l.trim())
  }

  if (options.removeEmptyLines) {
    lines = lines.filter((l) => l.length > 0)
  }

  // Deduplication
  const seen = new Set<string>()
  const uniqueLines: string[] = []

  for (const line of lines) {
    const key = options.caseSensitive ? line : line.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      uniqueLines.push(line)
    }
  }

  // Sorting
  if (options.sortOrder === "asc") {
    uniqueLines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  } else if (options.sortOrder === "desc") {
    uniqueLines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: "base" }))
  } else if (options.sortOrder === "length-asc") {
    uniqueLines.sort((a, b) => a.length - b.length || a.localeCompare(b))
  } else if (options.sortOrder === "length-desc") {
    uniqueLines.sort((a, b) => b.length - a.length || a.localeCompare(b))
  }

  const cleanedText = uniqueLines.join("\n")
  const cleanedCount = uniqueLines.length
  const removedCount = originalCount - cleanedCount

  return {
    cleanedText,
    originalCount,
    cleanedCount,
    removedCount,
  }
}
