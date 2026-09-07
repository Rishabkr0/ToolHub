"use client";

import * as React from "react";
import { Download, RotateCcw, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteResult } from "../lib/delete-engine";
import { formatBytes } from "../../shared/lib/utils";

interface DeleteSuccessViewProps {
  result: DeleteResult;
  originalPageCount: number;
  deletedCount: number;
  originalSize: number;
  onReset: () => void;
}

export function DeleteSuccessView({ result, originalPageCount, deletedCount, originalSize, onReset }: DeleteSuccessViewProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const remainingCount = originalPageCount - deletedCount;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8 py-12">
      <div className="w-24 h-24 bg-primary-container rounded-full border-[4px] border-on-background flex items-center justify-center neubrutal-shadow mb-4">
        <CheckCircle2 className="w-12 h-12 text-on-primary-container" />
      </div>

      <div className="text-center">
        <h2 className="font-display-md text-3xl text-on-background mb-4">PDF Updated Successfully!</h2>
        <p className="font-body-lg text-on-surface-variant">
          The selected pages have been removed from your PDF.
        </p>
      </div>

      <div className="w-full bg-surface-container-lowest p-6 border-[3px] border-on-background rounded-xl neubrutal-shadow flex flex-col gap-6">
        
        <div className="grid grid-cols-3 gap-4 p-4 bg-surface-container rounded-lg border-[2px] border-on-background text-center">
          <div>
            <div className="text-label-sm text-on-surface-variant mb-1">Original</div>
            <div className="font-headline-sm text-on-surface">{originalPageCount} pages</div>
          </div>
          <div className="border-l-[2px] border-r-[2px] border-on-background">
            <div className="text-label-sm text-on-surface-variant mb-1">Deleted</div>
            <div className="font-headline-sm text-error">{deletedCount} pages</div>
          </div>
          <div>
            <div className="text-label-sm text-on-surface-variant mb-1">Remaining</div>
            <div className="font-headline-sm text-primary">{remainingCount} pages</div>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-body-sm text-on-surface-variant">
          <span>Original Size: {formatBytes(originalSize)}</span>
          <span>New Size: {formatBytes(result.size)}</span>
        </div>

        <div className="flex items-center gap-4 p-4 bg-surface-container rounded-lg border-[2px] border-on-background mt-2">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-headline-sm text-on-surface truncate" title={result.filename}>
              {result.filename}
            </h4>
            <p className="text-label-sm text-on-surface-variant">
              {formatBytes(result.size)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Button size="lg" onClick={handleDownload} className="flex-1 gap-2 text-base h-14">
            <Download className="w-5 h-5" />
            Download PDF
          </Button>
          
          <Button size="lg" variant="outline" onClick={onReset} className="flex-1 gap-2 text-base h-14 bg-surface hover:bg-surface-container-high">
            <RotateCcw className="w-5 h-5" />
            Delete More Pages
          </Button>
        </div>
      </div>

      <p className="text-body-sm text-on-surface-variant text-center max-w-md">
        Your PDF was processed locally in your browser. No files were uploaded to any server.
      </p>
    </div>
  );
}
