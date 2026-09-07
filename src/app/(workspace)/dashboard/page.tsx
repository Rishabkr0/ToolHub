"use client"

import { FileText, Image as ImageIcon, Database, FileArchive, ImagePlus, Type, Subtitles, Plus, HardDrive, Scissors } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { DashboardMetricCard } from "@/features/workspace/components/dashboard-metric-card"
import { RecentActivityList } from "@/features/workspace/components/recent-activity-list"

export default function DashboardPage() {
  const recentActivities = [
    {
      id: "1",
      action: "Compressed",
      target: "report.pdf",
      timeInfo: "10 mins ago • Saved 2.4MB",
      icon: FileText,
      iconBgClass: "bg-primary-container",
      iconColorClass: "text-on-primary-container",
    },
    {
      id: "2",
      action: "Converted",
      target: "logo.png",
      timeInfo: "2 hours ago • to WebP",
      icon: ImageIcon,
      iconBgClass: "bg-secondary-container",
      iconColorClass: "text-on-secondary-container",
    },
    {
      id: "3",
      action: "Cleaned",
      target: "data.json",
      timeInfo: "Yesterday • Validated",
      icon: Database,
      iconBgClass: "bg-[#ffe66d]",
      iconColorClass: "text-on-background",
    },
  ];

  return (
    <div className="flex flex-col w-full gap-md">
      <div className="grid grid-cols-12 gap-md items-start">
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-md">
          <section className="relative overflow-hidden bg-surface-container rounded-xl border-[3px] border-on-background shadow-[4px_4px_0px_#111111] p-xl transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#111111]">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container rounded-full mix-blend-multiply opacity-50 blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-secondary-container rounded-full mix-blend-multiply opacity-50 blur-2xl animate-[pulse_3s_ease-in-out_infinite_alternate]"></div>
            <div className="relative z-10">
              <h1 className="font-display-lg text-on-surface mb-xs tracking-tight">Welcome back, Alex!</h1>
              <p className="font-body-lg text-on-surface-variant max-w-lg">Ready to crush some tasks today? Your processing queue is empty and tools are primed.</p>
            </div>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-sm">
            <DashboardMetricCard 
              label="Tools Used"
              value="24"
              icon={FileText}
              bgClass="bg-primary-container"
              textClass="text-on-primary-container"
            />
            <DashboardMetricCard 
              label="Storage Saved"
              value="1.2"
              unit="GB"
              icon={HardDrive}
              bgClass="bg-secondary-container"
              textClass="text-on-secondary-container"
            />
            <DashboardMetricCard 
              label="Process Time"
              value="15"
              unit="m"
              icon={Type}
              bgClass="bg-tertiary-container"
              textClass="text-on-tertiary-container"
            />
          </section>
          
          <section className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl overflow-hidden flex flex-col">
            <div className="p-md border-b-[3px] border-on-background bg-surface-container flex justify-between items-center">
              <h2 className="font-headline-md text-on-surface">Pinned Tools</h2>
              <button onClick={() => toast.info("View All coming soon")} className="font-label-bold text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1">
                View All
              </button>
            </div>
            <div className="p-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md bg-[radial-gradient(#e5e2e1_1px,transparent_1px)] [background-size:16px_16px]">
              {/* This is mocked for now, but will eventually use ToolCards or PinnedToolCards */}
              <Link href="/tool/merge-pdf" className="group flex flex-col items-center text-center p-sm bg-surface border-[3px] border-on-background shadow-[4px_4px_0px_#111111] rounded-lg transition-all hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_#111111] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none">
                <div className="w-12 h-12 mb-xs bg-[#ff6b6b] border-[2px] border-on-background flex items-center justify-center rounded-md transform group-hover:rotate-6 transition-transform">
                  <FileText className="text-on-error w-5 h-5" />
                </div>
                <span className="font-headline-md text-on-surface text-[16px]">Merge PDF</span>
                <span className="font-label-sm text-on-surface-variant mt-1">Combine documents</span>
              </Link>
              
              <Link href="/tool/split-pdf" className="group flex flex-col items-center text-center p-sm bg-surface border-[3px] border-on-background shadow-[4px_4px_0px_#111111] rounded-lg transition-all hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_#111111] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none">
                <div className="w-12 h-12 mb-xs bg-[#4ecdc4] border-[2px] border-on-background flex items-center justify-center rounded-md transform group-hover:-rotate-6 transition-transform">
                  <Scissors className="text-on-surface w-5 h-5" />
                </div>
                <span className="font-headline-md text-on-surface text-[16px]">Split PDF</span>
                <span className="font-label-sm text-on-surface-variant mt-1">Extract pages</span>
              </Link>
              
              <button onClick={() => toast.info("Adding tools to dashboard coming soon")} className="group flex flex-col items-center text-center p-sm bg-surface border-[3px] border-on-background shadow-[4px_4px_0px_#111111] rounded-lg transition-all hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_#111111] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none">
                <div className="w-12 h-12 mb-xs bg-surface-container-high border-[2px] border-on-background border-dashed flex items-center justify-center rounded-md group-hover:bg-primary-container transition-colors">
                  <Plus className="text-on-surface-variant group-hover:text-on-primary-container w-5 h-5" />
                </div>
                <span className="font-headline-md text-on-surface text-[16px]">Add Tool</span>
                <span className="font-label-sm text-on-surface-variant mt-1">Pin from library</span>
              </button>
            </div>
          </section>
        </div>
        
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-md">
          <section className="bg-surface-container border-[3px] border-on-background shadow-[4px_4px_0px_#111111] p-md rounded-xl">
            <div className="flex justify-between items-end mb-sm">
              <h3 className="font-headline-md text-on-surface">Storage</h3>
              <span className="font-label-bold text-on-surface-variant">75% USED</span>
            </div>
            <div className="w-full h-4 bg-surface-container-lowest border-[2px] border-on-background rounded-full overflow-hidden mb-xs relative">
              <div className="absolute top-0 left-0 h-full w-[75%] bg-primary border-r-[2px] border-on-background"></div>
            </div>
            <div className="flex justify-between items-center mt-sm">
              <span className="font-body-sm text-on-surface-variant text-[14px]">3.75GB of 5.00GB</span>
              <button onClick={() => toast.success("Cache cleared!")} className="px-xs py-1 bg-surface-container-lowest border-[2px] border-on-background font-label-bold text-on-surface hover:bg-error-container hover:text-on-error-container transition-colors shadow-[2px_2px_0px_#111111] hover:translate-x-[-1px] hover:translate-y-[-1px]">
                CLEAR CACHE
              </button>
            </div>
          </section>
          
          <RecentActivityList items={recentActivities} />
        </div>
      </div>
    </div>
  )
}
