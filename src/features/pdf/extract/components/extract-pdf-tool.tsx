"use client";

import * as React from "react";
import { ProcessingStage } from "../../shared/types";
import { FileUploader } from "../../shared/components/file-uploader";
import { ProcessingStatus } from "../../shared/components/processing-status";
import { ExtractSuccessView } from "./extract-success-view";
import { ExtractWorkspace } from "./extract-workspace";
import { parsePdfForExtraction, extractPdfPages, ExtractResult } from "../lib/extract-engine";
import { loadPdfForThumbnails, generateThumbnail } from "../../shared/lib/thumbnail-generator";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileIcon, Copy } from "lucide-react";

export function ExtractPdfTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  
  const [thumbnails, setThumbnails] = React.useState<Record<number, string>>({});
  const [selectedPages, setSelectedPages] = React.useState<number[]>([]);
  
  const [stage, setStage] = React.useState<ProcessingStage>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<ExtractResult | null>(null);

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
    
    try {
      const { pageCount: count } = await parsePdfForExtraction(f);
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
    setSelectedPages(prev => {
      let next;
      if (prev.includes(pageIndex)) {
        next = prev.filter(p => p !== pageIndex);
      } else {
        next = [...prev, pageIndex];
      }
      return next.sort((a, b) => a - b);
    });
  };

  const handleSelectAll = () => {
    setSelectedPages(Array.from({ length: pageCount }, (_, i) => i));
  };

  const handleClearSelection = () => {
    setSelectedPages([]);
  };

  const handleSetSelection = (pages: number[]) => {
    setSelectedPages(pages);
  };

  const handleExtract = async () => {
    if (!file || selectedPages.length === 0) return;

    try {
      setError(null);
      setStage("processing");
      
      const out = await extractPdfPages(file, selectedPages, (s) => setStage(s as ProcessingStage));
      setResult(out);
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
  };

  if (stage === "success" && result && file) {
    return (
      <ExtractSuccessView 
        result={result} 
        originalPageCount={pageCount} 
        extractedCount={selectedPages.length}
        originalSize={file.size}
        onReset={handleReset} 
      />
    );
  }

  const isProcessing = stage !== "idle" && stage !== "error" && stage !== "reading";
  const hasSelection = selectedPages.length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Extract PDF Pages</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Extract specific pages from your PDF into a new document. Processing is 100% private and happens locally in your browser.
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
          description="Select a single PDF file to extract pages from."
        />
      ) : isProcessing ? (
        <ProcessingStatus 
          stage={stage}
          stageInfo={{
            processing: { text: "Extracting selected pages...", value: 60 },
            generating: { text: "Saving new PDF...", value: 90 }
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

          <ExtractWorkspace 
            pageCount={pageCount}
            thumbnails={thumbnails}
            selectedPages={selectedPages}
            onToggleSelection={handleToggleSelection}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onSetSelection={handleSetSelection}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t-[3px] border-on-background mt-2 gap-4">
            <div className="text-body-sm text-on-surface-variant text-center sm:text-left">
              {hasSelection ? (
                <span>Ready to extract <strong className="text-on-surface">{selectedPages.length}</strong> pages into a new PDF</span>
              ) : (
                "Select pages above to extract them"
              )}
            </div>
            <Button 
              size="lg" 
              onClick={handleExtract} 
              disabled={!hasSelection} 
              className="gap-2"
            >
              <Copy className="w-5 h-5" />
              Extract Selected Pages
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
