"use client";

import * as React from "react";
import { Check, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RotateWorkspaceProps {
  pageCount: number;
  thumbnails: Record<number, string>; // ObjectURLs for thumbnails
  rotations: Record<number, number>; // current rotations
  selectedPages: number[]; // 0-indexed
  onToggleSelection: (pageIndex: number) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onRotatePage: (pageIndex: number, amount: number) => void;
  onRotateSelected: (amount: number) => void;
  onRotateAll: (amount: number) => void;
}

export function RotateWorkspace({
  pageCount,
  thumbnails,
  rotations,
  selectedPages,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onRotatePage,
  onRotateSelected,
  onRotateAll,
}: RotateWorkspaceProps) {
  const isAllSelected = selectedPages.length === pageCount;
  const hasSelection = selectedPages.length > 0;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Batch Controls Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-low p-4 rounded-lg border-[2px] border-on-background">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={isAllSelected ? onClearSelection : onSelectAll}>
            {isAllSelected ? "Clear Selection" : "Select All"}
          </Button>
          
          <div className="h-6 w-px bg-outline hidden sm:block mx-2" />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRotateSelected(-90)}
            disabled={!hasSelection}
            title="Rotate Selected Left"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Selected Left
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRotateSelected(90)}
            disabled={!hasSelection}
            title="Rotate Selected Right"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Selected Right
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRotateSelected(180)}
            disabled={!hasSelection}
            title="Rotate Selected 180°"
          >
            <span className="font-label-bold text-sm mr-2">180°</span>
            Selected
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-label-sm text-on-surface-variant hidden md:inline-block mr-2">
            Batch All:
          </span>
          <Button variant="secondary" size="sm" onClick={() => onRotateAll(-90)}>
            All Left
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onRotateAll(90)}>
            All Right
          </Button>
        </div>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto p-2">
        {Array.from({ length: pageCount }).map((_, i) => {
          const pageNum = i + 1;
          const isSelected = selectedPages.includes(i);
          const currentRotation = rotations[i] || 0;
          const thumbUrl = thumbnails[i];

          return (
            <div
              key={i}
              className={`relative flex flex-col transition-all rounded-xl border-[3px] overflow-hidden ${
                isSelected 
                  ? "border-primary bg-primary-container/20 neubrutal-shadow -translate-y-1" 
                  : "border-on-background bg-surface hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {/* Thumbnail Container */}
              <button 
                className="relative aspect-[1/1.4] w-full flex items-center justify-center p-4 bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                onClick={() => onToggleSelection(i)}
                type="button"
                aria-label={`Select page ${pageNum}`}
              >
                {thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbUrl}
                    alt={`Page ${pageNum}`}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 pointer-events-none drop-shadow-md"
                    style={{ transform: `rotate(${currentRotation}deg)` }}
                  />
                ) : (
                  <div className="w-12 h-12 border-4 border-t-primary border-on-background rounded-full animate-spin"></div>
                )}

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center border-[2px] border-on-background z-10">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                {/* Page number badge */}
                <div className="absolute bottom-2 left-2 bg-background/90 text-on-background font-label-bold text-xs px-2 py-1 rounded border-[2px] border-on-background z-10">
                  {pageNum}
                </div>
              </button>

              {/* Card Footer Controls */}
              <div className="flex flex-col border-t-[3px] border-on-background bg-surface p-2 gap-2">
                <div className="text-center font-label-md text-on-surface">
                  Rotation: {currentRotation}°
                </div>
                <div className="flex items-center justify-between gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 h-8 px-0 border-[2px] border-transparent hover:border-on-background bg-surface-container hover:bg-surface-container-high"
                    onClick={() => onRotatePage(i, -90)}
                    title="Rotate Left"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 h-8 px-0 border-[2px] border-transparent hover:border-on-background bg-surface-container hover:bg-surface-container-high"
                    onClick={() => onRotatePage(i, 90)}
                    title="Rotate Right"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
