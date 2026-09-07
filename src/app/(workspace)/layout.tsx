import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Sidebar } from "@/components/layout/sidebar"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"

const CommandPalette = dynamic(() => import("@/components/layout/command-palette").then(mod => mod.CommandPalette))

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <CommandPalette />
      <Sidebar />
      <div className="pl-64 pt-16">
        <main className="p-lg min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
