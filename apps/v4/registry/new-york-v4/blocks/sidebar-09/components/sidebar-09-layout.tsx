"use client"

import * as React from "react"

import { AppSidebar } from "@/registry/new-york-v4/blocks/sidebar-09/components/app-sidebar"
import { CreateAgent } from "@/registry/new-york-v4/blocks/sidebar-09/components/create-agent"
import { ReviewResponseAgents } from "@/registry/new-york-v4/blocks/sidebar-09/components/review-response-agents"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar"

const SIDEBAR_WIDTHS: Record<string, string> = {
  "Reviews AI": "328px",
  default: "350px",
}

export function Sidebar09Layout() {
  const [activeModule, setActiveModule] = React.useState("Overview")
  const [activePath, setActivePath] = React.useState<string[]>(["Overview"])
  const [showCreateAgent, setShowCreateAgent] = React.useState(false)
  const [showWelcome, setShowWelcome] = React.useState(false)
  const prevModule = React.useRef<string>("Overview")
  const aiMessages = ["AI generating response...", "AI analysing review...", "AI personalising reply...", "AI matching brand voice...", "AI drafting message..."]
  const [aiMsgIdx, setAiMsgIdx] = React.useState(0)
  const [aiMsgVisible, setAiMsgVisible] = React.useState(true)

  React.useEffect(() => {
    if (!showWelcome) return
    const interval = setInterval(() => {
      setAiMsgVisible(false)
      setTimeout(() => {
        setAiMsgIdx((prev) => (prev + 1) % aiMessages.length)
        setAiMsgVisible(true)
      }, 300)
    }, 1800)
    return () => clearInterval(interval)
  }, [showWelcome])

  const sidebarWidth =
    SIDEBAR_WIDTHS[activeModule] ?? SIDEBAR_WIDTHS.default

  return (
    <SidebarProvider
      style={{ "--sidebar-width": sidebarWidth } as React.CSSProperties}
    >
      <AppSidebar
        onActiveChange={(title) => {
          if (title === "Reviews AI" && prevModule.current !== "Reviews AI") {
            setShowWelcome(true)
            setActivePath(["Reviews AI", "Agents", "Review response agents"])
          } else {
            setActivePath([title])
          }
          prevModule.current = title
          setActiveModule(title)
        }}
        onPathChange={setActivePath}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background/95 p-4 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {activePath.slice(0, -1).map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setShowCreateAgent(false)
                        setActivePath(activePath.slice(0, idx + 1))
                      }}
                    >
                      {crumb}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </React.Fragment>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {activePath[activePath.length - 1]}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col overflow-y-auto transition-opacity duration-200">
          {showCreateAgent ? (
            <CreateAgent onBack={() => { setShowCreateAgent(false); setActivePath(["Reviews AI", "Agents", "Review response agents"]) }} />
          ) : activePath[activePath.length - 1] === "Review response agents" ? (
            <ReviewResponseAgents onCreateAgent={() => { setShowCreateAgent(true); setActivePath(["Reviews AI", "Agents", "Review response agents", "New agent"]) }} />
          ) : (
            <div className="flex flex-1 flex-col gap-4 p-4">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-video h-12 w-full rounded-lg bg-muted/50"
                />
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
      {/* Reviews AI welcome overlay */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
          {/* UI preview area */}
          <div className="relative flex h-72 w-full items-center justify-center overflow-hidden bg-slate-50 px-8">
            {/* Dot grid bg */}
            <div className="pointer-events-none absolute inset-0 opacity-75" style={{ backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            {/* Review card */}
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-100">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="size-8 animate-pulse rounded-full bg-slate-200" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-2.5 w-20 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-2 w-14 animate-pulse rounded-full bg-slate-100" />
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[0,1,2,3,4].map((i) => (
                    <svg key={i} width="11" height="11" viewBox="0 0 24 24" className="animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
                      <path fill="#f59e0b" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <div className="mb-4 space-y-1.5">
                <div className="h-2 w-full animate-pulse rounded-full bg-slate-100" />
                <div className="h-2 w-4/5 animate-pulse rounded-full bg-slate-100" style={{ animationDelay: "100ms" }} />
                <div className="h-2 w-3/5 animate-pulse rounded-full bg-slate-100" style={{ animationDelay: "200ms" }} />
              </div>
              <div className="rounded-xl bg-violet-50 p-3 ring-1 ring-violet-100">
                <div className="mb-2 flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" className="shrink-0">
                    <defs>
                      <linearGradient id="modal-ai-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#modal-ai-sparkle)" d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  </svg>
                  <span
                    className="text-xs font-semibold text-violet-700 transition-opacity duration-300"
                    style={{ opacity: aiMsgVisible ? 1 : 0 }}
                  >
                    {aiMessages[aiMsgIdx]}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    {[0,1,2].map((i) => (
                      <span key={i} className="size-1.5 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full animate-pulse rounded-full bg-violet-100" />
                  <div className="h-2 w-3/4 animate-pulse rounded-full bg-violet-100" style={{ animationDelay: "150ms" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1 p-6">
            <DialogTitle className="text-lg font-bold text-foreground">
              Meet Your New AI Agents
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Automate repetitive work, respond faster, and get more done with intelligent AI Agents built directly into your workflow.
            </DialogDescription>
            <button
              className="mt-6 w-full overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-200"
              style={{ background: "linear-gradient(135deg, #be185d 0%, #7c3aed 50%, #4c1d95 100%)" }}
              onClick={() => setShowWelcome(false)}
            >
              Explore AI Agents
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
