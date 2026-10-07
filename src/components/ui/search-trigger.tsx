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
      className="flex w-full min-w-[250px] lg:min-w-[350px] h-10 px-4 items-center gap-2 rounded-lg border-[2px] border-on-background/20 bg-surface-container-lowest transition-all hover:border-on-background/40 hover:shadow-sm cursor-text"
      onClick={() => setIsOpen(true)}
    >
      <Search className="w-4 h-4 shrink-0 text-on-surface-variant/70" />
      <span className="text-on-surface-variant/70 font-medium flex-1 text-sm truncate">{placeholder}</span>
    </div>
  )
}
