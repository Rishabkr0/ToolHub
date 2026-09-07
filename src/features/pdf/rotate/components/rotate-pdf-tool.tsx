"use client";

import * as React from "react";
import { ProcessingStage } from "../../shared/types";
import { FileUploader } from "../../shared/components/file-uploader";
import { ProcessingStatus } from "../../shared/components/processing-status";
import { RotateSuccessView } from "./rotate-success-view";
import { RotateWorkspace } from "./rotate-workspace";
import { parsePdfForRotation, rotatePdf, RotateResult } from "../lib/rotate-engine";
import { loadPdfForThumbnails, generateThumbnail } from "../../shared/lib/thumbnail-generator";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileIcon, Save } from "lucide-react";

export function RotatePdfTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  
  const [thumbnails, setThumbnails] = React.useState<Record<number, string>>({});
  const [rotations, setRotations] = React.useState<Record<number, number>>({});
  const [selectedPages, setSelectedPages] = React.useState<number[]>([]);
  
  const [stage, setStage] = React.useState<ProcessingStage>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<RotateResult | null>(null);

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
    setRotations({});
    setSelectedPages([]);
    setThumbnails({});
    
    try {
      const { pageCount: count } = await parsePdfForRotation(f);
      setPageCount(count);
      
      // Load thumbnails
      const pdfDoc = await loadPdfForThumbnails(f);
      const newThumbnails: Record<number, string> = {};
      
      // We render thumbnails sequentially or in small batches to save memory
      for (let i = 0; i < count; i++) {
        try {
          const thumbUrl = await generateThumbnail(pdfDoc, i + 1, 0.3);
          newThumbnails[i] = thumbUrl;
          // Update state iteratively so user sees them appearing
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

  const handleRotatePage = (pageIndex: number, amount: number) => {
    setRotations(prev => ({
      ...prev,
      [pageIndex]: ((prev[pageIndex] || 0) + amount) % 360
    }));
  };

  const handleRotateSelected = (amount: number) => {
    setRotations(prev => {
      const next = { ...prev };
      selectedPages.forEach(i => {
        next[i] = ((next[i] || 0) + amount) % 360;
      });
      return next;
    });
  };

  const handleRotateAll = (amount: number) => {
    setRotations(prev => {
      const next = { ...prev };
      for (let i = 0; i < pageCount; i++) {
        next[i] = ((next[i] || 0) + amount) % 360;
      }
      return next;
    });
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

  const handleApplyRotations = async () => {
    if (!file) return;

    try {
      setError(null);
      setStage("processing");
      
      const out = await rotatePdf(file, rotations, (s) => setStage(s as ProcessingStage));
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
    setRotations({});
    setSelectedPages([]);
    setThumbnails({});
  };

  if (stage === "success" && result) {
    return <RotateSuccessView result={result} onReset={handleReset} />;
  }

  const isProcessing = stage !== "idle" && stage !== "error" && stage !== "reading";
  const hasModifications = Object.values(rotations).some(r => r !== 0 && r !== 360 && r !== -360);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Rotate PDF</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Rotate individual PDF pages or the entire document. Processing is 100% private and happens locally in your browser.
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
          description="Select a single PDF file to rotate."
        />
      ) : isProcessing ? (
        <ProcessingStatus 
          stage={stage}
          stageInfo={{
            processing: { text: "Applying rotations...", value: 60 },
            generating: { text: "Saving PDF...", value: 90 }
          }}
        />
      ) : (
        <div className="w-full flex flex-col gap-8 bg-surface-container-lowest p-6 border-[3px] border-on-background rounded-xl neubrutal-shadow">
          {/* File Info Header */}
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

          <RotateWorkspace 
            pageCount={pageCount}
            thumbnails={thumbnails}
            rotations={rotations}
            selectedPages={selectedPages}
            onToggleSelection={handleToggleSelection}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onRotatePage={handleRotatePage}
            onRotateSelected={handleRotateSelected}
            onRotateAll={handleRotateAll}
          />

          {/* Action */}
          <div className="flex justify-between items-center pt-4 border-t-[3px] border-on-background mt-2">
            <p className="text-body-sm text-on-surface-variant">
              {hasModifications ? "Changes pending" : "No rotations applied"}
            </p>
            <Button size="lg" onClick={handleApplyRotations} disabled={!hasModifications} className="gap-2">
              <Save className="w-5 h-5" />
              Apply Rotations & Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
