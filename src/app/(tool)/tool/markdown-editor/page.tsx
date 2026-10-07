import { Metadata } from "next"
import { MarkdownEditorTool } from "@/features/documents/markdown-editor/components/markdown-editor-tool"

export const metadata: Metadata = {
  title: "Markdown Editor & Live Previewer | ToolHub",
  description: "Write and format Markdown with instant live preview. Export to HTML or clean Markdown files.",
}

export default function MarkdownEditorPage() {
  return <MarkdownEditorTool />
}
