import { PDFDocument } from "pdf-lib";

export interface ExtractResult {
  blob: Blob;
  filename: string;
  size: number;
}

export async function parsePdfForExtraction(file: File): Promise<{ pdfDoc: PDFDocument; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err) {
    throw new Error("Failed to load PDF. It may be encrypted or corrupted.");
  }
  return { pdfDoc, pageCount: pdfDoc.getPageCount() };
}

/**
 * Extracts the specified pages from a PDF document into a new PDF.
 * @param file The original PDF file.
 * @param pagesToExtract An array of page indices (0-based) to extract.
 * @param onProgress Optional progress callback.
 */
export async function extractPdfPages(
  file: File,
  pagesToExtract: number[],
  onProgress?: (stage: string) => void
): Promise<ExtractResult> {
  onProgress?.("reading");

  if (pagesToExtract.length === 0) {
    throw new Error("No pages selected for extraction.");
  }

  const { pdfDoc, pageCount } = await parsePdfForExtraction(file);
  const originalName = file.name.replace(/\.pdf$/i, "");

  onProgress?.("processing");

  // Ensure pages are within bounds and deduplicated
  const validPages = Array.from(new Set(pagesToExtract))
    .filter(p => p >= 0 && p < pageCount)
    .sort((a, b) => a - b); // Preserve original order

  if (validPages.length === 0) {
    throw new Error("No valid pages selected for extraction.");
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, validPages);
  copiedPages.forEach((page) => newPdf.addPage(page));

  onProgress?.("generating");

  const bytes = await newPdf.save();

  return {
    blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    filename: `${originalName}-extracted.pdf`,
    size: bytes.byteLength,
  };
}
