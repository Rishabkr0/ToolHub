import * as React from "react"
import Link from "next/link"
import { ArrowRight, FileText, Image, Video, Music, Bot } from "lucide-react"
import { CategoryCard } from "@/features/tools/components/category-card"

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
          <CategoryCard title="Documents" count={3} icon={FileText} containerBg="bg-tertiary-fixed" iconBg="bg-tertiary" textColor="text-on-tertiary-fixed-variant" iconColor="text-on-tertiary" href="/category/documents" />
          <CategoryCard title="Images" count={32} icon={Image} containerBg="bg-secondary-fixed" iconBg="bg-secondary" textColor="text-on-secondary-fixed-variant" iconColor="text-on-secondary" />
          <CategoryCard title="Video" count={28} icon={Video} containerBg="bg-[#d1f4e0]" iconBg="bg-[#00875a]" textColor="text-[#006644]" iconColor="text-white" />
          <CategoryCard title="Audio" count={15} icon={Music} containerBg="bg-[#ffe6d5]" iconBg="bg-[#e65c00]" textColor="text-[#b34700]" iconColor="text-white" />
          <CategoryCard title="AI Tools" count={56} icon={Bot} containerBg="bg-primary-fixed" iconBg="bg-primary" textColor="text-on-primary-fixed-variant" iconColor="text-on-primary" />
        </div>
      </div>
    </section>
  )
}
