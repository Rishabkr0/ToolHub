"use client";

import * as React from "react";
import { ProcessingStage } from "../../shared/types";
import { FileUploader } from "../../shared/components/file-uploader";
import { ProcessingStatus } from "../../shared/components/processing-status";
import { OrganizeSuccessView } from "./organize-success-view";
import { OrganizeWorkspace } from "./organize-workspace";
import { parsePdfForOrganize, organizePdfPages, OrganizeResult } from "../lib/organize-engine";
import { loadPdfForThumbnails, generateThumbnail } from "../../shared/lib/thumbnail-generator";
import { useOrganizeState } from "../hooks/use-organize-state";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileIcon, Save } from "lucide-react";

export function OrganizePdfTool() {
  const [files, setFiles] = React.useState<{ id: string; file: File; pageCount: number }[]>([]);
  
  const [thumbnails, setThumbnails] = React.useState<Record<string, string>>({});
  
  const [stage, setStage] = React.useState<ProcessingStage>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<OrganizeResult | null>(null);

  const {
    pages,
    selectedIds,
    canUndo,
    canRedo,
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
  } = useOrganizeState();

  // Cleanup object URLs on unmount or file change
  React.useEffect(() => {
    return () => {
      Object.values(thumbnails).forEach(url => URL.revokeObjectURL(url));
    };
  }, [thumbnails, files]);

  const handleFilesAccepted = async (acceptedFiles: File[]) => {
    // We can accept multiple files at once or one by one.
    setStage("reading");
    setError(null);
    
    try {
      const newFiles = [...files];
      
      for (const f of acceptedFiles) {
        const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const { pageCount: count } = await parsePdfForOrganize(f);
        
        newFiles.push({ id: fileId, file: f, pageCount: count });
        
        // Load thumbnails
        const pdfDoc = await loadPdfForThumbnails(f);
        
        for (let i = 0; i < count; i++) {
          try {
            const thumbUrl = await generateThumbnail(pdfDoc, i + 1, 0.3);
            const key = `${fileId}-${i}`;
            setThumbnails(prev => ({ ...prev, [key]: thumbUrl }));
          } catch (e) {
            console.error(`Failed to generate thumbnail for page ${i + 1}`, e);
          }
        }
        
        // Add pages to state
        addPages(fileId, count);
      }
      
      setFiles(newFiles);
      setStage("idle");
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF. It might be encrypted or corrupted.");
      setStage("idle");
    }
  };

  const handleExport = async () => {
    if (files.length === 0) return;

    if (pages.length === 0) {
      setError("You must have at least one page to export a PDF.");
      return;
    }

    try {
      setError(null);
      setStage("processing");
      
      const out = await organizePdfPages(files, pages, (s) => setStage(s as ProcessingStage));
      setResult(out);
      setStage("success");
      
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "An unexpected error occurred while processing the PDF.");
      setStage("error");
    }
  };

  const handleResetApp = () => {
    setFiles([]);
    setStage("idle");
    setError(null);
    setResult(null);
    setThumbnails({});
    reset();
  };

  const handleRotateSelection = (degrees: number) => {
    rotatePages(selectedIds, degrees);
  };

  const handleDeleteSelection = () => {
    deletePages(selectedIds);
  };

  const handleDuplicateSelection = () => {
    duplicatePages(selectedIds);
  };

  const handleRotatePage = (id: string, degrees: number) => {
    rotatePages([id], degrees);
  };

  const handleDeletePage = (id: string) => {
    deletePages([id]);
  };

  const handleDuplicatePage = (id: string) => {
    duplicatePages([id]);
  };

  if (stage === "success" && result && files.length > 0) {
    const totalOriginalSize = files.reduce((acc, f) => acc + f.file.size, 0);
    const totalOriginalPages = files.reduce((acc, f) => acc + f.pageCount, 0);
    
    return (
      <OrganizeSuccessView 
        result={result} 
        originalPageCount={totalOriginalPages} 
        finalPageCount={pages.length}
        originalSize={totalOriginalSize}
        onReset={handleResetApp} 
      />
    );
  }

  const isProcessing = stage !== "idle" && stage !== "error" && stage !== "reading";

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Organize PDF</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Reorder, rotate, delete, or duplicate pages. Your PDF is processed locally in your browser.
        </p>
      </div>

      {error && (
        <div className="w-full p-4 bg-error-container border-[3px] border-on-background rounded-xl neubrutal-shadow flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-on-error-container shrink-0 mt-0.5" />
          <div>
            <h3 className="font-headline-sm text-on-error-container mb-1">Processing Failed</h3>
            <p className="font-body-md text-on-error-container/80">{error}</p>
          </div>
        </div>
      )}

      {!files.length ? (
        <FileUploader 
          onFilesAccepted={handleFilesAccepted} 
          isUploading={stage === "reading"} 
          multiple={true}
          title="Click or drag PDFs here"
          description="Select one or more PDF files to organize."
        />
      ) : isProcessing ? (
        <ProcessingStatus 
          stage={stage}
          stageInfo={{
            processing: { text: "Applying page operations...", value: 60 },
            generating: { text: "Saving new PDF...", value: 90 }
          }}
        />
      ) : (
        <div className="w-full flex flex-col gap-6 bg-surface-container-lowest p-4 md:p-6 border-[3px] border-on-background rounded-xl neubrutal-shadow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-[3px] border-on-background pb-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 bg-primary-container rounded-lg border-[2px] border-on-background flex items-center justify-center shrink-0">
                <FileIcon className="w-6 h-6 text-on-primary-container" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-headline-sm text-on-surface truncate" title={files.map(f => f.file.name).join(", ")}>
                  {files.length === 1 ? files[0].file.name : `${files.length} PDFs merged`}
                </h3>
                <p className="text-label-sm text-on-surface-variant">{pages.length} total pages</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFilesAccepted(Array.from(e.target.files));
                    }
                    // Reset value to allow re-selecting the same file
                    e.target.value = "";
                  }}
                  disabled={stage === "reading"}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <Button variant="outline" className="w-full md:w-auto relative z-0">
                  Add More PDFs
                </Button>
              </div>
              <Button size="lg" onClick={handleExport} disabled={pages.length === 0} className="gap-2 flex-1 md:flex-none">
                <Save className="w-5 h-5" />
                Export PDF
              </Button>
            </div>
          </div>

          <OrganizeWorkspace 
            pages={pages}
            thumbnails={thumbnails}
            selectedIds={selectedIds}
            canUndo={canUndo}
            canRedo={canRedo}
            onToggleSelection={toggleSelection}
            onSelectAll={selectAll}
            onClearSelection={clearSelection}
            onReorder={reorderPages}
            onRotateSelection={handleRotateSelection}
            onDeleteSelection={handleDeleteSelection}
            onDuplicateSelection={handleDuplicateSelection}
            onRotatePage={handleRotatePage}
            onDeletePage={handleDeletePage}
            onDuplicatePage={handleDuplicatePage}
            onUndo={undo}
            onRedo={redo}
            onReset={reset}
          />
        </div>
      )}
    </div>
  );
}
