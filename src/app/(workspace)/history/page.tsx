import * as React from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { Clock } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display-lg text-[32px] text-on-background mb-8">Activity History</h1>
      <EmptyState 
        icon={Clock}
        title="No recent history"
        description="Tools you use will appear here for quick access later."
      />
    </div>
  )
}
