import * as React from "react"
import { LucideIcon } from "lucide-react"

export interface ActivityItem {
  id: string
  action: string
  target: string
  timeInfo: string
  icon: LucideIcon
  iconBgClass: string
  iconColorClass: string
}

interface RecentActivityListProps {
  items: ActivityItem[]
}

export function RecentActivityList({ items }: RecentActivityListProps) {
  return (
    <section className="bg-surface-container-lowest border-[3px] border-on-background shadow-[4px_4px_0px_#111111] rounded-xl flex flex-col">
      <div className="p-sm border-b-[3px] border-on-background bg-surface-container">
        <h3 className="font-headline-md text-on-surface">Recent Activity</h3>
      </div>
      <div className="p-md relative flex flex-col gap-sm">
        <div className="absolute left-[31px] top-md bottom-md w-[3px] bg-on-background"></div>
        {items.map((item) => (
          <div key={item.id} className="relative flex gap-sm items-start">
            <div className={`w-8 h-8 rounded-full ${item.iconBgClass} border-[2px] border-on-background flex items-center justify-center shrink-0 z-10`}>
              <item.icon className={`w-4 h-4 ${item.iconColorClass}`} />
            </div>
            <div className="flex-1 bg-surface-container p-sm border-[2px] border-on-background rounded-md">
              <p className="font-body-md text-on-surface"><span className="font-bold">{item.action}</span> {item.target}</p>
              <span className="font-label-sm text-on-surface-variant block mt-1">{item.timeInfo}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
