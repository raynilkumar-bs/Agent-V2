"use client"

import * as React from "react"
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  getSmoothStepPath,
  useReactFlow,
  useUpdateNodeInternals,
  useViewport,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  ArrowLeft,
  ArrowUp,
  CircleDot,
  ClipboardList,
  Columns2,
  GitBranch,
  GripVertical,
  History,
  Mail,
  Maximize,
  MessageSquare,
  Minus,
  Play,
  Plus,
  Redo2,
  Repeat,
  Rows2,
  Search,
  Settings2,
  Sparkle,
  Sparkles,
  Star,
  Timer,
  Trash2,
  Undo2,
  Users,
  WandSparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

// ── Node library ──────────────────────────────────────────────────────────────
type NodeType = "trigger" | "task" | "branch" | "delay" | "loop"
type LibItem = { id: string; label: string; description?: string }

// Custom "task list" glyph: a rounded square with bullet-dot + line rows.
function TaskListIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8" cy="9" r="1.35" fill="currentColor" stroke="none" />
      <circle cx="8" cy="15" r="1.35" fill="currentColor" stroke="none" />
      <path d="M12 9h5" />
      <path d="M12 15h5" />
    </svg>
  )
}

// Icon/colour per node category — drives how a placed node renders.
const CATEGORY_META: Record<
  NodeType,
  { label: string; icon: React.ComponentType<{ className?: string }>; accent: string; chip: string }
> = {
  trigger: { label: "Trigger", icon: Zap, accent: "text-amber-700 dark:text-amber-300", chip: "bg-amber-100 dark:bg-amber-500/20" },
  task: { label: "Task", icon: TaskListIcon, accent: "text-green-700 dark:text-green-300", chip: "bg-green-100 dark:bg-green-500/20" },
  branch: { label: "Branch", icon: GitBranch, accent: "text-violet-700 dark:text-violet-300", chip: "bg-violet-100 dark:bg-violet-500/20" },
  delay: { label: "Delay", icon: Timer, accent: "text-cyan-700 dark:text-cyan-300", chip: "bg-cyan-100 dark:bg-cyan-500/20" },
  loop: { label: "Loop", icon: Repeat, accent: "text-pink-700 dark:text-pink-300", chip: "bg-pink-100 dark:bg-pink-500/20" },
}

// Palette rail groups. A group can span multiple node categories (Controls =
// Branch + Delay + Loop); each section carries the node category its items create.
type PaletteSection = { label: string; icon: React.ComponentType<{ className?: string }>; nodeType: NodeType; items: LibItem[] }
type PaletteGroup = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  chip: string
  ring: string
  sections: PaletteSection[]
}

const PALETTE_GROUPS: PaletteGroup[] = [
  {
    id: "trigger", label: "Trigger", icon: Zap, accent: "text-amber-500 dark:text-amber-400", chip: "bg-amber-50 dark:bg-amber-500/15", ring: "ring-amber-300",
    sections: [
      { label: "Reviews", icon: Star, nodeType: "trigger", items: [
        { id: "review.new", label: "When a new review is received", description: "Runs the workflow the moment a customer posts a brand-new review on any connected platform." },
        { id: "review.updated", label: "When a review is updated", description: "Fires whenever an existing review is edited so you can re-evaluate and respond again." },
        { id: "review.responded", label: "When a review is responded", description: "Triggers after a reply is posted to a review, letting you follow up or log the outcome." },
        { id: "review.new_or_updated", label: "When a new review is received or updated", description: "Starts on any new review or an edit to an existing one, covering both cases at once." },
      ] },
      { label: "Messaging", icon: MessageSquare, nodeType: "trigger", items: [
        { id: "msg.new", label: "New message", description: "Kicks off when an inbound message arrives from any channel — SMS, webchat, or social." },
        { id: "msg.reply", label: "Message replied", description: "Fires when a customer replies within an existing thread so you can continue the conversation." },
      ] },
      { label: "Surveys", icon: ClipboardList, nodeType: "trigger", items: [
        { id: "survey.done", label: "Survey completed", description: "Runs as soon as a respondent finishes a survey, passing their answers into the workflow." },
      ] },
    ],
  },
  {
    id: "task", label: "Task", icon: TaskListIcon, accent: "text-green-500 dark:text-green-400", chip: "bg-green-50 dark:bg-green-500/15", ring: "ring-green-300",
    sections: [
      { label: "Review", icon: Star, nodeType: "task", items: [
        { id: "task.triage", label: "Triage review", description: "Classifies each incoming review by sentiment and topic, then routes it down the right path." },
        { id: "task.extract", label: "Review details extraction", description: "Pulls key fields — rating, product, and location — from the review into structured data." },
        { id: "task.responder", label: "Review responder", description: "Decides how to respond based on rating and context, choosing the tone and next action." },
        { id: "task.response_gen", label: "Response generation", description: "Drafts the reply text in your brand voice, tailored to the review's content and rating." },
        { id: "task.assembly", label: "Message assembly", description: "Assembles the final message from the generated parts, ready to send or route for approval." },
      ] },
      { label: "AI Reply", icon: Sparkles, nodeType: "task", items: [
        { id: "ai.generate", label: "Generate reply", description: "Drafts an on-brand response to the review, matching your tone, style, and guidelines." },
        { id: "ai.summarize", label: "Summarize", description: "Condenses a long review or message thread into a short, skimmable summary." },
        { id: "ai.translate", label: "Translate", description: "Translates the review or reply into a target language while preserving the original meaning." },
      ] },
      { label: "Email", icon: Mail, nodeType: "task", items: [
        { id: "email.send", label: "Send email", description: "Sends a templated email to the customer using data collected earlier in the workflow." },
        { id: "email.sequence", label: "Add to sequence", description: "Enrolls the contact into a drip sequence so follow-up emails go out automatically." },
      ] },
      { label: "CRM", icon: Users, nodeType: "task", items: [
        { id: "crm.contact", label: "Create contact", description: "Creates a new contact record in your CRM from the reviewer's details captured here." },
        { id: "crm.update", label: "Update field", description: "Sets or updates a field on an existing CRM record to keep customer data in sync." },
      ] },
    ],
  },
  {
    id: "controls", label: "Controls", icon: Workflow, accent: "text-slate-500", chip: "bg-slate-100", ring: "ring-slate-300",
    sections: [
      { label: "Branch", icon: GitBranch, nodeType: "branch", items: [
        { id: "branch.if", label: "If / else", description: "Splits the workflow into two paths based on whether a single condition is true or false." },
        { id: "branch.switch", label: "Switch", description: "Routes the workflow into multiple paths by matching a value against several cases." },
        { id: "branch.rating", label: "By rating", description: "Splits the flow by star rating so high and low scores follow different responses." },
      ] },
      { label: "Delay", icon: Timer, nodeType: "delay", items: [
        { id: "delay.for", label: "Wait for…", description: "Pauses the workflow for a fixed duration before continuing on to the next step." },
        { id: "delay.until", label: "Wait until…", description: "Holds the workflow until a specific time or condition is met, then resumes automatically." },
      ] },
      { label: "Loop", icon: Repeat, nodeType: "loop", items: [
        { id: "loop.each", label: "For each", description: "Repeats the enclosed steps once for every item in a list, processing them one by one." },
        { id: "loop.while", label: "While", description: "Keeps repeating the enclosed steps for as long as a condition continues to hold true." },
      ] },
    ],
  },
]

