"use client"

import * as React from "react"
import { Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageSelectorProps {
  pageCount: number
  selectedPages: number[]
  onChange: (selected: number[]) => void
}

export function PageSelector({ pageCount, selectedPages, onChange }: PageSelectorProps) {
  const isAllSelected = selectedPages.length === pageCount

  const handleToggle = (pageNum: number) => {
    if (selectedPages.includes(pageNum)) {
      onChange(selectedPages.filter(p => p !== pageNum))
    } else {
      onChange([...selectedPages, pageNum].sort((a, b) => a - b))
    }
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([])
    } else {
      const all = Array.from({ length: pageCount }, (_, i) => i + 1)
      onChange(all)
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="font-headline-sm text-on-surface">Select pages to extract</h4>
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          {isAllSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[400px] overflow-y-auto p-1">
        {Array.from({ length: pageCount }).map((_, i) => {
          const pageNum = i + 1
          const isSelected = selectedPages.includes(pageNum)
          return (
            <button
              key={pageNum}
              onClick={() => handleToggle(pageNum)}
              className={`relative aspect-[1/1.4] rounded-lg border-[3px] flex flex-col items-center justify-center transition-all ${
                isSelected 
                  ? "border-primary bg-primary-container/30 text-primary neubrutal-shadow -translate-y-1" 
                  : "border-on-background bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:-translate-y-1"
              }`}
            >
              <FileText className={`w-8 h-8 mb-2 ${isSelected ? "text-primary" : "text-on-surface-variant"}`} />
              <span className="font-label-bold text-sm">Page {pageNum}</span>
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center border-2 border-on-background">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
