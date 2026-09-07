"use client";

import * as React from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { RotateCcw, RotateCw, Trash2, Copy, Undo, Redo, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageModel } from "../hooks/use-organize-state";
import { SortablePageCard } from "./sortable-page-card";

export interface OrganizeWorkspaceProps {
  pages: PageModel[];
  thumbnails: Record<string, string>; // Keys are `${fileId}-${originalIndex}`
  selectedIds: string[];
  canUndo: boolean;
  canRedo: boolean;
  
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  
  onReorder: (oldIndex: number, newIndex: number) => void;
  onRotateSelection: (degrees: number) => void;
  onDeleteSelection: () => void;
  onDuplicateSelection: () => void;
  
  onRotatePage: (id: string, degrees: number) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;

  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
}

export function OrganizeWorkspace({
  pages,
  thumbnails,
  selectedIds,
  canUndo,
  canRedo,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onReorder,
  onRotateSelection,
  onDeleteSelection,
  onDuplicateSelection,
  onRotatePage,
  onDeletePage,
  onDuplicatePage,
  onUndo,
  onRedo,
  onReset
}: OrganizeWorkspaceProps) {
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging to allow clicks to register
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  const isAllSelected = pages.length > 0 && selectedIds.length === pages.length;
  const hasSelection = selectedIds.length > 0;

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-container-low p-4 rounded-lg border-[2px] border-on-background sticky top-4 z-20 shadow-md">
        
        {/* Undo / Redo / Reset */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onUndo} disabled={!canUndo} title="Undo">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onRedo} disabled={!canRedo} title="Redo">
            <Redo className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-outline mx-2" />
          <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
            <RefreshCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

        {/* Batch Selection Controls */}
        <div className="flex items-center gap-3">
          {hasSelection && (
            <span className="font-label-bold text-primary mr-2">
              {selectedIds.length} selected
            </span>
          )}
          <Button variant="outline" size="sm" onClick={isAllSelected ? onClearSelection : onSelectAll}>
            {isAllSelected ? "Clear Selection" : "Select All"}
          </Button>
        </div>
      </div>

      {/* Floating Batch Action Toolbar (appears when pages are selected) */}
      {hasSelection && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-background border-[3px] border-on-background p-2 rounded-xl neubrutal-shadow z-50 flex items-center gap-2 animate-in slide-in-from-bottom-10 fade-in duration-200">
          <Button variant="ghost" size="sm" onClick={() => onRotateSelection(-90)} className="gap-2" title="Rotate Left">
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Left</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onRotateSelection(90)} className="gap-2" title="Rotate Right">
            <RotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">Right</span>
          </Button>
          <div className="w-px h-6 bg-outline mx-1" />
          <Button variant="ghost" size="sm" onClick={onDuplicateSelection} className="gap-2" title="Duplicate">
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>
          <div className="w-px h-6 bg-outline mx-1" />
          <Button variant="ghost" size="sm" onClick={onDeleteSelection} className="gap-2 text-error hover:text-error hover:bg-error-container" title="Delete">
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      )}

      {/* Workspace Grid */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border-[3px] border-on-background neubrutal-shadow min-h-[400px]">
        {pages.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant min-h-[300px]">
            <p className="font-body-lg">No pages remaining.</p>
            <p className="text-body-sm mt-2">Undo or Reset to restore pages.</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={pages.map(p => p.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {pages.map((page, index) => (
                  <SortablePageCard
                    key={page.id}
                    page={page}
                    displayIndex={index + 1}
                    thumbnailUrl={thumbnails[`${page.fileId}-${page.originalIndex}`]}
                    isSelected={selectedIds.includes(page.id)}
                    onToggleSelection={onToggleSelection}
                    onRotate={onRotatePage}
                    onDelete={onDeletePage}
                    onDuplicate={onDuplicatePage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
