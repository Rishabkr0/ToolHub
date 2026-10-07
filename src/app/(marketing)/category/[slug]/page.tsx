import { CATEGORIES, TOOLS, ToolCategory } from "@/config/tools"
import { ToolCard } from "@/features/tools/components/tool-card"
import { Layers, Scissors, Minimize2, FileText, LucideIcon, Image as ImageIcon, ImagePlus } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// A simple icon mapper to map tool slugs to Lucide components
const iconMap: Record<string, LucideIcon> = {
  "merge-pdf": Layers,
  "split-pdf": Scissors,
  "compress-pdf": Minimize2,
  "pdf-to-jpg": ImageIcon,
  "jpg-to-pdf": ImagePlus,
}

const colorMap: Record<string, { bg: string, color: string }> = {
  "pdf": { bg: "bg-error-container", color: "bg-error" },
  "documents": { bg: "bg-tertiary-fixed", color: "bg-tertiary" },
  "images": { bg: "bg-secondary-fixed", color: "bg-secondary" },
  "video": { bg: "bg-[#d1f4e0]", color: "bg-[#00875a]" },
  "audio": { bg: "bg-[#ffe6d5]", color: "bg-[#e65c00]" },
  "ai": { bg: "bg-primary-fixed", color: "bg-primary" },
  "developer": { bg: "bg-surface-container", color: "bg-surface-variant" },
  "calculators": { bg: "bg-[#e8def8]", color: "bg-[#6750a4]" },
  "productivity": { bg: "bg-[#fdf0d5]", color: "bg-[#8b5000]" },
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const category = CATEGORIES.find(c => c.slug === slug)
  if (!category) {
    notFound()
  }

  const tools = TOOLS.filter(t => t.category === slug as ToolCategory)
  const colors = colorMap[category.slug] || colorMap["documents"]

  return (
    <div className="w-full max-w-7xl mx-auto py-xl px-md lg:px-xl">
      <Link href="/" className="inline-flex items-center gap-2 font-label-bold text-on-surface-variant hover:text-on-surface mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      
      <div className="mb-xl">
        <h1 className="font-display-lg text-[40px] md:text-[56px] text-on-background mb-2">{category.name}</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">{category.description}</p>
        <div className="mt-4 inline-flex items-center justify-center px-4 py-1 bg-surface-container border-[2px] border-on-background rounded-full font-label-bold text-sm">
          {tools.length} {tools.length === 1 ? "Tool" : "Tools"} Available
        </div>
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
          {tools.map(tool => {
            const Icon = iconMap[tool.slug] || FileText
            return (
              <ToolCard
                key={tool.slug}
                title={tool.name}
                description={tool.description}
                icon={Icon}
                bgClass={colors.bg}
                colorClass={colors.color}
                href={`/tool/${tool.slug}`}
              />
            )
          })}
        </div>
      ) : (
        <div className="w-full p-xl bg-surface-container-lowest border-[3px] border-on-background border-dashed rounded-xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center border-[2px] border-on-background mb-4">
            <FileText className="w-8 h-8 text-on-surface-variant" />
          </div>
          <h3 className="font-headline-md text-on-surface mb-2">No tools yet</h3>
          <p className="font-body-md text-on-surface-variant max-w-md">
            We are constantly adding new tools. Check back later for new {category.name.toLowerCase()} utilities.
          </p>
        </div>
      )}
    </div>
  )
}
