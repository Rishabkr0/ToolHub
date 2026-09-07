"use client";

import * as React from "react";
import { ProcessingStage } from "../../shared/types";
import { FileUploader } from "../../shared/components/file-uploader";
import { ProcessingStatus } from "../../shared/components/processing-status";
import { DeleteSuccessView } from "./delete-success-view";
import { DeleteWorkspace } from "./delete-workspace";
import { parsePdfForDeletion, deletePdfPages, DeleteResult } from "../lib/delete-engine";
import { loadPdfForThumbnails, generateThumbnail } from "../../shared/lib/thumbnail-generator";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileIcon, Trash2 } from "lucide-react";

export function DeletePdfTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  
  const [thumbnails, setThumbnails] = React.useState<Record<number, string>>({});
  const [selectedPages, setSelectedPages] = React.useState<number[]>([]);
  
  const [stage, setStage] = React.useState<ProcessingStage>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<DeleteResult | null>(null);
  const [deletedCount, setDeletedCount] = React.useState(0);

  // Cleanup object URLs on unmount or file change
  React.useEffect(() => {
    return () => {
      Object.values(thumbnails).forEach(url => URL.revokeObjectURL(url));
    };
  }, [thumbnails, file]);

  const handleFilesAccepted = async (acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    setFile(f);
    setStage("reading");
    setError(null);
    setSelectedPages([]);
    setThumbnails({});
    setDeletedCount(0);
    
    try {
      const { pageCount: count } = await parsePdfForDeletion(f);
      setPageCount(count);
      
      // Load thumbnails
      const pdfDoc = await loadPdfForThumbnails(f);
      const newThumbnails: Record<number, string> = {};
      
      for (let i = 0; i < count; i++) {
        try {
          const thumbUrl = await generateThumbnail(pdfDoc, i + 1, 0.3);
          newThumbnails[i] = thumbUrl;
          setThumbnails(prev => ({ ...prev, [i]: thumbUrl }));
        } catch (e) {
          console.error(`Failed to generate thumbnail for page ${i + 1}`, e);
        }
      }

      setStage("idle");
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF. It might be encrypted or corrupted.");
      setFile(null);
      setStage("idle");
    }
  };

  const handleToggleSelection = (pageIndex: number) => {
    setSelectedPages(prev => 
      prev.includes(pageIndex) 
        ? prev.filter(p => p !== pageIndex)
        : [...prev, pageIndex]
    );
  };

  const handleSelectAll = () => {
    setSelectedPages(Array.from({ length: pageCount }, (_, i) => i));
  };

  const handleClearSelection = () => {
    setSelectedPages([]);
  };

  const handleSelectOdd = () => {
    const oddPages = [];
    for (let i = 0; i < pageCount; i += 2) {
      oddPages.push(i);
    }
    setSelectedPages(oddPages);
  };

  const handleSelectEven = () => {
    const evenPages = [];
    for (let i = 1; i < pageCount; i += 2) {
      evenPages.push(i);
    }
    setSelectedPages(evenPages);
  };

  const handleDelete = async () => {
    if (!file) return;

    if (selectedPages.length === pageCount) {
      setError("A PDF must contain at least one page.");
      return;
    }

    try {
      setError(null);
      setStage("processing");
      
      const out = await deletePdfPages(file, selectedPages, (s) => setStage(s as ProcessingStage));
      setResult(out);
      setDeletedCount(selectedPages.length);
      setStage("success");
      
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "An unexpected error occurred while processing the PDF.");
      setStage("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setStage("idle");
    setError(null);
    setResult(null);
    setSelectedPages([]);
    setThumbnails({});
    setDeletedCount(0);
  };

  if (stage === "success" && result && file) {
    return (
      <DeleteSuccessView 
        result={result} 
        originalPageCount={pageCount} 
        deletedCount={deletedCount}
        originalSize={file.size}
        onReset={handleReset} 
      />
    );
  }

  const isProcessing = stage !== "idle" && stage !== "error" && stage !== "reading";
  const hasSelection = selectedPages.length > 0;
  const isDeletingAll = selectedPages.length === pageCount;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Delete PDF Pages</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Remove unwanted pages from your PDF document. Processing is 100% private and happens locally in your browser.
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

      {!file ? (
        <FileUploader 
          onFilesAccepted={handleFilesAccepted} 
          isUploading={stage === "reading"} 
          multiple={false}
          title="Click or drag a PDF here"
          description="Select a single PDF file to remove pages from."
        />
      ) : isProcessing ? (
        <ProcessingStatus 
          stage={stage}
          stageInfo={{
            processing: { text: "Removing selected pages...", value: 60 },
            generating: { text: "Saving PDF...", value: 90 }
          }}
        />
      ) : (
        <div className="w-full flex flex-col gap-8 bg-surface-container-lowest p-6 border-[3px] border-on-background rounded-xl neubrutal-shadow">
          <div className="flex items-center justify-between border-b-[3px] border-on-background pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-container rounded-lg border-[2px] border-on-background flex items-center justify-center">
                <FileIcon className="w-6 h-6 text-on-primary-container" />
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface">{file.name}</h3>
                <p className="text-label-sm text-on-surface-variant">{pageCount} pages</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleReset}>Change File</Button>
          </div>

          <DeleteWorkspace 
            pageCount={pageCount}
            thumbnails={thumbnails}
            selectedPages={selectedPages}
            onToggleSelection={handleToggleSelection}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onSelectOdd={handleSelectOdd}
            onSelectEven={handleSelectEven}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t-[3px] border-on-background mt-2 gap-4">
            <div className="text-body-sm text-on-surface-variant text-center sm:text-left">
              {hasSelection ? (
                isDeletingAll ? (
                  <span className="text-error font-label-bold">Cannot delete all pages</span>
                ) : (
                  <span>Ready to remove <strong className="text-on-surface">{selectedPages.length}</strong> pages</span>
                )
              ) : (
                "Select pages above to delete them"
              )}
            </div>
            <Button 
              size="lg" 
              onClick={handleDelete} 
              disabled={!hasSelection || isDeletingAll} 
              className={`gap-2 ${hasSelection && !isDeletingAll ? 'bg-error hover:bg-error/90 text-on-error border-error-container' : ''}`}
            >
              <Trash2 className="w-5 h-5" />
              Delete Selected Pages
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
