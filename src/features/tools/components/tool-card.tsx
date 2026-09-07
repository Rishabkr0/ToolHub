import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  colorClass: string
  bgClass: string
  onClick?: () => void
  href?: string
}

export function ToolCard({ title, description, icon: Icon, colorClass, bgClass, onClick, href }: ToolCardProps) {
  const cardContent = (
    <Card className="group h-full overflow-hidden hover:shadow-[8px_8px_0px_0px_#111111] hover:-translate-y-1 transition-all flex flex-col cursor-pointer" onClick={onClick}>
      <div className={`h-32 ${bgClass} border-b-[3px] border-on-background relative overflow-hidden flex items-center justify-center`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMxMTEiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] [background-size:20px_20px]"></div>
        <div className={`w-16 h-16 ${colorClass} rounded-xl border-[3px] border-on-background shadow-[4px_4px_0px_0px_#111111] flex items-center justify-center relative z-10 group-hover:rotate-12 transition-transform`}>
          <Icon className="w-8 h-8 text-on-primary" />
        </div>
      </div>
      <CardContent className="p-md flex flex-col flex-1 mt-4">
        <CardTitle className="mb-1">{title}</CardTitle>
        <CardDescription className="flex-1 mb-md">{description}</CardDescription>
        <Button variant="outline" className="w-full bg-surface-container hover:bg-surface-container-highest">
          Use Now
        </Button>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href} className="block h-full">{cardContent}</Link>
  }

  return cardContent
}
