export type ToolCategory = "documents" | "images" | "video" | "ai" | "developer" | "calculators" | "productivity"

export interface ToolMetadata {
  slug: string
  name: string
  description: string
  category: ToolCategory
  isPro: boolean
  tags: string[]
}

export const CATEGORIES = [
  { slug: "documents", name: "Documents", description: "PDF editing, merging, and conversion tools." },
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
    category: "documents", 
    isPro: false, 
    tags: ["pdf", "merge", "combine"] 
  },
  { 
    slug: "split-pdf", 
    name: "Split PDF", 
    description: "Extract pages from your PDF or split them into multiple separate files instantly.", 
    category: "documents", 
    isPro: false, 
    tags: ["pdf", "split", "extract", "pages"] 
  },
  { 
    slug: "compress-pdf", 
    name: "Compress PDF", 
    description: "Optimize PDF structure to reduce file size without losing quality.", 
    category: "documents", 
    isPro: false, 
    tags: ["pdf", "compress", "optimize", "reduce"] 
  },
  { 
    slug: "pdf-to-jpg", 
    name: "PDF to JPG", 
    description: "Convert PDF pages into high-quality JPG images.", 
    category: "documents", 
    isPro: false, 
    tags: ["pdf", "jpg", "image", "convert", "rasterize"] 
  },
  { 
    slug: "jpg-to-pdf", 
    name: "JPG to PDF", 
    description: "Convert JPG and PNG images to a PDF document.", 
    category: "documents", 
    isPro: false, 
    tags: ["jpg", "pdf", "image", "convert", "images"] 
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate individual pages or the entire PDF document.",
    category: "documents",
    isPro: false,
    tags: ["pdf", "rotate", "pages", "orientation"]
  },
  {
    slug: "delete-pdf-pages",
    name: "Delete PDF Pages",
    description: "Remove unnecessary pages from your PDF document.",
    category: "documents",
    isPro: false,
    tags: ["pdf", "delete", "remove", "pages"]
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    description: "Extract specific pages from your PDF into a new document.",
    category: "documents",
    isPro: false,
    tags: ["pdf", "extract", "pages", "select"]
  },
  {
    slug: "organize-pdf",
    name: "Organize PDF",
    description: "Reorder, rotate, delete, or duplicate pages in your PDF.",
    category: "documents",
    isPro: false,
    tags: ["pdf", "organize", "reorder", "pages"]
  },
]
