import { TOOLS } from "@/config/tools"
import { ToolCard } from "@/features/tools/components/tool-card"
import { FileText } from "lucide-react"

export default function PopularToolsPage() {
  // Display the first 8 tools as "popular"
  const popularTools = TOOLS.slice(0, 8)

  return (
    <div className="w-full max-w-7xl mx-auto py-xl px-md lg:px-xl pt-28">
      <div className="mb-xl text-center">
        <h1 className="font-display-lg text-[40px] md:text-[56px] text-on-background mb-4">Popular Tools</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          The most frequently used tools by our community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
        {popularTools.map(tool => (
          <ToolCard
            key={tool.slug}
            title={tool.name}
            description={tool.description}
            icon={FileText}
            bgClass="bg-primary-fixed"
            colorClass="bg-primary"
            href={`/tool/${tool.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
