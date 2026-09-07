"use client";

import type * as pdfjsLib from "pdfjs-dist";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsLibInstance: any = null;

async function initPdfJs() {
  if (pdfjsLibInstance) return pdfjsLibInstance;
  pdfjsLibInstance = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjsLibInstance.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLibInstance.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjsLibInstance;
}

export async function loadPdfForThumbnails(file: File): Promise<pdfjsLib.PDFDocumentProxy> {
  const lib = await initPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = lib.getDocument({ data: new Uint8Array(arrayBuffer) });
  return await loadingTask.promise;
}

export async function generateThumbnail(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 0.3
): Promise<string> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create canvas context.");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderContext: any = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error(`Failed to create thumbnail blob for page ${pageNumber}`));
        }
      },
      "image/jpeg",
      0.6 // Lower quality for thumbnails
    );
  });
}
