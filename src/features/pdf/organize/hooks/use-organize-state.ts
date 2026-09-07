import * as React from "react";
import { arrayMove } from "@dnd-kit/sortable";

export interface PageModel {
  id: string;
  fileId: string;
  originalIndex: number;
  rotation: number;
}

export function useOrganizeState() {
  const [past, setPast] = React.useState<PageModel[][]>([]);
  const [present, setPresent] = React.useState<PageModel[]>([]);
  const [future, setFuture] = React.useState<PageModel[][]>([]);
  
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Internal helper to push state to history
  const pushState = (newState: PageModel[]) => {
    setPast(prev => [...prev, present]);
    setPresent(newState);
    setFuture([]);
    
    // Cleanup selection if deleted pages were selected
    const newIds = new Set(newState.map(p => p.id));
    setSelectedIds(prev => prev.filter(id => newIds.has(id)));
  };

  const undo = React.useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    
    setFuture(prev => [present, ...prev]);
    setPresent(previous);
    setPast(newPast);
    
    // Cleanup selection
    const prevIds = new Set(previous.map(p => p.id));
    setSelectedIds(prev => prev.filter(id => prevIds.has(id)));
  }, [past, present]);

  const redo = React.useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prev => [...prev, present]);
    setPresent(next);
    setFuture(newFuture);
    
    // Cleanup selection
    const nextIds = new Set(next.map(p => p.id));
    setSelectedIds(prev => prev.filter(id => nextIds.has(id)));
  }, [future, present]);

  const reset = React.useCallback(() => {
    setPast([]);
    setFuture([]);
    setPresent([]);
    setSelectedIds([]);
  }, []);

  const addPages = React.useCallback((fileId: string, pageCount: number) => {
    const newPages = Array.from({ length: pageCount }).map((_, i) => ({
      id: `page-${fileId}-${i}-${Date.now()}`,
      fileId,
      originalIndex: i,
      rotation: 0
    }));

    setPast(prev => [...prev, present]);
    setPresent(prev => [...prev, ...newPages]);
    setFuture([]);
  }, [present]);

  // Operations
  const reorderPages = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;
    const newState = arrayMove(present, oldIndex, newIndex);
    pushState(newState);
  };

  const rotatePages = (ids: string[], degrees: number) => {
    const newState = present.map(p => {
      if (ids.includes(p.id)) {
        let newRot = (p.rotation + degrees) % 360;
        if (newRot < 0) newRot += 360;
        return { ...p, rotation: newRot };
      }
      return p;
    });
    pushState(newState);
  };

  const deletePages = (ids: string[]) => {
    const newState = present.filter(p => !ids.includes(p.id));
    pushState(newState);
  };

  const duplicatePages = (ids: string[]) => {
    const newState: PageModel[] = [];
    const timestamp = Date.now();
    let copyCount = 0;

    present.forEach(p => {
      newState.push(p);
      if (ids.includes(p.id)) {
        newState.push({
          ...p,
          id: `${p.id}-copy-${timestamp}-${copyCount++}`
        });
      }
    });

    pushState(newState);
  };

  // Selection
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(present.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return {
    pages: present,
    selectedIds,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    addPages,
    undo,
    redo,
    reset,
    reorderPages,
    rotatePages,
    deletePages,
    duplicatePages,
    toggleSelection,
    selectAll,
    clearSelection
  };
}
