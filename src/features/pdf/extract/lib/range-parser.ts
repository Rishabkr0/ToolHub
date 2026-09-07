/**
 * Parses a string like "1-3, 5, 8-10" into an array of 0-indexed page numbers.
 * Bounds checks against maxPages and deduplicates overlapping ranges.
 */
export function parseRanges(rangesStr: string, maxPages: number): number[] {
  if (!rangesStr.trim()) return [];

  const ranges = rangesStr.split(",").map((s) => s.trim()).filter(Boolean);
  const resultSet = new Set<number>();

  for (const r of ranges) {
    if (r.includes("-")) {
      const parts = r.split("-");
      if (parts.length !== 2) continue; // Ignore malformed

      const start = parseInt(parts[0], 10);
      const end = parseInt(parts[1], 10);

      if (isNaN(start) || isNaN(end) || start < 1 || start > maxPages || end < 1 || end > maxPages) {
        continue;
      }

      const min = Math.min(start, end);
      const max = Math.max(start, end);

      for (let i = min; i <= max; i++) {
        resultSet.add(i - 1); // 0-indexed
      }
    } else {
      const page = parseInt(r, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        resultSet.add(page - 1); // 0-indexed
      }
    }
  }

  return Array.from(resultSet).sort((a, b) => a - b);
}

/**
 * Formats an array of 0-indexed page numbers into a clean range string.
 * Example: [0,1,2,4,7,8,9] -> "1-3, 5, 8-10"
 */
export function formatRange(indices: number[]): string {
  if (!indices || indices.length === 0) return "";

  // Ensure sorted and deduplicated
  const sorted = Array.from(new Set(indices)).sort((a, b) => a - b);
  const parts: string[] = [];
  
  let rangeStart = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    const current = sorted[i];

    // If sequence breaks or end of array
    if (current !== prev + 1) {
      if (rangeStart === prev) {
        parts.push(`${rangeStart + 1}`);
      } else {
        parts.push(`${rangeStart + 1}-${prev + 1}`);
      }
      
      if (i < sorted.length) {
        rangeStart = current;
        prev = current;
      }
    } else {
      prev = current;
    }
  }

  return parts.join(", ");
}
