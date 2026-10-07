import { Metadata } from "next"
import { CaseConverterTool } from "@/features/documents/case-converter/components/case-converter-tool"

export const metadata: Metadata = {
  title: "Case Converter | ToolHub",
  description: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.",
}

export default function CaseConverterPage() {
  return <CaseConverterTool />
}
