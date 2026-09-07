import * as React from "react"
import { LucideIcon } from "lucide-react"

export interface DashboardMetricCardProps {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  bgClass: string
  textClass: string
}

export function DashboardMetricCard({ label, value, unit, icon: Icon, bgClass, textClass }: DashboardMetricCardProps) {
  return (
    <div className={`${bgClass} border-[3px] border-on-background shadow-[4px_4px_0px_0px_#111111] p-md rounded-lg flex flex-col justify-between transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]`}>
      <div className="flex justify-between items-start mb-lg">
        <span className={`font-label-bold ${textClass} uppercase tracking-wider`}>{label}</span>
        <div className="w-8 h-8 bg-surface-container-lowest border-[2px] border-on-background flex items-center justify-center rounded-full shadow-[2px_2px_0px_0px_#111111]">
          <Icon className="w-4 h-4 text-on-surface" />
        </div>
      </div>
      <div className={`font-display-lg ${textClass}`}>
        {value}
        {unit && <span className="font-headline-md ml-1">{unit}</span>}
      </div>
    </div>
  )
}
