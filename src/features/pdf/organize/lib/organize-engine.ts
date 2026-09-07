import { PDFDocument, PDFPage, degrees } from "pdf-lib";
import { PageModel } from "../hooks/use-organize-state";

export interface OrganizeResult {
  blob: Blob;
  filename: string;
  size: number;
}

export async function parsePdfForOrganize(file: File): Promise<{ pdfDoc: PDFDocument; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return { pdfDoc, pageCount: pdfDoc.getPageCount() };
}

/**
 * Creates a new PDF matching the final organized pages array.
 * @param files The array of original PDF files.
 * @param pages The final array of PageModel objects representing the new structure.
 * @param onProgress Optional progress callback.
 */
export async function organizePdfPages(
  files: { id: string; file: File }[],
  pages: PageModel[],
  onProgress?: (stage: string) => void
): Promise<OrganizeResult> {
  onProgress?.("reading");

  if (pages.length === 0) {
    throw new Error("Cannot generate a PDF with zero pages.");
  }

  // Load all source PDFs
  const pdfDocs = new Map<string, PDFDocument>();
  for (const { id, file } of files) {
    const { pdfDoc } = await parsePdfForOrganize(file);
    pdfDocs.set(id, pdfDoc);
  }

  // Determine the primary filename from the first file in the sequence, 
  // or just the first uploaded file.
  const originalName = files[0].file.name.replace(/\.pdf$/i, "");

  onProgress?.("processing");

  // We need to copy pages from multiple documents.
  // We can group consecutive pages from the same file to optimize `copyPages`.
  
  // For simplicity and safety across multiple files with duplicates, 
  // we'll copy each page individually or group them by fileId.
  // Grouping by fileId is much faster.
  
  const pagesByFile = new Map<string, number[]>();
  pages.forEach(p => {
    const arr = pagesByFile.get(p.fileId) || [];
    arr.push(p.originalIndex);
    pagesByFile.set(p.fileId, arr);
  });

  const copiedPagesByFile = new Map<string, PDFPage[]>();
  
  const newPdf = await PDFDocument.create();

  for (const [fileId, indices] of pagesByFile.entries()) {
    const sourceDoc = pdfDocs.get(fileId);
    if (!sourceDoc) throw new Error(`Missing source document for fileId ${fileId}`);
    const copied = await newPdf.copyPages(sourceDoc, indices);
    copiedPagesByFile.set(fileId, copied);
  }

  // Assemble the new document based on the `pages` array order
  // We need a counter for each fileId to pull the correctly copied page in sequence
  const usageCountByFile = new Map<string, number>();

  pages.forEach((pageModel) => {
    const fileId = pageModel.fileId;
    const usageIndex = usageCountByFile.get(fileId) || 0;
    usageCountByFile.set(fileId, usageIndex + 1);

    const copiedPages = copiedPagesByFile.get(fileId)!;
    const page = copiedPages[usageIndex];
    
    // Apply rotation if needed
    if (pageModel.rotation !== 0) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + pageModel.rotation));
    }

    newPdf.addPage(page);
  });

  onProgress?.("generating");

  const bytes = await newPdf.save();

  return {
    blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    filename: `${originalName}-organized.pdf`,
    size: bytes.byteLength,
  };
}
