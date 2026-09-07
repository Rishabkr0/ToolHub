import * as React from "react"
import { notFound } from "next/navigation"

const validCategories = ["documents", "images", "video", "ai", "developer", "calculators", "productivity"]

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  if (!validCategories.includes(params.category)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display-lg text-[48px] capitalize mb-8 text-on-background">
        {params.category} Tools
      </h1>
      <p className="font-body-lg text-on-surface-variant max-w-2xl mb-12">
        Browse our collection of {params.category} tools. All tools run directly in your browser ensuring maximum privacy.
      </p>
      
      {/* Grid for Tools - Mocked for now */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* We will populate this with actual tools later */}
      </div>
    </div>
  )
}
