export type DiffType = "added" | "removed" | "unchanged"

export interface DiffLine {
  type: DiffType
  content: string
  oldLineNumber?: number
  newLineNumber?: number
}

export interface DiffResult {
  lines: DiffLine[]
  addedCount: number
  removedCount: number
  unchangedCount: number
}

/**
 * Computes line-by-line diff using Longest Common Subsequence (LCS).
 */
export function computeLineDiff(original: string, modified: string): DiffResult {
  const origLines = original.split("\n")
  const modLines = modified.split("\n")

  const m = origLines.length
  const n = modLines.length

  // DP table for LCS
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (origLines[i] === modLines[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  // Backtrack to find diff
  const diffs: DiffLine[] = []
  let i = m
  let j = n

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      diffs.push({
        type: "unchanged",
        content: origLines[i - 1],
        oldLineNumber: i,
        newLineNumber: j,
      })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diffs.push({
        type: "added",
        content: modLines[j - 1],
        newLineNumber: j,
      })
      j--
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diffs.push({
        type: "removed",
        content: origLines[i - 1],
        oldLineNumber: i,
      })
      i--
    }
  }

  diffs.reverse()

  let addedCount = 0
  let removedCount = 0
  let unchangedCount = 0

  for (const line of diffs) {
    if (line.type === "added") addedCount++
    else if (line.type === "removed") removedCount++
    else unchangedCount++
  }

  return {
    lines: diffs,
    addedCount,
    removedCount,
    unchangedCount,
  }
}
