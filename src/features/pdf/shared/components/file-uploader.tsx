"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FilePlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onFilesAccepted: (files: File[]) => void
  isUploading?: boolean
  multiple?: boolean
  title?: string
  description?: string
  accept?: Record<string, string[]>
}

export function FileUploader({ 
  onFilesAccepted, 
  isUploading = false,
  multiple = true,
  title = "Click or drag files here",
  description = "Support for PDF documents",
  accept = {
    'application/pdf': ['.pdf']
  }
}: FileUploaderProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles)
      }
    },
    [onFilesAccepted]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    disabled: isUploading
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-full p-xl border-[3px] border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all neubrutal-shadow group",
        isDragActive
          ? "border-primary bg-primary-container/20"
          : "border-on-background bg-surface-container-lowest hover:bg-surface-container-low",
        isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <input {...getInputProps()} />
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center mb-md border-[3px] border-on-background transition-transform group-hover:scale-110",
        isDragActive ? "bg-primary-container text-on-primary-container" : "bg-surface-container text-on-surface"
      )}>
        {isDragActive ? <FilePlus className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
      </div>
      <h3 className="font-headline-md text-on-surface mb-xs text-center">
        {isDragActive ? "Drop PDF(s) here" : (title || (multiple ? "Click or drag PDFs to this area" : "Click or drag a PDF to this area"))}
      </h3>
      <p className="font-body-md text-on-surface-variant text-center max-w-sm">
        {description || (multiple ? "Select multiple PDF files." : "Select a PDF file.")} Files are processed entirely in your browser.
      </p>
    </div>
  )
}
