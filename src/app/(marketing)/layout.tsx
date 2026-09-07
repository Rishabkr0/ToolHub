import { MarketingHeader } from "@/components/layout/marketing-header"
import { Footer } from "@/components/layout/footer"
import dynamic from "next/dynamic"

const CommandPalette = dynamic(() => import("@/components/layout/command-palette").then(mod => mod.CommandPalette))

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <CommandPalette />
      <main className="flex-1 pt-20 bg-background">
        {children}
      </main>
      <Footer />
    </div>
  )
}
