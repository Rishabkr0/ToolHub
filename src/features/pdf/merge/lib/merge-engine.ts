import { PDFDocument } from "pdf-lib";

export async function mergePdfs(files: File[], onProgress?: (stage: string) => void): Promise<Blob> {
  onProgress?.("reading");
  
  const mergedPdf = await PDFDocument.create();

  onProgress?.("merging");
  
  for (const file of files) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      let pdf;
      try {
        pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      } catch (err) {
        throw new Error("Failed to load PDF. It may be encrypted or corrupted.");
      }
      
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    } catch (err) {
      console.error(`Error processing file ${file.name}:`, err);
      throw new Error(`Failed to merge ${file.name}. It might be corrupted or encrypted.`);
    }
  }

  onProgress?.("generating");
  const mergedPdfBytes = await mergedPdf.save();
  
  return new Blob([mergedPdfBytes as BlobPart], { type: "application/pdf" });
}
