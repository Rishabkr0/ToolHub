import * as React from "react"
import { notFound } from "next/navigation"
import { MergePdfTool } from "@/features/pdf/merge/components/merge-pdf-tool"
import { SplitPdfTool } from "@/features/pdf/split/components/split-pdf-tool"
import { CompressPdfTool } from "@/features/pdf/compress/components/compress-pdf-tool"
import { RotatePdfTool } from "@/features/pdf/rotate/components/rotate-pdf-tool"
import { DeletePdfTool } from "@/features/pdf/delete/components/delete-pdf-tool"
import { ExtractPdfTool } from "@/features/pdf/extract/components/extract-pdf-tool"
import { OrganizePdfTool } from "@/features/pdf/organize/components/organize-pdf-tool"
import { PdfToJpgTool } from "@/features/pdf/pdf-to-jpg/components/pdf-to-jpg-tool"
import { JpgToPdfTool } from "@/features/pdf/jpg-to-pdf/components/jpg-to-pdf-tool"
import { WordCounterTool } from "@/features/documents/word-counter/components/word-counter-tool"
import { CaseConverterTool } from "@/features/documents/case-converter/components/case-converter-tool"
import { TextDiffTool } from "@/features/documents/text-diff/components/text-diff-tool"
import { DuplicateLinesTool } from "@/features/documents/duplicate-lines/components/duplicate-lines-tool"
import { MarkdownEditorTool } from "@/features/documents/markdown-editor/components/markdown-editor-tool"
import { TOOLS } from "@/config/tools"

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  "merge-pdf": MergePdfTool,
  "split-pdf": SplitPdfTool,
  "compress-pdf": CompressPdfTool,
  "rotate-pdf": RotatePdfTool,
  "delete-pdf-pages": DeletePdfTool,
  "extract-pdf-pages": ExtractPdfTool,
  "organize-pdf": OrganizePdfTool,
  "pdf-to-jpg": PdfToJpgTool,
  "jpg-to-pdf": JpgToPdfTool,
  "word-counter": WordCounterTool,
  "case-converter": CaseConverterTool,
  "text-diff": TextDiffTool,
  "duplicate-lines": DuplicateLinesTool,
  "markdown-editor": MarkdownEditorTool,
}

export default async function ToolPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params

  const ToolComponent = TOOL_COMPONENTS[slug]
  if (ToolComponent) {
    return <ToolComponent />
  }

  const toolExists = TOOLS.some((t) => t.slug === slug)
  if (!toolExists) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-xl">
      <h1 className="font-display-lg text-[40px] text-on-background mb-4">
        Tool: {slug}
      </h1>
      <p className="font-body-lg text-on-surface-variant max-w-2xl text-center">
        This tool is currently under construction. Check back soon!
      </p>
    </div>
  )
}
