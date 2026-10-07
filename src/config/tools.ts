export type ToolCategory = "documents" | "pdf" | "images" | "video" | "ai" | "developer" | "calculators" | "productivity"

export interface ToolMetadata {
  slug: string
  name: string
  description: string
  category: ToolCategory
  isPro: boolean
  tags: string[]
}

export const CATEGORIES = [
  { slug: "pdf", name: "PDF", description: "PDF editing, merging, and conversion utilities." },
  { slug: "documents", name: "Documents", description: "Text and document formatting, conversion, and processing tools." },
  { slug: "images", name: "Images", description: "Crop, resize, filter, and convert image formats." },
  { slug: "video", name: "Video", description: "Trim, compress, and edit video files easily." },
  { slug: "ai", name: "AI Tools", description: "Artificial Intelligence powered utilities." },
  { slug: "developer", name: "Developer", description: "Formatters, linters, hash generators, and encoding tools." },
  { slug: "calculators", name: "Calculators", description: "Financial, mathematical, and health calculators." },
  { slug: "productivity", name: "Productivity", description: "Timers, notes, and organizational utilities." },
]

export const TOOLS: ToolMetadata[] = [
  { 
    slug: "merge-pdf", 
    name: "Merge PDF", 
    description: "Combine multiple PDFs into a single document.", 
    category: "pdf", 
    isPro: false, 
    tags: ["pdf", "merge", "combine"] 
  },
  { 
    slug: "split-pdf", 
    name: "Split PDF", 
    description: "Extract pages from your PDF or split them into multiple separate files instantly.", 
    category: "pdf", 
    isPro: false, 
    tags: ["pdf", "split", "extract", "pages"] 
  },
  { 
    slug: "compress-pdf", 
    name: "Compress PDF", 
    description: "Optimize PDF structure to reduce file size without losing quality.", 
    category: "pdf", 
    isPro: false, 
    tags: ["pdf", "compress", "optimize", "reduce"] 
  },
  { 
    slug: "pdf-to-jpg", 
    name: "PDF to JPG", 
    description: "Convert PDF pages into high-quality JPG images.", 
    category: "pdf", 
    isPro: false, 
    tags: ["pdf", "jpg", "image", "convert", "rasterize"] 
  },
  { 
    slug: "jpg-to-pdf", 
    name: "JPG to PDF", 
    description: "Convert JPG and PNG images to a PDF document.", 
    category: "pdf", 
    isPro: false, 
    tags: ["jpg", "pdf", "image", "convert", "images"] 
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate individual pages or the entire PDF document.",
    category: "pdf",
    isPro: false,
    tags: ["pdf", "rotate", "pages", "orientation"]
  },
  {
    slug: "delete-pdf-pages",
    name: "Delete PDF Pages",
    description: "Remove unnecessary pages from your PDF document.",
    category: "pdf",
    isPro: false,
    tags: ["pdf", "delete", "remove", "pages"]
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    description: "Extract specific pages from your PDF into a new document.",
    category: "pdf",
    isPro: false,
    tags: ["pdf", "extract", "pages", "select"]
  },
  {
    slug: "organize-pdf",
    name: "Organize PDF",
    description: "Reorder, rotate, delete, or duplicate pages in your PDF.",
    category: "pdf",
    isPro: false,
    tags: ["pdf", "organize", "reorder", "pages"]
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Analyze word counts, character volume, reading time, and readability in real-time.",
    category: "documents",
    isPro: false,
    tags: ["words", "counter", "characters", "readability", "statistics", "text", "document"]
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.",
    category: "documents",
    isPro: false,
    tags: ["case", "converter", "uppercase", "lowercase", "camelcase", "titlecase", "text"]
  },
  {
    slug: "text-diff",
    name: "Text Diff & Comparator",
    description: "Compare two versions of a document side-by-side to highlight added and removed text.",
    category: "documents",
    isPro: false,
    tags: ["diff", "compare", "comparator", "text", "changes", "document", "version"]
  },
  {
    slug: "duplicate-lines",
    name: "Duplicate Line Remover",
    description: "Remove duplicate lines, filter out empty rows, and sort lists alphabetically or by length.",
    category: "documents",
    isPro: false,
    tags: ["duplicates", "deduplicate", "lines", "sort", "clean", "list", "unique"]
  },
  {
    slug: "markdown-editor",
    name: "Markdown Editor & Preview",
    description: "Write and format Markdown with live styled preview, and export to HTML or .md files.",
    category: "documents",
    isPro: false,
    tags: ["markdown", "editor", "preview", "html", "writer", "export", "doc"]
  },
]

