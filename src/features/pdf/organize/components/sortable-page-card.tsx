"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RotateCcw, RotateCw, Trash2, Copy, Check, GripVertical } from "lucide-react";
import { PageModel } from "../hooks/use-organize-state";

export interface SortablePageCardProps {
  page: PageModel;
  displayIndex: number; // The current visual index in the workspace (1-based)
  thumbnailUrl: string;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onRotate: (id: string, degrees: number) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function SortablePageCard({
  page,
  displayIndex,
  thumbnailUrl,
  isSelected,
  onToggleSelection,
  onRotate,
  onDelete,
  onDuplicate
}: SortablePageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleRotateLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRotate(page.id, -90);
  };

  const handleRotateRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRotate(page.id, 90);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(page.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(page.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col transition-shadow rounded-xl border-[3px] overflow-hidden aspect-[1/1.4] bg-surface-container-lowest outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset ${
        isSelected 
          ? "border-primary bg-primary-container/20 neubrutal-shadow" 
          : "border-on-background hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      }`}
      onClick={() => onToggleSelection(page.id)}
    >
      {/* Drag Handle (top bar) */}
      <div 
        className="w-full h-8 bg-surface-container border-b-[2px] border-on-background/20 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing hover:bg-surface-container-high transition-colors"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()} // Prevent selecting when just grabbing handle
      >
        <GripVertical className="w-4 h-4 text-on-surface-variant" />
        <span className="font-label-sm text-xs text-on-surface-variant">
          Page {displayIndex}
        </span>
      </div>

      {/* Thumbnail Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={`Page ${displayIndex}`}
            style={{ transform: `rotate(${page.rotation}deg)` }}
            className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-md transition-transform duration-300"
          />
        ) : (
          <div className="w-8 h-8 border-4 border-t-primary border-on-background rounded-full animate-spin"></div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center border-[2px] border-on-background z-10 animate-in zoom-in-50 duration-200">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Hover Actions (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/90 border-t-[2px] border-on-background flex justify-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
        <button 
          onClick={handleRotateLeft} 
          className="p-1.5 hover:bg-surface-container-high rounded"
          title="Rotate Left"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button 
          onClick={handleRotateRight} 
          className="p-1.5 hover:bg-surface-container-high rounded"
          title="Rotate Right"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button 
          onClick={handleDuplicate} 
          className="p-1.5 hover:bg-surface-container-high rounded"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button 
          onClick={handleDelete} 
          className="p-1.5 hover:bg-error-container text-error rounded"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
