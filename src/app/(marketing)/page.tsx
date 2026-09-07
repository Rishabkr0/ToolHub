import { HeroSection } from "@/components/layout/hero-section"
import { UniversalSearchSection } from "@/components/layout/universal-search-section"
import { CategoryGrid } from "@/components/layout/category-grid"
import { PopularToolsGrid } from "@/components/layout/popular-tools-grid"

export default function MarketingPage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <UniversalSearchSection />
      <CategoryGrid />
      <PopularToolsGrid />
    </div>
  )
}
