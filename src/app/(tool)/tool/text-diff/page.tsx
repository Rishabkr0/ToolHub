import { Metadata } from "next"
import { TextDiffTool } from "@/features/documents/text-diff/components/text-diff-tool"

export const metadata: Metadata = {
  title: "Document Comparator & Text Diff | ToolHub",
  description: "Compare two documents or text snippets side-by-side to highlight added and removed lines.",
}

export default function TextDiffPage() {
  return <TextDiffTool />
}
