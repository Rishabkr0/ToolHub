import * as React from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { Star } from "lucide-react"

export default function FavoritesPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display-lg text-[32px] text-on-background mb-8">Favorite Tools</h1>
      <EmptyState 
        icon={Star}
        title="No favorites yet"
        description="Click the star icon on any tool to pin it here for quick access."
      />
    </div>
  )
}
