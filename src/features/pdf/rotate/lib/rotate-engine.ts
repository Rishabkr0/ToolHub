import { PDFDocument, degrees } from "pdf-lib";

export interface RotateResult {
  blob: Blob;
  filename: string;
  size: number;
}

export async function parsePdfForRotation(file: File): Promise<{ pdfDoc: PDFDocument; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return { pdfDoc, pageCount: pdfDoc.getPageCount() };
}

/**
 * Rotates the specified pages in a PDF document.
 * @param file The original PDF file.
 * @param rotations A record mapping page index (0-based) to the rotation angle (0, 90, 180, 270).
 * @param onProgress Optional progress callback.
 */
export async function rotatePdf(
  file: File,
  rotations: Record<number, number>,
  onProgress?: (stage: string) => void
): Promise<RotateResult> {
  onProgress?.("reading");

  const { pdfDoc } = await parsePdfForRotation(file);
  const originalName = file.name.replace(/\.pdf$/i, "");

  onProgress?.("processing");

  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    if (rotations[i] !== undefined && rotations[i] !== 0) {
      const page = pages[i];
      // Get the current rotation and add the new one, then normalize to 0-360
      const currentRotation = page.getRotation().angle;
      const newRotation = (currentRotation + rotations[i]) % 360;
      page.setRotation(degrees(newRotation));
    }
  }

  onProgress?.("generating");

  const bytes = await pdfDoc.save();

  return {
    blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
    filename: `${originalName}-rotated.pdf`,
    size: bytes.byteLength,
  };
}
