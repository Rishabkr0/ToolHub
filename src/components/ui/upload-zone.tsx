"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadZoneProps {
  onFileAccepted: (file: File) => void
  accept?: Record<string, string[]>
  maxSize?: number
  className?: string
}

/**
 * A reusable drag-and-drop upload zone component.
 */
export const UploadZone = React.forwardRef<HTMLDivElement, UploadZoneProps>(
  ({ onFileAccepted, accept, maxSize = 10 * 1024 * 1024, className }, ref) => {
    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          onFileAccepted(acceptedFiles[0])
        }
      },
      [onFileAccepted]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    })

    return (
      <div
        ref={ref}
        {...getRootProps()}
        className={cn(
          "w-full p-xl border-[3px] border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all neubrutal-shadow group",
          isDragActive
            ? "border-primary bg-primary-container/20"
            : "border-on-background bg-surface-container-lowest hover:bg-surface-container-low",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-md border-[3px] border-on-background transition-transform group-hover:scale-110 group-active:scale-95",
          isDragActive ? "bg-primary-container text-on-primary-container" : "bg-surface-container text-on-surface"
        )}>
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="font-headline-md text-on-surface mb-xs text-center">
          {isDragActive ? "Drop the file here" : "Click or drag file to this area"}
        </h3>
        <p className="font-body-md text-on-surface-variant text-center max-w-sm">
          Support for a single file upload. Maximum file size is {Math.round(maxSize / (1024 * 1024))}MB.
        </p>
      </div>
    )
  }
)
UploadZone.displayName = "UploadZone"
