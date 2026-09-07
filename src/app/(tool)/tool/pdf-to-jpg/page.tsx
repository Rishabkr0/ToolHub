"use client"

import dynamic from "next/dynamic"

const PdfToJpgTool = dynamic(
  () => import("@/features/pdf/pdf-to-jpg/components/pdf-to-jpg-tool").then(mod => mod.PdfToJpgTool),
  { ssr: false }
)

export default function PdfToJpgPage() {
  return <PdfToJpgTool />
}
