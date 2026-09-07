import { PDFDocument, PageSizes } from "pdf-lib"
import { FileItem } from "../../shared/types"

export type PageSizeOption = "auto" | "a4" | "letter" | "legal"
export type OrientationOption = "portrait" | "landscape"
export type FitOption = "fit" | "fill" | "original"
export type MarginOption = "none" | "small" | "medium" | "large"
export type QualityOption = "standard" | "high" // For future expansion (downscaling)

export interface PdfSettings {
  pageSize: PageSizeOption
  orientation: OrientationOption
  fit: FitOption
  margin: MarginOption
  quality: QualityOption
}

const MARGIN_MAP: Record<MarginOption, number> = {
  none: 0,
  small: 20,
  medium: 40,
  large: 60,
}

const PAGE_SIZE_MAP = {
  a4: PageSizes.A4,
  letter: PageSizes.Letter,
  legal: PageSizes.Legal,
}

export async function convertJpgToPdf(files: FileItem[], settings: PdfSettings): Promise<{ blob: Blob; size: number }> {
  const pdfDoc = await PDFDocument.create()

  const marginPt = MARGIN_MAP[settings.margin]

  for (const fileItem of files) {
    const arrayBuffer = await fileItem.file.arrayBuffer()
    let image
    
    // Embed the image
    if (fileItem.file.type === "image/png") {
      image = await pdfDoc.embedPng(arrayBuffer)
    } else {
      // Default to jpg
      image = await pdfDoc.embedJpg(arrayBuffer)
    }

    const imgDims = image.scale(1) // Get original dimensions
    
    // Determine page size
    let pageWidth = 0
    let pageHeight = 0

    if (settings.pageSize === "auto") {
      // We will match the image's orientation
      pageWidth = imgDims.width + (marginPt * 2)
      pageHeight = imgDims.height + (marginPt * 2)
    } else {
      const standardSize = PAGE_SIZE_MAP[settings.pageSize]
      if (settings.orientation === "landscape") {
        pageWidth = standardSize[1]
        pageHeight = standardSize[0]
      } else {
        pageWidth = standardSize[0]
        pageHeight = standardSize[1]
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight])
    const availableWidth = pageWidth - (marginPt * 2)
    const availableHeight = pageHeight - (marginPt * 2)

    let finalWidth = imgDims.width
    let finalHeight = imgDims.height

    if (settings.fit === "fit") {
      // Contain (preserve aspect ratio, fit inside available space)
      const scaleX = availableWidth / imgDims.width
      const scaleY = availableHeight / imgDims.height
      const scale = Math.min(scaleX, scaleY)
      // Only scale down, don't scale up unnecessarily, wait, users usually want it to fit the page if smaller.
      finalWidth = imgDims.width * scale
      finalHeight = imgDims.height * scale
    } else if (settings.fit === "fill") {
      // Cover (preserve aspect ratio, fill available space, some clipping happens but we can't clip easily in pdf-lib, so we just center it and let it overflow slightly, or scale it to max)
      // Actually, better is to scale it to fill. 
      const scaleX = availableWidth / imgDims.width
      const scaleY = availableHeight / imgDims.height
      const scale = Math.max(scaleX, scaleY)
      finalWidth = imgDims.width * scale
      finalHeight = imgDims.height * scale
    } else {
      // Original: if original is larger than page, it will just overflow. We leave finalWidth and finalHeight as is.
    }

    // Center the image
    const x = (pageWidth - finalWidth) / 2
    const y = (pageHeight - finalHeight) / 2

    page.drawImage(image, {
      x,
      y,
      width: finalWidth,
      height: finalHeight,
    })
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
  return { blob, size: blob.size }
}
