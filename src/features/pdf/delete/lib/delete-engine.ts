import { PDFDocument } from "pdf-lib";

export interface DeleteResult {
  blob: Blob;
  filename: string;
  size: number;
}

export async function parsePdfForDeletion(file: File): Promise<{ pdfDoc: PDFDocument; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return { pdfDoc, pageCount: pdfDoc.getPageCount() };
}

/**
 * Deletes the specified pages from a PDF document.
 * @param file The original PDF file.
 * @param pagesToDelete An array of page indices (0-based) to delete.
 * @param onProgress Optional progress callback.
 */
export async function deletePdfPages(
  file: File,
  pagesToDelete: number[],
  onProgress?: (stage: string) => void
): Promise<DeleteResult> {
  onProgress?.("reading");

  const { pdfDoc, pageCount } = await parsePdfForDeletion(file);
  const originalName = file.name.replace(/\.pdf$/i, "");

  onProgress?.("processing");

  // We must create a new PDF and copy the pages we want to keep
  // to avoid issues with deleting pages directly which can mess up references
  const newPdf = await PDFDocument.create();
  
  const pagesToKeep: number[] = [];
  for (let i = 0; i < pageCount; i++) {
    if (!pagesToDelete.includes(i)) {
      pagesToKeep.push(i);
    }
  }

  if (pagesToKeep.length === 0) {
    throw new Error("Cannot delete all pages from the PDF.");
  }

  const copiedPages = await newPdf.copyPages(pdfDoc, pagesToKeep);
  copiedPages.forEach((page) => newPdf.addPage(page));

  onProgress?.("generating");

  const bytes = await newPdf.save();

  return {
    blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    filename: `${originalName}-edited.pdf`,
    size: bytes.byteLength,
  };
}
