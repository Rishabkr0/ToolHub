import { PDFDocument } from "pdf-lib";

export type CompressMode = "recommended" | "maximum";

export interface CompressResult {
  blob: Blob;
  filename: string;
  originalSize: number;
  compressedSize: number;
  isOptimized: boolean;
}

export async function compressPdf(
  file: File,
  mode: CompressMode,
  onProgress?: (stage: string) => void
): Promise<CompressResult> {
  onProgress?.("reading");
  
  const arrayBuffer = await file.arrayBuffer();
  
  onProgress?.("processing");
  
  // Loading and re-saving naturally performs garbage collection of dead objects
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err) {
    throw new Error("Failed to load PDF. It may be encrypted or corrupted.");
  }
  
  if (mode === "maximum") {
    // Strip metadata
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("");
    pdfDoc.setCreator("");
    // We cannot easily strip hidden metadata dictionaries without lower level manipulation,
    // but clearing these standard fields saves a few bytes.
  }

  onProgress?.("generating");

  // useObjectStreams: true is the crucial part for structural compression in pdf-lib
  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  
  const originalSize = file.size;
  const compressedSize = pdfBytes.length;
  
  // We only consider it "optimized" if it actually saved space.
  const isOptimized = compressedSize < originalSize;
  
  const originalName = file.name.replace(/\.pdf$/i, "");
  const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });

  return {
    blob,
    filename: `${originalName}-compressed.pdf`,
    originalSize,
    compressedSize,
    isOptimized
  };
}
