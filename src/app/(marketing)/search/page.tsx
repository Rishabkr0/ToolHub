import * as React from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { Search } from "lucide-react"

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || ""

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display-lg text-[32px] mb-8 text-on-background">
        Search Results for "{query}"
      </h1>
      
      {!query ? (
        <EmptyState 
          icon={Search}
          title="Start searching"
          description="Type something to search our massive database of 300+ tools."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock results area */}
          <p className="text-on-surface-variant col-span-full">No results found yet.</p>
        </div>
      )}
    </div>
  )
}
