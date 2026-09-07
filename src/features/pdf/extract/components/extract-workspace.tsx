"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRange, parseRanges } from "../lib/range-parser";

export interface ExtractWorkspaceProps {
  pageCount: number;
  thumbnails: Record<number, string>; // ObjectURLs for thumbnails
  selectedPages: number[]; // 0-indexed
  onToggleSelection: (pageIndex: number) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onSetSelection: (pages: number[]) => void;
}

export function ExtractWorkspace({
  pageCount,
  thumbnails,
  selectedPages,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onSetSelection,
}: ExtractWorkspaceProps) {
  const isAllSelected = selectedPages.length === pageCount;
  
  // Local state for the range input string so user can type freely
  const [rangeInput, setRangeInput] = React.useState("");

  // Sync external selectedPages to local rangeInput when selectedPages changes
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRangeInput(formatRange(selectedPages));
  }, [selectedPages]);

  // Handle typing in the input field
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRangeInput(val);
    
    // Attempt to parse and update selectedPages
    const newPages = parseRanges(val, pageCount);
    onSetSelection(newPages);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Range Input & Batch Controls */}
      <div className="flex flex-col gap-4 bg-surface-container-low p-4 rounded-lg border-[2px] border-on-background">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 w-full max-w-md">
            <label htmlFor="range-input" className="block font-label-bold text-on-surface mb-2">
              Select Pages or Ranges (e.g., 1-3, 5, 8-10)
            </label>
            <Input
              id="range-input"
              value={rangeInput}
              onChange={handleRangeChange}
              placeholder="1-3, 5, 8-10"
              className="bg-surface border-[2px] border-on-background focus-visible:ring-primary h-12"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right flex flex-col mr-2">
              <span className="font-label-bold text-primary">
                {selectedPages.length} pages selected
              </span>
            </div>
            <div className="h-8 w-px bg-outline hidden sm:block" />
            <Button variant="outline" onClick={isAllSelected ? onClearSelection : onSelectAll}>
              {isAllSelected ? "Clear Selection" : "Select All"}
            </Button>
          </div>
        </div>
        
        {/* Selected Pages Preview Strip (optional nice-to-have, requested by user) */}
        {selectedPages.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t-[2px] border-on-background/20">
            <span className="text-label-sm text-on-surface-variant flex items-center mr-2">
              Extracting:
            </span>
            {selectedPages.map(pageIndex => (
              <div 
                key={pageIndex} 
                className="flex items-center gap-1 bg-primary-container text-on-primary-container px-2 py-1 rounded border border-on-background text-sm font-label-bold animate-in fade-in"
              >
                {pageIndex + 1}
                <button 
                  onClick={() => onToggleSelection(pageIndex)}
                  className="hover:bg-on-background/10 rounded-full p-0.5 ml-1"
                  aria-label={`Remove page ${pageIndex + 1}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-2">
        {Array.from({ length: pageCount }).map((_, i) => {
          const pageNum = i + 1;
          const isSelected = selectedPages.includes(i);
          const thumbUrl = thumbnails[i];

          return (
            <button
              key={i}
              className={`relative flex flex-col transition-all rounded-xl border-[3px] overflow-hidden aspect-[1/1.4] items-center justify-center p-4 outline-none focus:ring-2 focus:ring-primary focus:ring-inset ${
                isSelected 
                  ? "border-primary bg-primary-container/20 neubrutal-shadow -translate-y-1" 
                  : "border-on-background bg-surface-container-lowest hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
              onClick={() => onToggleSelection(i)}
              type="button"
              aria-label={isSelected ? `Unselect page ${pageNum}` : `Select page ${pageNum}`}
            >
              {thumbUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbUrl}
                  alt={`Page ${pageNum}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-300 pointer-events-none drop-shadow-md"
                />
              ) : (
                <div className="w-12 h-12 border-4 border-t-primary border-on-background rounded-full animate-spin"></div>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 left-2 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center border-[2px] border-on-background z-10 animate-in zoom-in-50 duration-200">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Page number badge */}
              <div className="absolute bottom-2 left-2 bg-background/90 text-on-background font-label-bold text-xs px-2 py-1 rounded border-[2px] border-on-background z-10">
                {pageNum}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
