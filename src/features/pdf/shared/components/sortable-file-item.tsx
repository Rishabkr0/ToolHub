"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X, ArrowUp, ArrowDown, FileText } from "lucide-react"
import { FileItem } from "../../shared/types"
import { cn } from "@/lib/utils"

interface SortableFileItemProps {
  fileItem: FileItem
  onRemove: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  isFirst: boolean
  isLast: boolean
  index?: number
  disabled?: boolean
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function SortableFileItem({ 
  fileItem, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast,
  index,
  disabled = false
}: SortableFileItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: fileItem.id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-4 p-4 bg-surface-container-lowest border-[3px] border-on-background rounded-lg mb-4 transition-all group",
        isDragging ? "opacity-50 scale-105 shadow-[8px_8px_0px_0px_var(--color-primary)] z-50 relative" : "neubrutal-shadow"
      )}
    >
      <div 
        {...attributes} 
        {...listeners}
        className={cn("cursor-grab active:cursor-grabbing p-1 text-on-surface-variant hover:text-on-surface transition-colors", disabled && "cursor-not-allowed")}
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {fileItem.file.type.startsWith("image/") && fileItem.previewUrl ? (
        <div className="w-12 h-12 shrink-0 rounded overflow-hidden border-[2px] border-on-background bg-surface-container-low flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fileItem.previewUrl} alt="thumbnail" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 shrink-0 bg-primary-container rounded flex items-center justify-center border-[2px] border-on-background">
          <FileText className="w-5 h-5 text-on-primary-container" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-label-bold text-on-surface truncate">
          {index !== undefined && <span className="text-on-surface-variant mr-2">#{index + 1}</span>}
          {fileItem.file.name}
        </p>
        <p className="text-label-sm text-on-surface-variant truncate">
          {formatBytes(fileItem.size)}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onMoveUp(fileItem.id)}
          disabled={isFirst || disabled}
          className="p-2 rounded-md hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Move Up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(fileItem.id)}
          disabled={isLast || disabled}
          className="p-2 rounded-md hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Move Down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <div className="w-[2px] h-6 bg-surface-variant mx-1" />
        <button
          type="button"
          onClick={() => onRemove(fileItem.id)}
          disabled={disabled}
          className="p-2 rounded-md hover:bg-error-container hover:text-on-error-container transition-colors"
          title="Remove"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
