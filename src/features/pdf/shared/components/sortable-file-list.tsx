"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { FileItem } from "../../shared/types"
import { SortableFileItem } from "./sortable-file-item"

interface SortableFileListProps {
  files: FileItem[]
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  disabled?: boolean
}

export function SortableFileList({ files, setFiles, disabled = false }: SortableFileListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleRemove = (id: string) => {
    setFiles((items) => items.filter((item) => item.id !== id))
  }

  const handleMoveUp = (id: string) => {
    setFiles((items) => {
      const index = items.findIndex((i) => i.id === id)
      if (index > 0) {
        return arrayMove(items, index, index - 1)
      }
      return items
    })
  }

  const handleMoveDown = (id: string) => {
    setFiles((items) => {
      const index = items.findIndex((i) => i.id === id)
      if (index < items.length - 1) {
        return arrayMove(items, index, index + 1)
      }
      return items
    })
  }

  return (
    <div className="w-full">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={files.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {files.map((fileItem, index) => (
            <SortableFileItem
              key={fileItem.id}
              fileItem={fileItem}
              onRemove={handleRemove}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              isFirst={index === 0}
              isLast={index === files.length - 1}
              index={index}
              disabled={disabled}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
