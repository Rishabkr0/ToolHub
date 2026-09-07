export type ProcessingStage = "idle" | "reading" | "processing" | "generating" | "success" | "error";

export interface FileItem {
  id: string; // Unique identifier for dnd-kit
  file: File;
  previewUrl: string; // Blob URL for PDF preview if needed, or thumbnail
  pageCount?: number;
  size: number;
}
