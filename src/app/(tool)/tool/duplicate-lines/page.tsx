import { Metadata } from "next"
import { DuplicateLinesTool } from "@/features/documents/duplicate-lines/components/duplicate-lines-tool"

export const metadata: Metadata = {
  title: "Duplicate Line Remover & List Sorter | ToolHub",
  description: "Remove duplicate lines from text, sort lists alphabetically or by length, and strip empty lines.",
}

export default function DuplicateLinesPage() {
  return <DuplicateLinesTool />
}
