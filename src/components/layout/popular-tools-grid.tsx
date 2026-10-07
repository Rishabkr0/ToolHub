import * as React from "react"
import { Layers, Scissors, Hash } from "lucide-react"
import { ToolCard } from "@/features/tools/components/tool-card"

export function PopularToolsGrid() {
  return (
    <section className="w-full bg-surface-container-low py-xl px-md lg:px-xl border-b-[3px] border-on-background relative">
      <div className="absolute top-20 left-10 w-8 h-8 rounded-full border-[3px] border-on-background bg-secondary opacity-50 hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-12 h-12 rotate-45 border-[3px] border-on-background bg-primary opacity-50 hidden lg:block"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-xl">
          <span className="inline-block px-4 py-1 bg-surface-container-lowest border-[2px] border-on-background rounded-full font-label-bold text-[14px] uppercase tracking-wider mb-sm">Most Used</span>
          <h2 className="font-display-lg text-display-lg lg:text-[56px] text-on-background mb-xs">Popular Tools</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">The tools our community relies on every single day.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          <ToolCard 
            title="Merge PDF" 
            description="Combine multiple PDFs into one unified document instantly." 
            icon={Layers} 
            bgClass="bg-tertiary-fixed" 
            colorClass="bg-tertiary" 
            href="/tool/merge-pdf"
          />
          <ToolCard 
            title="Split PDF" 
            description="Extract pages from your PDF or split them into multiple separate files instantly." 
            icon={Scissors} 
            bgClass="bg-secondary-fixed" 
            colorClass="bg-secondary"
            href="/tool/split-pdf"
          />
          <ToolCard 
            title="Word Counter" 
            description="Count words, characters, and sentences in real-time." 
            icon={Hash} 
            bgClass="bg-primary-fixed" 
            colorClass="bg-primary" 
            href="/tool/word-counter"
          />
        </div>
      </div>
    </section>
  )
}
