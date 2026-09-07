"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DeleteWorkspaceProps {
  pageCount: number;
  thumbnails: Record<number, string>; // ObjectURLs for thumbnails
  selectedPages: number[]; // 0-indexed pages marked for deletion
  onToggleSelection: (pageIndex: number) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onSelectOdd: () => void;
  onSelectEven: () => void;
}

export function DeleteWorkspace({
  pageCount,
  thumbnails,
  selectedPages,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onSelectOdd,
  onSelectEven,
}: DeleteWorkspaceProps) {
  const isAllSelected = selectedPages.length === pageCount;
  
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Batch Controls Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-low p-4 rounded-lg border-[2px] border-on-background">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={isAllSelected ? onClearSelection : onSelectAll}>
            {isAllSelected ? "Clear Selection" : "Select All"}
          </Button>
          
          <div className="h-6 w-px bg-outline hidden sm:block mx-2" />
          
          <Button variant="outline" size="sm" onClick={onSelectOdd}>
            Odd Pages
          </Button>
          <Button variant="outline" size="sm" onClick={onSelectEven}>
            Even Pages
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right flex flex-col">
            <span className="font-label-bold text-error">
              {selectedPages.length} pages selected for deletion
            </span>
            <span className="text-label-sm text-on-surface-variant">
              {pageCount - selectedPages.length} pages will remain
            </span>
          </div>
        </div>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto p-2">
        {Array.from({ length: pageCount }).map((_, i) => {
          const pageNum = i + 1;
          const isSelectedForDeletion = selectedPages.includes(i);
          const thumbUrl = thumbnails[i];

          return (
            <button
              key={i}
              className={`relative flex flex-col transition-all rounded-xl border-[3px] overflow-hidden aspect-[1/1.4] items-center justify-center p-4 outline-none focus:ring-2 focus:ring-error focus:ring-inset ${
                isSelectedForDeletion 
                  ? "border-error bg-error-container/40 neubrutal-shadow -translate-y-1" 
                  : "border-on-background bg-surface-container-lowest hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
              onClick={() => onToggleSelection(i)}
              type="button"
              aria-label={isSelectedForDeletion ? `Unmark page ${pageNum} for deletion` : `Mark page ${pageNum} for deletion`}
            >
              {thumbUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbUrl}
                  alt={`Page ${pageNum}`}
                  className={`max-w-full max-h-full object-contain transition-opacity duration-300 pointer-events-none drop-shadow-md ${
                    isSelectedForDeletion ? "opacity-40" : "opacity-100"
                  }`}
                />
              ) : (
                <div className={`w-12 h-12 border-4 border-on-background rounded-full animate-spin ${isSelectedForDeletion ? "border-t-error" : "border-t-primary"}`}></div>
              )}

              {/* Deletion indicator */}
              {isSelectedForDeletion && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-error text-on-error rounded-full flex flex-col items-center justify-center border-[3px] border-on-background shadow-lg z-10 animate-in zoom-in-50 duration-200">
                  <Trash2 className="w-8 h-8" />
                </div>
              )}

              {/* Page number badge */}
              <div className={`absolute bottom-2 left-2 font-label-bold text-xs px-2 py-1 rounded border-[2px] border-on-background z-10 ${
                isSelectedForDeletion ? "bg-error text-on-error" : "bg-background/90 text-on-background"
              }`}>
                {pageNum}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
