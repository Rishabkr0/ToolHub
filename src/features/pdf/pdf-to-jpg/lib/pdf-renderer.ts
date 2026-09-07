"use client"

import type * as pdfjsLib from "pdfjs-dist"

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

export type ImageQuality = "standard" | "high" | "maximum"
export type ImageResolution = "standard" | "high" | "maximum"

export interface PdfToJpgResult {
  images: {
    pageNumber: number
    blob: Blob
    filename: string
    width: number
    height: number
    size: number
  }[]
  totalSize: number
}

const RESOLUTION_MAP: Record<ImageResolution, number> = {
  standard: 1.5,
  high: 2.0,
  maximum: 3.0,
}

const QUALITY_MAP: Record<ImageQuality, number> = {
  standard: 0.7,
  high: 0.85,
  maximum: 1.0,
}

/**
 * Loads a PDF document using pdfjs-dist.
 */
export async function loadPdfForRendering(arrayBuffer: ArrayBuffer) {
  const lib = await initPdfJs();
  const loadingTask = lib.getDocument({ data: new Uint8Array(arrayBuffer) })
  return await loadingTask.promise
}

/**
 * Renders a specific page of a PDF document to a JPG Blob.
 */
export async function renderPageToJpg(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  resolution: ImageResolution,
  quality: ImageQuality
): Promise<{ blob: Blob; width: number; height: number }> {
  const page = await pdfDoc.getPage(pageNumber)
  const scale = RESOLUTION_MAP[resolution]
  const viewport = page.getViewport({ scale })

  // Prepare canvas using standard HTML5 canvas
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  
  if (!context) {
    throw new Error("Could not create canvas context.")
  }

  canvas.width = viewport.width
  canvas.height = viewport.height

  // Render PDF page into canvas context
  const renderContext: any = {
    canvasContext: context,
    viewport: viewport,
  }
  
  await page.render(renderContext).promise

  // Convert canvas to JPG Blob
  const jpgQuality = QUALITY_MAP[quality]
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ blob, width: canvas.width, height: canvas.height })
        } else {
          reject(new Error(`Failed to create blob for page ${pageNumber}`))
        }
      },
      "image/jpeg",
      jpgQuality
    )
  })
}
