import * as React from "react"
import { MergePdfTool } from "@/features/pdf/merge/components/merge-pdf-tool"

export default async function ToolPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  if (params.slug === "merge-pdf") {
    return <MergePdfTool />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-xl">
      <h1 className="font-display-lg text-[40px] text-on-background mb-4">
        Tool: {params.slug}
      </h1>
      <p className="font-body-lg text-on-surface-variant max-w-2xl text-center">
        This tool is currently under construction. Check back later!
      </p>
    </div>
  )
}
