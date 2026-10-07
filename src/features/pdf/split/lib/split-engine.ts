import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export type SplitMode = "all" | "selected" | "ranges";

export interface SplitResult {
  isZip: boolean;
  blob: Blob;
  filename: string;
  count: number;
}

export async function parsePdfForSplitting(file: File): Promise<{ pdfDoc: PDFDocument; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err) {
    throw new Error("Failed to load PDF. It may be encrypted or corrupted.");
  }
  return { pdfDoc, pageCount: pdfDoc.getPageCount() };
}

function parseRanges(rangesStr: string, maxPages: number): number[][] {
  const ranges = rangesStr.split(",").map(s => s.trim()).filter(Boolean);
  const result: number[][] = [];

  for (const r of ranges) {
    if (r.includes("-")) {
      const [startStr, endStr] = r.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      
      if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > maxPages) {
        throw new Error(`Invalid range: ${r}. Ensure page numbers are between 1 and ${maxPages}.`);
      }
      
      const rangeArr = [];
      for (let i = start; i <= end; i++) {
        rangeArr.push(i);
      }
      result.push(rangeArr);
    } else {
      const page = parseInt(r, 10);
      if (isNaN(page) || page < 1 || page > maxPages) {
        throw new Error(`Invalid page: ${r}. Ensure it is between 1 and ${maxPages}.`);
      }
      result.push([page]);
    }
  }

  if (result.length === 0) {
    throw new Error("No valid ranges provided.");
  }

  return result;
}

export async function splitPdf(
  file: File,
  mode: SplitMode,
  selectedPages: number[], // 1-indexed
  rangesStr: string,
  onProgress?: (stage: string) => void
): Promise<SplitResult> {
  onProgress?.("reading");
  
  const { pdfDoc, pageCount } = await parsePdfForSplitting(file);
  const originalName = file.name.replace(/\.pdf$/i, "");

  onProgress?.("processing");

  const outputs: { filename: string; doc: PDFDocument }[] = [];

  if (mode === "all") {
    // 1 PDF per page
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      outputs.push({
        filename: `${originalName}-page-${i + 1}.pdf`,
        doc: newPdf
      });
    }
  } else if (mode === "selected") {
    if (selectedPages.length === 0) throw new Error("No pages selected.");
    const newPdf = await PDFDocument.create();
    const indices = selectedPages.map(p => p - 1); // 0-indexed
    const copiedPages = await newPdf.copyPages(pdfDoc, indices);
    copiedPages.forEach(p => newPdf.addPage(p));
    outputs.push({
      filename: `${originalName}-extracted.pdf`,
      doc: newPdf
    });
  } else if (mode === "ranges") {
    const ranges = parseRanges(rangesStr, pageCount);
    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const indices = range.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(pdfDoc, indices);
      copiedPages.forEach(p => newPdf.addPage(p));
      const rangeLabel = range.length === 1 ? `${range[0]}` : `${range[0]}-${range[range.length - 1]}`;
      outputs.push({
        filename: `${originalName}-pages-${rangeLabel}.pdf`,
        doc: newPdf
      });
    }
  }

  onProgress?.("generating");

  if (outputs.length === 1) {
    const bytes = await outputs[0].doc.save();
    return {
      isZip: false,
      blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
      filename: outputs[0].filename,
      count: 1
    };
  }

  // If multiple, ZIP them
  const zip = new JSZip();
  for (const out of outputs) {
    const bytes = await out.doc.save();
    zip.file(out.filename, bytes as Uint8Array);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return {
    isZip: true,
    blob: zipBlob,
    filename: `${originalName}-split.zip`,
    count: outputs.length
  };
}
