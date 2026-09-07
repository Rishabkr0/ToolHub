"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { SearchContext } from "@/providers"

export function SearchTrigger({ 
  placeholder = "Search for tools... (Cmd+K)" 
}: { 
  placeholder?: string 
}) {
  const { setIsOpen } = React.useContext(SearchContext)

  return (
    <div 
      className="w-full h-10 px-sm flex items-center rounded-lg border-[3px] border-on-background bg-surface-container-lowest transition-all hover:shadow-[4px_4px_0px_0px_var(--color-primary)] cursor-text"
      onClick={() => setIsOpen(true)}
    >
      <span className="text-on-surface-variant flex-1 text-sm truncate pr-2">{placeholder}</span>
      <Search className="w-5 h-5 shrink-0 text-on-surface-variant" />
    </div>
  )
}