// Data carried by a placed node — the item's identity is the source of truth.
type NodeData = { category: NodeType; label: string; sub: string; itemId?: string }

const DND_MIME = "application/reactflow"

// Agent publish/run status.
type AgentStatus = "draft" | "running" | "paused"
const STATUS_META: Record<AgentStatus, { label: string; dot: string }> = {
  draft: { label: "Draft", dot: "bg-amber-400" },
  running: { label: "Running", dot: "bg-emerald-500" },
  paused: { label: "Paused", dot: "bg-zinc-400" },
}

// ── React Flow custom nodes ───────────────────────────────────────────────────
const OrientationCtx = React.createContext<"vertical" | "horizontal">("vertical")
// True while a palette item is being dragged — turns wire "+" into drop targets.
const DragCtx = React.createContext<boolean>(false)

// Per-node actions (settings / delete) surfaced on the hover rail.
type NodeActions = { onSettings: (id: string) => void; onDelete: (id: string) => void }
const ActionsCtx = React.createContext<NodeActions | null>(null)

function useHandlePositions() {
  const orient = React.useContext(OrientationCtx)
  return orient === "vertical"
    ? { target: Position.Top, source: Position.Bottom }
    : { target: Position.Left, source: Position.Right }
}

// Shared selected-node treatment — blue stroke + soft light shadow.
const NODE_SELECTED =
  "border-2 border-blue-600 ring-2 ring-blue-400/40 shadow-[0_4px_16px_rgba(15,23,42,0.08)] dark:border-blue-400 dark:ring-blue-400/30"
const NODE_IDLE = "border-2 border-border/60 shadow-sm hover:shadow-md"

