import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center p-xl gap-md">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="w-64 h-8" />
      <Skeleton className="w-48 h-4" />
    </div>
  )
}
