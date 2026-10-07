import * as React from "react"
import Link from "next/link"
import { ArrowRight, FileText, FileType, Image as ImageIcon, Video, Music, Bot, Code, Calculator, Clock, LucideIcon } from "lucide-react"
import { CategoryCard } from "@/features/tools/components/category-card"
import { CATEGORIES, TOOLS } from "@/config/tools"

const iconMap: Record<string, LucideIcon> = {
  "pdf": FileText,
  "documents": FileType,
  "images": ImageIcon,
  "video": Video,
  "audio": Music,
  "ai": Bot,
  "developer": Code,
  "calculators": Calculator,
  "productivity": Clock,
}

const colorMap: Record<string, { containerBg: string, iconBg: string, textColor: string, iconColor: string }> = {
  "pdf": { containerBg: "bg-error-container", iconBg: "bg-error", textColor: "text-on-error-container", iconColor: "text-white" },
  "documents": { containerBg: "bg-tertiary-fixed", iconBg: "bg-tertiary", textColor: "text-on-tertiary-fixed-variant", iconColor: "text-on-tertiary" },
  "images": { containerBg: "bg-secondary-fixed", iconBg: "bg-secondary", textColor: "text-on-secondary-fixed-variant", iconColor: "text-on-secondary" },
  "video": { containerBg: "bg-[#d1f4e0]", iconBg: "bg-[#00875a]", textColor: "text-[#006644]", iconColor: "text-white" },
  "ai": { containerBg: "bg-primary-fixed", iconBg: "bg-primary", textColor: "text-on-primary-fixed-variant", iconColor: "text-on-primary" },
  "developer": { containerBg: "bg-surface-container-highest", iconBg: "bg-surface-variant", textColor: "text-on-surface", iconColor: "text-on-surface" },
  "calculators": { containerBg: "bg-[#e8def8]", iconBg: "bg-[#6750a4]", textColor: "text-[#21005d]", iconColor: "text-white" },
  "productivity": { containerBg: "bg-[#fdf0d5]", iconBg: "bg-[#8b5000]", textColor: "text-[#4d2a00]", iconColor: "text-white" },
}

export function CategoryGrid() {
  return (
    <section className="w-full bg-background py-xl px-md lg:px-xl border-b-[3px] border-on-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-xl">
          <div>
            <h2 className="font-headline-lg text-headline-lg lg:text-[48px] text-on-background mb-xs">Browse by Category</h2>
            <p className="font-body-md text-body-md text-on-surface-variant text-[18px]">Find the perfect tool for your task.</p>
          </div>
          <Link href="/categories" className="hidden md:flex items-center gap-2 font-label-bold text-on-surface hover:text-primary transition-colors uppercase tracking-widest text-[14px]">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md lg:gap-lg">
          {CATEGORIES.map(category => {
            const Icon = iconMap[category.slug] || FileText
            const colors = colorMap[category.slug] || colorMap["documents"]
            const count = TOOLS.filter(t => t.category === category.slug).length
            
            return (
              <CategoryCard 
                key={category.slug}
                title={category.name} 
                count={count} 
                icon={Icon} 
                containerBg={colors.containerBg} 
                iconBg={colors.iconBg} 
                textColor={colors.textColor} 
                iconColor={colors.iconColor} 
                href={`/category/${category.slug}`} 
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
