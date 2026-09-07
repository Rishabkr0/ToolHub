"use client"

import * as React from "react"
import { ProcessingStage } from "../types"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

export type ProcessingStageInfo = { text: string; value: number }

interface ProcessingStatusProps {
  stage: ProcessingStage
  stageInfo?: Partial<Record<ProcessingStage, ProcessingStageInfo>>
}

export function ProcessingStatus({ stage, stageInfo }: ProcessingStatusProps) {
  const defaultInfo: Record<ProcessingStage, ProcessingStageInfo> = {
    idle: { text: "Preparing...", value: 0 },
    reading: { text: "Reading PDF files...", value: 25 },
    processing: { text: "Processing pages...", value: 60 },
    generating: { text: "Generating output...", value: 90 },
    success: { text: "Complete!", value: 100 },
    error: { text: "Error occurred", value: 0 }
  }

  const info = { ...defaultInfo, ...stageInfo }[stage] || defaultInfo.idle

  return (
    <div className="w-full max-w-lg mx-auto bg-surface-container-lowest border-[3px] border-on-background rounded-xl p-lg neubrutal-shadow flex flex-col items-center">
      <div className="flex items-center gap-3 mb-6">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <h3 className="font-headline-md text-on-surface">{info.text}</h3>
      </div>
      <Progress value={info.value} className="w-full h-4" />
      <p className="mt-4 text-label-sm text-on-surface-variant text-center">
        Processing locally in your browser. Do not close this tab.
      </p>
    </div>
  )
}
