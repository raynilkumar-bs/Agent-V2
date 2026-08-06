"use client"

import * as React from "react"
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Code2,
  FileText,
  Flag,
  GraduationCap,
  Heart,
  LifeBuoy,
  Loader,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Palette,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  Target,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/registry/new-york-v4/ui/sheet"
import { useSidebar } from "@/registry/new-york-v4/ui/sidebar"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"

const stats = [
  { value: "835", delta: "+1.3%", today: "+12 today", trend: "up", label: "Reviews responded" },
  { value: "92%", delta: "+1.3%", today: "+2% today", trend: "up", label: "Response rate" },
  { value: "20m", delta: "-0.5%", today: "-1m today", trend: "down", label: "Average response time" },
  { value: "6h 20m", delta: "+1.3%", today: "+30m today", trend: "up", label: "Time saved" },
]

const agents = [
  { id: "1", name: "Reply using templates", status: "Running", reviews: 102, reviewTrend: "up", rate: "15%", rateTrend: "up", avgTime: "20m", avgTrend: "down", saved: "4h 20m", locations: 500 },
  { id: "2", name: "Replying autonomously", status: "Running", reviews: 98, reviewTrend: "up", rate: "9%", rateTrend: "down", avgTime: "5m", avgTrend: "up", saved: "1h 10m", locations: 250 },
  { id: "3", name: "Replying after human approval", status: "Paused", reviews: 53, reviewTrend: "down", rate: "9%", rateTrend: "down", avgTime: "10m", avgTrend: "down", saved: "45m", locations: 200 },
  { id: "4", name: "Suggesting replies in dashboard", status: "Draft", reviews: 35, reviewTrend: "down", rate: "8%", rateTrend: "down", avgTime: "2m", avgTrend: "up", saved: "3h 20m", locations: 100 },
]

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  Running: { label: "Running", icon: <CheckCircle2 className="size-3.5 text-green-600 dark:text-green-400" />, className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30 dark:hover:bg-green-500/15" },
  Paused:  { label: "Paused",  icon: <Loader className="size-3.5 text-yellow-600 dark:text-yellow-400" />,     className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-500/30 dark:hover:bg-yellow-500/15" },
  Draft:   { label: "Draft",   icon: null,                                                 className: "bg-muted text-muted-foreground border-border hover:bg-muted" },
}

const columns = [
  { key: "name",     label: "Agent name",        first: true },
  { key: "status",   label: "Status" },
  { key: "reviews",  label: "Reviews responded" },
  { key: "rate",     label: "Response rate" },
  { key: "avgTime",  label: "Avg response time" },
  { key: "saved",    label: "Time saved" },
  { key: "locations",label: "Locations" },
]

function TrendIcon({ trend }: { trend: string }) {
  return trend === "up"
    ? <TrendingUp className="size-3 text-green-500" />
    : <TrendingDown className="size-3 text-red-400" />
}

export function ReviewResponseAgents({ onCreateAgent }: { onCreateAgent?: () => void }) {
  const [whatsNewOpen, setWhatsNewOpen] = React.useState(false)
  const { setOpen } = useSidebar()
  const [sortCol, setSortCol] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortCol(key)
      setSortDir("asc")
    }
  }

  const renderSortIcon = (key: string) => {
    if (sortCol !== key) return <ChevronDown className="size-3.5 text-muted-foreground" />
    return sortDir === "asc"
      ? <ChevronUp className="size-3.5 text-primary" />
      : <ChevronDown className="size-3.5 text-primary" />
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Review response agents</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="h-8 w-40 pl-8 text-sm focus-within:w-56 transition-all duration-200"
            />
          </div>
          <button
            className="group relative overflow-hidden rounded-xl px-5 py-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-200"
            style={{ background: "linear-gradient(135deg, #be185d 0%, #7c3aed 50%, #4c1d95 100%)" }}
            onClick={() => {
              setOpen(false)
              onCreateAgent?.()
            }}
          >
            <span className="relative flex items-center gap-2">
              <Sparkle className="size-4 text-white" />
              <span className="text-sm font-semibold text-white">Create Agent</span>
            </span>
          </button>
          <Button variant="ghost" size="icon" className="size-8">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="agents" className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="mt-0 flex flex-col gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-card p-5 transition-colors duration-200 hover:bg-muted/50"
              >
                {/* Content */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold ${stat.trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"}`}>
                      {stat.trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {stat.delta}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.today}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className={col.first ? "pl-6 pr-4 py-3" : "px-4 py-3"}
                    >
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1 font-medium text-foreground"
                      >
                        {col.label}
                        {renderSortIcon(col.key)}
                      </button>
                    </TableHead>
                  ))}
                  <TableHead className="w-12 px-4 py-3" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => {
                  const status = STATUS_CONFIG[agent.status]
                  return (
                    <TableRow
                      key={agent.id}
                      className="group cursor-pointer transition-all duration-150 hover:-translate-y-px hover:shadow-sm active:scale-[0.998]"
                    >
                      <TableCell className="pl-6 pr-4 py-4 font-medium">{agent.name}</TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant="outline" className={`flex w-fit items-center gap-1.5 rounded-full text-xs font-normal ${status.className}`}>
                          {status.icon}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          {agent.reviews} <TrendIcon trend={agent.reviewTrend} />
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          {agent.rate} <TrendIcon trend={agent.rateTrend} />
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          {agent.avgTime} <TrendIcon trend={agent.avgTrend} />
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">{agent.saved}</TableCell>
                      <TableCell className="px-4 py-4">{agent.locations}</TableCell>
                      <TableCell className="w-12 px-4 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit agent</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="library" className="mt-0">
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                icon: FileText,
                tile: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
                title: "Professional Response",
                desc: "Craft formal, polished replies that maintain your brand's professional tone across all customer touchpoints.",
              },
              {
                icon: Heart,
                tile: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
                title: "Friendly Thank You",
                desc: "Warm, genuine acknowledgements that make customers feel valued after sharing positive feedback.",
              },
              {
                icon: LifeBuoy,
                tile: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
                title: "Service Recovery",
                desc: "Turn negative reviews into opportunities by responding with care and commitment to improvement.",
              },
              {
                icon: Palette,
                tile: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
                title: "Brand Voice Match",
                desc: "AI-tuned responses that precisely mirror your brand's unique tone and personality across every interaction.",
              },
              {
                icon: TriangleAlert,
                tile: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
                title: "Issue Acknowledgement",
                desc: "Empathetic responses that acknowledge concerns and reassure customers their experience truly matters.",
              },
              {
                icon: ThumbsUp,
                tile: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
                title: "Positive Reinforcement",
                desc: "Amplify great reviews by crafting responses that encourage loyalty and inspire others to share experiences.",
              },
              {
                icon: Send,
                tile: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
                title: "Smart Follow-up",
                desc: "Timely, personalised follow-up messages that re-engage customers and build lasting relationships after their review.",
              },
              {
                icon: Flag,
                tile: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
                title: "Escalation Handler",
                desc: "Professionally escalate critical reviews to management while keeping customers informed and reassured throughout.",
              },
            ].map((tpl, i) => (
              <div key={i} className="group relative flex cursor-pointer flex-col rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:shadow-md">
                {/* AI gradient stroke — fades in on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    padding: "1px",
                    background: "linear-gradient(135deg, #7c3aed, #ec4899, #3b82f6)",
                    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                {/* Icon + title */}
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tpl.tile}`}>
                    <tpl.icon className="size-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{tpl.title}</p>
                </div>
                {/* Description */}
                <p className="mt-3 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">{tpl.desc}</p>
                <Button variant="outline" size="sm" className="mt-4 w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* What's New Sheet */}
      <Sheet open={whatsNewOpen} onOpenChange={setWhatsNewOpen}>
        <SheetContent side="right" className="flex w-[520px] flex-col gap-0 overflow-y-auto p-0 sm:max-w-[520px]">
          <SheetHeader className="border-b px-7 py-5">
            <SheetTitle className="text-base font-semibold">What's New</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-7 px-7 py-6">
            {/* Featured release card */}
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
              {/* Coloured top strip */}
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899, #3b82f6)" }} />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                  >
                    <span className="size-1.5 rounded-full bg-white/80 animate-pulse" />
                    V2.4 Released
                  </span>
                  <span className="text-xs text-muted-foreground">Aug 2026</span>
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" className="animate-pulse">
                    <defs>
                      <linearGradient id="card-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#card-sparkle)" d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-foreground">AI Response Agents 2.0</h3>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Smarter, faster, and more personalised — built to handle every review at scale.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Enhanced brand voice matching across all platforms",
                    "3× faster response generation with new AI model",
                    "Multi-language support for 40+ languages",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground/40" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Help Videos */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Help Videos</p>
                <button className="text-xs font-medium text-primary hover:underline">See all</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: "Getting Started with AI Agents", duration: "3:24", color: "from-violet-100 to-blue-100 dark:from-violet-500/20 dark:to-blue-500/20" },
                  { title: "Setting Up Templates", duration: "5:12", color: "from-pink-100 to-violet-100 dark:from-pink-500/20 dark:to-violet-500/20" },
                ].map((v, i) => (
                  <div key={i} className="group cursor-pointer overflow-hidden rounded-2xl border border-border/60 transition-all duration-200 hover:shadow-md">
                    <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${v.color}`}>
                      <div className="flex size-11 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 group-hover:scale-110">
                        <svg className="ml-0.5 size-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">{v.duration}</span>
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-xs font-medium leading-relaxed text-foreground">{v.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Articles */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Articles & Guides</p>
                <button className="text-xs font-medium text-primary hover:underline">See all</button>
              </div>
              <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60">
                {[
                  { title: "How AI agents respond to reviews", read: "5 min read", icon: <FileText className="size-4 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-50 dark:bg-blue-500/15" },
                  { title: "Setting up brand voice matching", read: "3 min read", icon: <Palette className="size-4 text-violet-600 dark:text-violet-400" />, bg: "bg-violet-50 dark:bg-violet-500/15" },
                  { title: "Best practices for service recovery", read: "7 min read", icon: <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />, bg: "bg-emerald-50 dark:bg-emerald-500/15" },
                ].map((a, i) => (
                  <button key={i} className="flex items-center gap-4 border-b border-border/60 px-4 py-4 text-left transition-colors last:border-0 hover:bg-muted/40">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${a.bg}`}>{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{a.read}</p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            {/* Supporting Materials */}
            <div>
              <p className="mb-4 text-sm font-semibold text-foreground">Supporting Materials</p>
              <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60">
                {[
                  { icon: <BookOpen className="size-4 text-indigo-600 dark:text-indigo-400" />, bg: "bg-indigo-50 dark:bg-indigo-500/15", label: "Documentation", desc: "Full API & component docs" },
                  { icon: <GraduationCap className="size-4 text-violet-600 dark:text-violet-400" />, bg: "bg-violet-50 dark:bg-violet-500/15", label: "Setup Guide", desc: "Step-by-step onboarding" },
                  { icon: <MessageCircle className="size-4 text-pink-600 dark:text-pink-400" />, bg: "bg-pink-50 dark:bg-pink-500/15", label: "FAQ", desc: "Common questions answered" },
                  { icon: <Code2 className="size-4 text-orange-600 dark:text-orange-400" />, bg: "bg-orange-50 dark:bg-orange-500/15", label: "API Reference", desc: "Developer documentation" },
                ].map((m) => (
                  <button key={m.label} className="flex items-center gap-4 border-b border-border/60 px-4 py-4 text-left transition-colors last:border-0 hover:bg-muted/40">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${m.bg}`}>{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{m.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