// Node shell: icon + category label + name in the header, description below,
// and a hover action rail. (No floating pill.)
function NodeFrame({
  id,
  category,
  categoryClass,
  title,
  description,
  icon,
  iconClass,
  selected,
  deletable,
  showTargetHandle = true,
  onClick,
}: {
  id: string
  category: string
  categoryClass?: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  iconClass?: string
  selected?: boolean
  deletable?: boolean
  showTargetHandle?: boolean
  onClick?: () => void
}) {
  const handle = useHandlePositions()
  const actions = React.useContext(ActionsCtx)
  const [hovered, setHovered] = React.useState(false)
  const active = hovered || selected
  const StepIcon = icon
  return (
    <div
      className="relative w-96"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showTargetHandle && <Handle type="target" position={handle.target} isConnectable={false} />}

      {/* Hover / selected action rail — sits just outside the right edge. */}
      <div
        className={`absolute left-full top-2 z-10 ml-2 flex flex-col gap-1.5 transition-all duration-200 ease-out ${
          active ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-1 opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Node settings"
          onClick={(e) => { e.stopPropagation(); actions?.onSettings(id) }}
          className="flex size-7 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground shadow-sm transition-colors hover:border-blue-400 hover:text-blue-600 active:scale-90 dark:hover:text-blue-400"
        >
          <Settings2 className="size-3.5" />
        </button>
        {deletable && (
          <button
            type="button"
            aria-label="Delete node"
            onClick={(e) => { e.stopPropagation(); actions?.onDelete(id) }}
            className="flex size-7 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground shadow-sm transition-colors hover:border-red-400 hover:text-red-600 active:scale-90 dark:hover:text-red-400"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>

      {/* Card */}
      <div
        onClick={onClick}
        className={`rounded-2xl border bg-card p-4 transition-all duration-300 ease-out ${
          onClick ? "cursor-pointer" : ""
        } ${selected ? NODE_SELECTED : NODE_IDLE}`}
      >
        {/* Header — icon + (category / name) */}
        <div className="flex items-center gap-3">
          {StepIcon && (
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
              <StepIcon className="size-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className={`text-xs font-semibold leading-tight ${categoryClass ?? "text-muted-foreground"}`}>{category}</p>
            <p className="mt-0.5 truncate text-[15px] font-semibold leading-tight text-foreground">{title}</p>
          </div>
        </div>
        {/* Description — full width, two-line reserve for a consistent height. */}
        {description && (
          <p className="mt-3 line-clamp-2 min-h-[3.25em] text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        )}
        <Handle type="source" position={handle.source} isConnectable={false} />
      </div>
    </div>
  )
}

// The step's module icon (Reviews → Star, AI Reply → Sparkles, …), by itemId.
function iconForItem(itemId?: string): React.ComponentType<{ className?: string }> | undefined {
  if (!itemId) return undefined
  return ALL_SECTIONS.find((s) => s.items.some((it) => it.id === itemId))?.icon
}

function WorkflowRFNode({ id, data, selected }: NodeProps) {
  const d = data as NodeData
  const meta = CATEGORY_META[d.category]
  return (
    <NodeFrame
      id={id}
      category={meta.label}
      categoryClass={meta.accent}
      title={d.label}
      description={d.sub}
      icon={iconForItem(d.itemId) ?? meta.icon}
      iconClass={`${meta.chip} ${meta.accent}`}
      selected={selected}
      deletable
    />
  )
}

function EndRFNode({ selected }: NodeProps) {
  const handle = useHandlePositions()
  return (
    <div
      className={`flex items-center gap-2 rounded-full border bg-card px-4 py-2 transition-all duration-300 ease-out ${
        selected ? NODE_SELECTED : NODE_IDLE
      }`}
    >
      <Handle type="target" position={handle.target} isConnectable={false} />
      <CircleDot className="size-4 text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground">End</span>
    </div>
  )
}

// Agent identity card — sits at the top of the flow; click opens the info panel.
function AgentRFNode({ id, data, selected }: NodeProps) {
  const d = data as { title: string; locations: number }
  const actions = React.useContext(ActionsCtx)
  return (
    <NodeFrame
      id={id}
      category="Start"
      categoryClass="text-violet-700 dark:text-violet-300"
      title={d.title}
      description="Automatically drafts and posts on-brand replies to every incoming customer review across your locations."
      icon={Sparkle}
      iconClass="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
      selected={selected}
      showTargetHandle={false}
      onClick={() => actions?.onSettings(id)}
    />
  )
}

const nodeTypes = { workflow: WorkflowRFNode, end: EndRFNode, agent: AgentRFNode }

// ── AI Copilot chat panel ─────────────────────────────────────────────────────
type ChatMsg = { id: number; role: "ai" | "user"; text: string }

const AI_SUGGESTIONS = [
  "Detect and escalate 1-star reviews",
  "Translate replies to Spanish",
  "Summarize what this agent does",
  "Add a delay before auto-posting",
]

function cannedReply(prompt: string): string {
  const p = prompt.toLowerCase()
  if (p.includes("translate"))
    return "Done — I added a Translate step after the reply is generated so responses go out in the customer's language. Want me to set the target languages?"
  if (p.includes("negative") || p.includes("1-star") || p.includes("escalat"))
    return "Got it. I added a Branch that routes 1–2★ reviews to an escalation path and notifies a manager. You can fine-tune the threshold in the branch settings."
  if (p.includes("summar"))
    return "This agent watches for new reviews, drafts an on-brand reply, and posts it automatically across all 500 locations — running on every new or updated review."
  if (p.includes("delay") || p.includes("wait"))
    return "I inserted a Delay step before the auto-post so replies wait a short window — giving your team a chance to review. How long should it wait?"
  return "Here's my plan: I'll add that step and wire it into the flow. You can review and adjust anything directly on the canvas."
}

function AiBubble({ text }: { text: string }) {
  return (
    <div className="flex gap-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-pink-500">
        <Sparkle className="size-3.5 text-white" fill="currentColor" strokeWidth={1.5} />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted/70 px-3.5 py-2.5 text-sm leading-relaxed text-foreground">{text}</div>
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-500 to-indigo-500 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm">{text}</div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex gap-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-pink-500">
        <Sparkle className="size-3.5 text-white" fill="currentColor" strokeWidth={1.5} />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted/70 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  )
}

function AiCopilot({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = React.useState<ChatMsg[]>([])
  const [input, setInput] = React.useState("")
  const [thinking, setThinking] = React.useState(false)
  const idRef = React.useRef(0)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, thinking])
  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text || thinking) return
    setInput("")
    setMessages((m) => [...m, { id: idRef.current++, role: "user", text }])
    setThinking(true)
    timer.current = setTimeout(() => {
      setThinking(false)
      setMessages((m) => [...m, { id: idRef.current++, role: "ai", text: cannedReply(text) }])
    }, 1100)
  }

  return (
    <div
      className={`absolute bottom-6 right-6 top-6 z-20 flex w-[400px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_24px_60px_-24px_rgba(124,58,237,0.5)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-[calc(100%+2.5rem)] opacity-0"
      }`}
    >
      {/* Gradient header */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 text-white"
        style={{ background: "linear-gradient(120deg, #7c3aed 0%, #6366f1 55%, #3b82f6 100%)" }}
      >
        <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Sparkle className="size-[18px] text-white" fill="currentColor" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">AI Builder</p>
          <p className="text-[11px] text-white/80">Describe changes — I'll build them</p>
        </div>
        <button
          type="button"
          aria-label="Close AI builder"
          onClick={onClose}
          className="rounded-md p-1 text-white/80 transition-colors hover:bg-white/15 active:scale-90"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-violet-50/50 to-transparent p-4 dark:from-violet-500/[0.05]">
        {messages.length === 0 && !thinking ? (
          <div className="flex flex-col items-center gap-4 px-2 pt-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30">
              <Sparkle className="size-7 text-white" fill="currentColor" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Build with AI</p>
              <p className="mt-1 text-sm text-muted-foreground">Tell me what your agent should do and I'll add the steps for you.</p>
            </div>
            <div className="mt-1 flex w-full flex-col gap-2">
              {AI_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="group flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-left text-sm text-foreground shadow-xs transition-all hover:border-violet-300 hover:bg-violet-50/60 dark:hover:bg-violet-500/10"
                >
                  <Sparkles className="size-3.5 shrink-0 text-violet-500" />
                  <span className="flex-1">{s}</span>
                  <ArrowUp className="size-3.5 rotate-45 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (m.role === "ai" ? <AiBubble key={m.id} text={m.text} /> : <UserBubble key={m.id} text={m.text} />))}
            {thinking && <TypingBubble />}
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border/60 p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-background py-1 pl-3 pr-1.5 transition-colors focus-within:border-violet-300">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            rows={1}
            placeholder="Ask AI to build or change something…"
            className="max-h-28 min-h-[28px] flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            aria-label="Send"
            onClick={() => send(input)}
            disabled={!input.trim() || thinking}
            className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── "+" insert edge — hover-expanding "Add action" + tabbed picker ────────────
type InsertFn = (source: string, target: string, data: NodeData) => void

type ActionTab = "trigger" | "task" | "actions"
const ACTION_TABS: {
  id: ActionTab
  label: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  match: (t: NodeType) => boolean
}[] = [
  { id: "trigger", label: "Trigger", icon: Zap, accent: "text-amber-500 dark:text-amber-400", match: (t) => t === "trigger" },
  { id: "task", label: "Task", icon: TaskListIcon, accent: "text-green-500 dark:text-green-400", match: (t) => t === "task" },
  { id: "actions", label: "Actions", icon: Workflow, accent: "text-slate-500 dark:text-slate-400", match: (t) => t === "branch" || t === "delay" || t === "loop" },
]
const ALL_SECTIONS = PALETTE_GROUPS.flatMap((g) => g.sections)

function AddActionPopover({ onPick }: { onPick: (data: NodeData) => void }) {
  const [open, setOpen] = React.useState(false)
  const [tab, setTab] = React.useState<ActionTab>("trigger")
  const [query, setQuery] = React.useState("")
  const q = query.trim().toLowerCase()
  const activeTab = ACTION_TABS.find((t) => t.id === tab) ?? ACTION_TABS[0]
  const sections = ALL_SECTIONS.filter((s) => activeTab.match(s.nodeType))
  const anyMatch = sections.some((s) => s.items.some((it) => it.label.toLowerCase().includes(q)))

  const reset = () => { setQuery(""); setTab("trigger") }
  const pick = (sec: PaletteSection, it: LibItem) => {
    onPick({ category: sec.nodeType, itemId: it.id, label: it.label, sub: it.description ?? "" })
    setOpen(false)
    reset()
  }

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset() }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Add action"
          className={`group/add nodrag nopan flex h-6 items-center rounded-full border bg-card px-1.5 transition-all duration-200 ease-out active:scale-95 ${
            open
              ? "border-blue-400 px-2.5 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-border text-muted-foreground hover:border-blue-400 hover:px-2.5 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
          }`}
        >
          <Plus className="size-3.5 shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap text-xs font-medium transition-all duration-200 ease-out ${
              open ? "ml-1 max-w-[72px]" : "ml-0 max-w-0 group-hover/add:ml-1 group-hover/add:max-w-[72px]"
            }`}
          >
            Add action
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" side="bottom" sideOffset={8} className="w-80 overflow-hidden p-0">
        <div className="px-3 pt-3">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2 transition-colors focus-within:border-blue-400">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-3.5">
          {ACTION_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 ${
                tab === t.id
                  ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-400/50 dark:bg-blue-500/10 dark:text-blue-300"
                  : "border-border/60 bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <t.icon className={`size-3.5 ${t.accent}`} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="max-h-72 overflow-y-auto px-3 pb-3">
          {anyMatch ? (
            sections.map((sec) => {
              const items = sec.items.filter((it) => it.label.toLowerCase().includes(q))
              if (!items.length) return null
              return (
                <div key={sec.label} className="mb-4 last:mb-1">
                  <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
                    <sec.icon className="size-3.5 shrink-0" />
                    {sec.label}
                  </p>
                  <div className="space-y-1.5">
                    {items.map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => pick(sec, it)}
                        className="block w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-left shadow-xs transition-all duration-150 ease-out hover:border-blue-300 hover:bg-muted/40 hover:shadow-sm active:scale-[0.99]"
                      >
                        <p className="truncate text-sm font-medium text-foreground">{it.label}</p>
                        {it.description && <p className="truncate text-xs text-muted-foreground">{it.description}</p>}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="px-2 py-8 text-center text-xs text-muted-foreground">No matches</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function PlusEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })
  const onInsert = (data as { onInsert?: InsertFn } | undefined)?.onInsert
  const dragging = React.useContext(DragCtx)
  const [over, setOver] = React.useState(false)
  return (
    <>
      <BaseEdge id={id} path={path} style={{ strokeWidth: 1.5, stroke: "var(--wf-edge)" }} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          onDragOver={
            dragging
              ? (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = "move"; setOver(true) }
              : undefined
          }
          onDragLeave={dragging ? () => setOver(false) : undefined}
          onDrop={
            dragging
              ? (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setOver(false)
                  const raw = e.dataTransfer.getData(DND_MIME)
                  if (!raw) return
                  try {
                    onInsert?.(source, target, JSON.parse(raw))
                  } catch {}
                }
              : undefined
          }
        >
          {dragging ? (
            <div
              className={`flex w-64 items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed py-2.5 text-xs font-medium transition-all duration-200 ease-out ${
                over
                  ? "scale-105 border-violet-400 bg-violet-50 text-violet-600 shadow-sm dark:bg-violet-500/10 dark:text-violet-300"
                  : "border-muted-foreground/30 bg-card/70 text-muted-foreground"
              }`}
            >
              <Plus className="size-3.5" />
              Drop here
            </div>
          ) : (
            <AddActionPopover onPick={(d) => onInsert?.(source, target, d)} />
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

const edgeTypes = { plus: PlusEdge }

// ── Left palette: category rail + item flyout ─────────────────────────────────
function NodePalette({
  openId,
  setOpenId,
  onDragChange,
}: {
  openId: string | null
  setOpenId: (v: string | null) => void
  onDragChange: (v: boolean) => void
}) {
  const [query, setQuery] = React.useState("")
  const rootRef = React.useRef<HTMLDivElement>(null)
  const active = PALETTE_GROUPS.find((g) => g.id === openId) ?? null
  const q = query.trim().toLowerCase()

  // Tap outside the rail/flyout closes it.
  React.useEffect(() => {
    if (!active) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenId(null)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [active])

  return (
    <div ref={rootRef} className="absolute left-6 top-1/2 z-10 -translate-y-1/2">
      <div className="relative">
        {/* Group rail — single list of simple icons */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-border/60 bg-card/90 p-2 shadow-sm backdrop-blur-sm">
          {PALETTE_GROUPS.map((grp) => {
            const on = openId === grp.id
            return (
              <Tip key={grp.id} label={grp.label} side="right">
                <button
                  type="button"
                  onClick={() => { setOpenId(on ? null : grp.id); setQuery("") }}
                  className={`flex size-10 items-center justify-center rounded-xl transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${
                    on ? "bg-muted" : "hover:bg-muted"
                  }`}
                >
                  <grp.icon className={`size-[18px] ${grp.accent}`} />
                </button>
              </Tip>
            )
          })}
        </div>

        {/* Item flyout */}
        {active && (
          <div className="absolute left-full top-1/2 ml-2 flex max-h-[72vh] w-72 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg animate-in fade-in slide-in-from-left-2 duration-200 ease-out">
            <div className="flex items-center gap-2 p-3 pb-2">
              <div className={`flex size-7 items-center justify-center rounded-lg ${active.chip}`}>
                <active.icon className={`size-4 ${active.accent}`} />
              </div>
              <p className="flex-1 text-sm font-semibold text-foreground">{active.label}</p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpenId(null)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted active:scale-90"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="px-3 pb-2">
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2 transition-colors focus-within:border-violet-300">
                <Search className="size-3.5 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${active.label.toLowerCase()}…`}
                  className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 pt-0">
              {active.sections.map((sec) => {
                const items = sec.items.filter((it) => it.label.toLowerCase().includes(q))
                if (!items.length) return null
                return (
                  <div key={sec.label} className="mb-4 last:mb-1">
                    <p className="mb-2 flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground">
                      <sec.icon className="size-3.5 shrink-0" />
                      {sec.label}
                    </p>
                    <div className="space-y-1.5">
                      {items.map((it) => (
                        <div
                          key={it.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              DND_MIME,
                              JSON.stringify({ category: sec.nodeType, itemId: it.id, label: it.label, sub: it.description ?? "" })
                            )
                            e.dataTransfer.effectAllowed = "move"
                            // Custom drag image — title only.
                            const ghost = document.createElement("div")
                            ghost.textContent = it.label
                            ghost.style.cssText =
                              "position:absolute;top:-1000px;left:-1000px;padding:6px 12px;border-radius:9px;background:#ffffff;border:1px solid #e4e4e7;box-shadow:0 4px 12px rgba(0,0,0,0.12);font-size:13px;font-weight:600;color:#18181b;white-space:nowrap;font-family:inherit;"
                            document.body.appendChild(ghost)
                            e.dataTransfer.setDragImage(ghost, 14, 16)
                            setTimeout(() => ghost.remove(), 0)
                            onDragChange(true)
                          }}
                          onDragEnd={() => onDragChange(false)}
                          className="group flex cursor-grab items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 shadow-xs transition-all duration-150 ease-out hover:border-violet-300 hover:bg-muted/40 hover:shadow-sm active:cursor-grabbing"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{it.label}</p>
                            {it.description && <p className="truncate text-xs text-muted-foreground">{it.description}</p>}
                          </div>
                          <GripVertical className="size-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Initial chain: Trigger → End ──────────────────────────────────────────────
const INITIAL_NODES: Node[] = [
  {
    id: "agent-0",
    type: "agent",
    position: { x: 0, y: 0 },
    data: { title: "Review response agent", locations: 500 },
  },
  {
    id: "trigger-0",
    type: "workflow",
    position: { x: 0, y: 200 },
    data: { category: "trigger", label: "When a review arrives", sub: "Starts the workflow whenever a customer posts a new review.", itemId: "review.new" },
  },
  { id: "end-0", type: "end", position: { x: 144, y: 400 }, data: {} },
]
const INITIAL_ORDER = ["agent-0", "trigger-0", "end-0"]

// ── Inner builder ─────────────────────────────────────────────────────────────
function BuilderInner({ onBack }: { onBack: () => void }) {
  const [showInfo, setShowInfo] = React.useState(false)
  const [aiOpen, setAiOpen] = React.useState(false)
  const [selectedStep, setSelectedStep] = React.useState<(NodeData & { id: string }) | null>(null)
  // Retains the last step so its content stays visible during the close slide-out.
  const lastStep = React.useRef<(NodeData & { id: string }) | null>(null)
  if (selectedStep) lastStep.current = selectedStep
  // Agent details form
  const [agentName, setAgentName] = React.useState("Review response agent")
  const [goals, setGoals] = React.useState("")
  const [outcomes, setOutcomes] = React.useState("")
  const [locations, setLocations] = React.useState("all")
  const [status, setStatus] = React.useState<AgentStatus>("draft")
  // Unpublished structural edits exist on top of the live version.
  const [dirty, setDirty] = React.useState(false)
  // A palette item is currently being dragged.
  const [dragging, setDragging] = React.useState(false)
  // Which palette group flyout is open (lifted so a drop can close it).
  const [paletteOpen, setPaletteOpen] = React.useState<string | null>(null)
  const [orientation, setOrientation] = React.useState<"vertical" | "horizontal">("vertical")
  const [nodes, setNodes] = React.useState<Node[]>(INITIAL_NODES)
  const [order, setOrder] = React.useState<string[]>(INITIAL_ORDER)
  const [saving, setSaving] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const idRef = React.useRef(1)
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingTidy = React.useRef(true)

  const { screenToFlowPosition, zoomIn, zoomOut, fitView, getNode } = useReactFlow()
  const { zoom } = useViewport()
  const updateNodeInternals = useUpdateNodeInternals()
  const isVertical = orientation === "vertical"

  React.useEffect(() => {
    order.forEach((id) => updateNodeInternals(id))
  }, [orientation, order, updateNodeInternals])

  // Keep the agent card title in sync with the name field.
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => (n.type === "agent" ? { ...n, data: { ...(n.data as object), title: agentName } } : n))
    )
  }, [agentName])

  const markDirty = React.useCallback(() => {
    setSaving(true)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setSaving(false)
      setLastSaved(new Date())
    }, 900)
  }, [])
  React.useEffect(() => {
    setLastSaved(new Date())
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [])

  const syncTip = saving
    ? "Syncing…"
    : lastSaved
      ? `Last auto-saved at ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : "All changes saved"

  const onNodesChange = React.useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds))
      if (changes.some((c) => c.type === "position")) markDirty()
    },
    [markDirty]
  )

  const relayout = React.useCallback(
    (o: "vertical" | "horizontal") => {
      setNodes((nds) => {
        const idx = new Map(order.map((id, i) => [id, i] as const))
        const CENTER_X = 192
        const CENTER_Y = 60
        return nds.map((n) => {
          const i = idx.get(n.id) ?? 0
          const w = n.measured?.width ?? (n.type === "end" ? 96 : 384)
          const h = n.measured?.height ?? (n.type === "end" ? 44 : 104)
          return {
            ...n,
            position: o === "vertical" ? { x: CENTER_X - w / 2, y: i * 200 } : { x: i * 520, y: CENTER_Y - h / 2 },
          }
        })
      })
      markDirty()
      setTimeout(() => fitView({ padding: 0.3, duration: 400, maxZoom: 1 }), 60)
    },
    [order, markDirty, fitView]
  )
  const applyLayout = React.useCallback(
    (o: "vertical" | "horizontal") => {
      setOrientation(o)
      relayout(o)
    },
    [relayout]
  )
  const tidyUp = React.useCallback(() => relayout(orientation), [relayout, orientation])

  // Auto-tidy once after a drop — waits for the new node to mount + measure.
  const relayoutRef = React.useRef(relayout)
  relayoutRef.current = relayout
  React.useEffect(() => {
    if (!pendingTidy.current) return
    pendingTidy.current = false
    const t = setTimeout(() => relayoutRef.current(orientation), 70)
    return () => clearTimeout(t)
  }, [order, orientation])

  // Insert an item onto a wire, splitting source → target into source → new → target.
  const insertStep = React.useCallback<InsertFn>(
    (source, target, nodeData) => {
      const s = getNode(source)
      const t = getNode(target)
      const position =
        s && t
          ? { x: (s.position.x + t.position.x) / 2, y: (s.position.y + t.position.y) / 2 }
          : { x: 0, y: 0 }
      const id = `${nodeData.category}-${idRef.current++}`
      setNodes((nds) => nds.concat({ id, type: "workflow", position, data: { ...nodeData } }))
      setOrder((ord) => {
        const i = ord.indexOf(source)
        return i < 0 ? ord : [...ord.slice(0, i + 1), id, ...ord.slice(i + 1)]
      })
      markDirty()
      setDirty(true)
      pendingTidy.current = true
      setDragging(false)
      setPaletteOpen(null)
    },
    [getNode, markDirty]
  )

  // Remove a step node; edges re-derive from `order` so the wire auto-heals.
  const deleteNode = React.useCallback((delId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== delId))
    setOrder((ord) => ord.filter((x) => x !== delId))
    setSelectedStep((s) => (s?.id === delId ? null : s))
    markDirty()
    setDirty(true)
    pendingTidy.current = true
  }, [markDirty])

  // Open the right pane for a node — agent details or step settings.
  const openSettings = React.useCallback(
    (nodeId: string) => {
      const n = getNode(nodeId)
      if (!n) return
      setAiOpen(false)
      if (n.type === "agent") {
        setSelectedStep(null)
        setShowInfo(true)
      } else if (n.type === "workflow") {
        setShowInfo(false)
        setSelectedStep({ id: nodeId, ...(n.data as NodeData) })
      }
    },
    [getNode]
  )

  const nodeActions = React.useMemo<NodeActions>(
    () => ({ onSettings: openSettings, onDelete: deleteNode }),
    [openSettings, deleteNode]
  )

  const edges = React.useMemo<Edge[]>(
    () =>
      order.slice(0, -1).map((source, i) => {
        const target = order[i + 1]
        // First segment (agent → trigger) is a plain wire; steps insert below.
        const insertable = i > 0
        return {
          id: `e-${source}-${target}`,
          source,
          target,
          type: insertable ? "plus" : "smoothstep",
          style: { stroke: "var(--wf-edge)", strokeWidth: 1.5 },
          ...(insertable ? { data: { onInsert: insertStep } } : {}),
        }
      }),
    [order, insertStep]
  )

  const onDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  // Palette drop appends the item as a step just before the End node.
  const onDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const raw = e.dataTransfer.getData(DND_MIME)
      if (!raw) return
      let payload: NodeData
      try {
        payload = JSON.parse(raw) as NodeData
      } catch {
        return
      }
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      const id = `${payload.category}-${idRef.current++}`
      setNodes((nds) => nds.concat({ id, type: "workflow", position, data: { ...payload } }))
      setOrder((ord) => [...ord.slice(0, -1), id, ord[ord.length - 1]])
      markDirty()
      setDirty(true)
      pendingTidy.current = true
      setDragging(false)
      setPaletteOpen(null)
    },
    [screenToFlowPosition, markDirty]
  )

  const onNodeClick = React.useCallback(
    (_e: React.MouseEvent, node: Node) => {
      if (node.type === "agent" || node.type === "workflow") openSettings(node.id)
    },
    [openSettings]
  )

  return (
    <div
      className="wf-screen-in fixed inset-0 z-50 overflow-hidden bg-[#f1f1f4] dark:bg-[#0b0b12]"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <style>{`
        .react-flow { --wf-edge: #dedee3; }
        .dark .react-flow { --wf-edge: #2c2c36; }
        .react-flow__node { box-shadow: none !important; }
        .react-flow__node:focus, .react-flow__node:focus-visible { outline: none; }
        .react-flow__attribution { display: none; }
        .react-flow__handle { opacity: 0; pointer-events: none; width: 1px; height: 1px; min-width: 0; min-height: 0; border: none; }
        .react-flow__node:not(.dragging) { transition: transform 350ms cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes wfScreenIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes wfChromeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        .wf-screen-in { animation: wfScreenIn 450ms ease-out both; }
        .wf-chrome-in { animation: wfChromeIn 550ms cubic-bezier(0.22,1,0.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .wf-screen-in, .wf-chrome-in { animation: none } }
      `}</style>

      <OrientationCtx.Provider value={orientation}>
       <DragCtx.Provider value={dragging}>
        <ActionsCtx.Provider value={nodeActions}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesConnectable={false}
          deleteKeyCode={null}
          fitView
          fitViewOptions={{ maxZoom: 1, padding: 0.3 }}
          minZoom={0.4}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          className="absolute inset-0"
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.6} color="#a9a9b4" className="dark:hidden" />
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="#2b2b38" className="hidden dark:block" />
        </ReactFlow>
        </ActionsCtx.Provider>
       </DragCtx.Provider>
      </OrientationCtx.Provider>

      {/* Top-left — Back */}
      <div className="wf-chrome-in absolute left-6 top-6 z-10" style={{ animationDelay: "120ms" }}>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full bg-card/90 shadow-sm backdrop-blur-sm"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      {/* Top-center — agent header */}
      <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2">
        <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/90 py-1.5 pl-2 pr-2 shadow-sm backdrop-blur-sm">
          <Tip label="Edit agent details" side="bottom">
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              className="max-w-[220px] truncate rounded-full px-2.5 py-1 text-sm font-semibold text-foreground transition-all duration-150 ease-out hover:bg-muted active:scale-[0.98]"
            >
              {agentName || "Untitled agent"}
            </button>
          </Tip>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
            <span className={`size-1.5 rounded-full ${STATUS_META[status].dot}`} /> {STATUS_META[status].label}
          </span>
          {status !== "draft" && dirty && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <span className="size-1.5 rounded-full bg-amber-500" /> Unpublished changes
            </span>
          )}
          <div className="mx-0.5 h-4 w-px bg-border/70" />
          <Tip label="Version history" side="bottom">
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-90"
            >
              <History className="size-4" />
            </button>
          </Tip>
          <Tip label="Preview" side="bottom">
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-90"
            >
              <Play className="size-4" />
            </button>
          </Tip>
          <div className="mx-0.5 h-4 w-px bg-border/70" />
          {status === "running" && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setStatus("paused")}
            >
              Pause
            </Button>
          )}
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => { setStatus("running"); setDirty(false) }}
          >
            {status !== "draft" && dirty ? "Publish changes" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Left — palette rail + flyout */}
      <NodePalette openId={paletteOpen} setOpenId={setPaletteOpen} onDragChange={setDragging} />

      {/* Left-bottom — zoom + fit + tidy */}
      <div className="wf-chrome-in absolute bottom-6 left-6 z-10" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/90 p-1 shadow-sm backdrop-blur-sm">
          <Tip label="Zoom out">
            <button
              type="button"
              onClick={() => zoomOut()}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all duration-150 ease-out hover:bg-muted active:scale-90"
            >
              <Minus className="size-4" />
            </button>
          </Tip>
          <span className="w-10 text-center text-xs font-medium tabular-nums text-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <Tip label="Zoom in">
            <button
              type="button"
              onClick={() => zoomIn()}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all duration-150 ease-out hover:bg-muted active:scale-90"
            >
              <Plus className="size-4" />
            </button>
          </Tip>
          <div className="mx-0.5 h-4 w-px bg-border/70" />
          <Tip label="Fit to screen">
            <button
              type="button"
              onClick={() => fitView({ padding: 0.2, duration: 300, maxZoom: 1 })}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all duration-150 ease-out hover:bg-muted active:scale-90"
            >
              <Maximize className="size-4" />
            </button>
          </Tip>
          <Tip label="Tidy up">
            <button
              type="button"
              onClick={tidyUp}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-all duration-150 ease-out hover:bg-muted hover:text-violet-600 active:scale-90"
            >
              <WandSparkles className="size-4" />
            </button>
          </Tip>
        </div>
      </div>

      {/* Middle-bottom — actions (pill) + separate AI button */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/90 p-1 shadow-sm backdrop-blur-sm">
            <ToolbarButton label="Undo"><Undo2 className="size-4" /></ToolbarButton>
            <ToolbarButton label="Redo"><Redo2 className="size-4" /></ToolbarButton>
            <div className="mx-0.5 h-4 w-px bg-border/70" />
            <ToolbarButton label="Horizontal layout" active={!isVertical} onClick={() => applyLayout("horizontal")}>
              <Columns2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Vertical layout" active={isVertical} onClick={() => applyLayout("vertical")}>
              <Rows2 className="size-4" />
            </ToolbarButton>
          </div>
          <Tip label="AI builder">
            <button
              type="button"
              aria-label="AI builder"
              onClick={() => { setAiOpen(true); setShowInfo(false); setSelectedStep(null) }}
              className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-sm transition-transform duration-150 ease-out hover:scale-105 active:scale-95 ${aiOpen ? "ring-2 ring-violet-300 ring-offset-2 ring-offset-background" : ""}`}
            >
              <Sparkle className="size-[18px]" fill="currentColor" strokeWidth={1.5} />
            </button>
          </Tip>
        </div>
      </div>

      {/* Right panel — agent info */}
      <div
        className={`absolute bottom-6 right-6 top-6 z-10 flex w-[420px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showInfo
            ? "translate-x-0 scale-100 opacity-100 blur-0"
            : "pointer-events-none translate-x-[calc(100%+2.5rem)] scale-[0.98] opacity-0 blur-[2px]"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-border/60 p-4">
          <div className="flex size-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
            <Sparkle className="size-4 text-violet-500" fill="currentColor" strokeWidth={1.5} />
          </div>
          <p className="flex-1 text-sm font-semibold text-foreground">Agent details</p>
          <Tip label="Close" side="left">
            <button
              type="button"
              onClick={() => setShowInfo(false)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted active:scale-90"
            >
              <X className="size-4" />
            </button>
          </Tip>
        </div>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          <div className="space-y-1.5">
            <Label htmlFor="agent-name">Agent name</Label>
            <Input
              id="agent-name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Name your agent"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agent-goals">Goals</Label>
            <Textarea
              id="agent-goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="What should this agent achieve?"
              className="min-h-24 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agent-outcomes">Outcomes</Label>
            <Textarea
              id="agent-outcomes"
              value={outcomes}
              onChange={(e) => setOutcomes(e.target.value)}
              placeholder="What outcomes define success?"
              className="min-h-24 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Select locations</Label>
            <Select value={locations} onValueChange={setLocations}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations (500)</SelectItem>
                <SelectItem value="us">United States (320)</SelectItem>
                <SelectItem value="eu">Europe (120)</SelectItem>
                <SelectItem value="apac">APAC (60)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="border-t border-border/60 p-4">
          <Button
            className="w-full transition-transform duration-150 ease-out active:scale-[0.98]"
            onClick={() => setShowInfo(false)}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Right panel — step settings (placeholder for now) */}
      {(() => {
        const step = selectedStep ?? lastStep.current
        const meta = step ? CATEGORY_META[step.category] : null
        const StepIcon = step && meta ? iconForItem(step.itemId) ?? meta.icon : null
        return (
          <div
            className={`absolute bottom-6 right-6 top-6 z-10 flex w-[420px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              selectedStep
                ? "translate-x-0 scale-100 opacity-100 blur-0"
                : "pointer-events-none translate-x-[calc(100%+2.5rem)] scale-[0.98] opacity-0 blur-[2px]"
            }`}
          >
            {step && meta && StepIcon && (
              <>
                <div className="flex items-center gap-3 border-b border-border/60 p-4">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${meta.chip} ${meta.accent}`}>
                    <StepIcon className="size-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[11px] font-semibold uppercase tracking-wide ${meta.accent}`}>{meta.label}</p>
                    <p className="truncate text-sm font-semibold text-foreground">{step.label}</p>
                  </div>
                  <Tip label="Close" side="left">
                    <button
                      type="button"
                      onClick={() => setSelectedStep(null)}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted active:scale-90"
                    >
                      <X className="size-4" />
                    </button>
                  </Tip>
                </div>
                <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.sub}</p>
                  <div className="space-y-1.5">
                    <Label>Step name</Label>
                    <Input value={step.label} readOnly />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Notes</Label>
                    <Textarea placeholder="Add notes for this step…" className="min-h-24 resize-none" />
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/70 p-6 text-center">
                    <div className={`flex size-9 items-center justify-center rounded-lg ${meta.chip} ${meta.accent}`}>
                      <Settings2 className="size-4" />
                    </div>
                    <p className="text-sm font-medium text-foreground">More options coming soon</p>
                    <p className="text-xs text-muted-foreground">Configuration for this step will appear here.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )
      })()}

      {/* AI Copilot chat panel */}
      <AiCopilot open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────────────
export function WorkflowBuilder({ onBack }: { onBack: () => void }) {
  return (
    <ReactFlowProvider>
      <TooltipProvider delayDuration={200}>
        <BuilderInner onBack={onBack} />
      </TooltipProvider>
    </ReactFlowProvider>
  )
}

// Wrap any control in a hover tooltip; also injects a matching aria-label.
function Tip({
  label,
  side = "top",
  children,
}: {
  label: string
  side?: "top" | "bottom" | "left" | "right"
  children: React.ReactElement<Record<string, unknown>>
}) {
  const child = React.cloneElement(children, {
    "aria-label": children.props["aria-label"] ?? label,
  })
  return (
    <Tooltip>
      <TooltipTrigger asChild>{child}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={6}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function ToolbarButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Tip label={label}>
      <button
        type="button"
        onClick={onClick}
        className={`flex size-8 items-center justify-center rounded-full transition-all duration-150 ease-out active:scale-90 ${
          active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"
        }`}
      >
        {children}
      </button>
    </Tip>
  )
}
