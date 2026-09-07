import * as React from "react"
import { SearchBar } from "@/components/ui/search-bar"

export function UniversalSearchSection() {
  return (
    <section className="w-full bg-surface-container-high py-xl px-md border-b-[3px] border-on-background relative overflow-hidden" id="search">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-[100px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container rounded-full blur-[100px] opacity-40 -translate-x-1/2 translate-y-1/2"></div>
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        <h2 className="font-headline-lg text-headline-lg lg:text-[40px] text-on-background mb-lg text-center">
          What do you want to do today?
        </h2>
        <SearchBar placeholder="Search any tool... (Compress PDF, Remove Background, Word Counter)" />
        <div className="flex flex-wrap items-center justify-center gap-xs mt-md">
          <span className="text-label-sm font-label-sm text-on-surface-variant mr-2">Trending:</span>
          <span className="px-3 py-1 bg-surface-container-lowest border-[2px] border-on-background rounded-full text-label-sm font-label-sm cursor-pointer hover:bg-primary-container transition-colors">PDF to Word</span>
          <span className="px-3 py-1 bg-surface-container-lowest border-[2px] border-on-background rounded-full text-label-sm font-label-sm cursor-pointer hover:bg-secondary-container transition-colors">Background Remover</span>
          <span className="px-3 py-1 bg-surface-container-lowest border-[2px] border-on-background rounded-full text-label-sm font-label-sm cursor-pointer hover:bg-tertiary-container transition-colors">Video Compressor</span>
        </div>
      </div>
    </section>
  )
}
