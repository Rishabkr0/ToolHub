import * as React from "react"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavItemProps {
  href: string
  label: string
  icon: LucideIcon
  isActive?: boolean
  className?: string
}

export function NavItem({ href, label, icon: Icon, isActive, className }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-sm px-md py-sm transition-all rounded-lg font-body-md border-[3px]",
        isActive 
          ? "bg-primary-container border-on-background shadow-[4px_4px_0px_0px_#111111] translate-x-[-2px] translate-y-[-2px] text-on-primary-container font-bold"
          : "border-transparent text-on-surface-variant hover:border-on-background hover:bg-surface-container-high hover:text-on-surface hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[4px_4px_0px_0px_#111111]",
        className
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  )
}
