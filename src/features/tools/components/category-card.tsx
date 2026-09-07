import { LucideIcon } from "lucide-react"
import Link from "next/link"

export interface CategoryCardProps {
  title: string
  count: number
  icon: LucideIcon
  containerBg: string
  iconBg: string
  textColor: string
  iconColor: string
  onClick?: () => void
  href?: string
}

export function CategoryCard({ title, count, icon: Icon, containerBg, iconBg, textColor, iconColor, onClick, href }: CategoryCardProps) {
  const inner = (
    <div 
      className={`group flex flex-col items-center justify-center p-md ${containerBg} rounded-2xl border-[3px] border-on-background shadow-[4px_4px_0px_0px_#111111] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_#111111] transition-all cursor-pointer h-full`}
      onClick={onClick}
    >
      <div className={`w-16 h-16 ${iconBg} rounded-xl border-[3px] border-on-background flex items-center justify-center mb-md group-hover:scale-110 transition-transform`}>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h3 className="font-headline-md text-headline-md text-on-background">{title}</h3>
      <span className={`font-label-sm text-label-sm mt-1 ${textColor}`}>{count} Tools</span>
    </div>
  )

  if (href) {
    return <Link href={href} className="block h-full">{inner}</Link>
  }

  return inner
}
