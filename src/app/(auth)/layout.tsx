import * as React from "react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="font-display-lg text-[24px] text-on-background">ToolHub</Link>
      </div>
      {children}
    </div>
  )
}
