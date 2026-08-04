"use client"

import * as React from "react"
import { ArrowLeft, Mic, Paperclip, Send, Sparkles } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { useSidebar } from "@/registry/new-york-v4/ui/sidebar"
import { WorkflowBuilder } from "@/registry/new-york-v4/blocks/sidebar-09/components/workflow-builder"

// Botix-style mesh + grid background. Kept as tuned constants (like `templates`
// below) and applied via layered divs so we can toggle light/dark with Tailwind's
// `dark:` variant — an inline `style` alone can't react to the app's `.dark` class.
const LIGHT_MESH =
  "radial-gradient(ellipse 50% 45% at 12% -5%, rgba(251,207,232,0.55), transparent 60%)," +
  "radial-gradient(ellipse 45% 40% at 45% -8%, rgba(216,180,254,0.50), transparent 60%)," +
  "radial-gradient(ellipse 48% 45% at 88% 2%, rgba(191,219,254,0.60), transparent 60%)," +
  "radial-gradient(ellipse 30% 40% at -2% 45%, rgba(251,207,232,0.35), transparent 55%)," +
  "radial-gradient(ellipse 40% 35% at 3% 103%, rgba(254,215,190,0.40), transparent 55%)," +
  "radial-gradient(ellipse 46% 40% at 97% 103%, rgba(254,205,211,0.45), transparent 55%)"

const DARK_MESH =
  "radial-gradient(ellipse 50% 45% at 12% -5%, rgba(219,39,119,0.16), transparent 60%)," +
  "radial-gradient(ellipse 45% 40% at 45% -8%, rgba(139,92,246,0.18), transparent 60%)," +
  "radial-gradient(ellipse 48% 45% at 88% 2%, rgba(59,130,246,0.15), transparent 60%)," +
  "radial-gradient(ellipse 30% 40% at -2% 45%, rgba(139,92,246,0.12), transparent 55%)," +
  "radial-gradient(ellipse 40% 35% at 3% 103%, rgba(251,146,60,0.10), transparent 55%)," +
  "radial-gradient(ellipse 46% 40% at 97% 103%, rgba(236,72,153,0.12), transparent 55%)"

// Faint graph-paper grid: two crossed 1px linear-gradients. A radial mask fades the
// lines out toward the center so foreground content stays clean.
const GRID_MASK =
  "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 90%)"

function gridStyle(line: string): React.CSSProperties {
  return {
    backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
    backgroundSize: "44px 44px",
    WebkitMaskImage: GRID_MASK,
    maskImage: GRID_MASK,
  }
}

const templates = [
  {
    bg: "radial-gradient(ellipse at 20% 50%, rgba(147,197,253,0.8) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(165,180,252,0.7) 0%, transparent 55%), #dbeafe",
    title: "Professional Response", desc: "Craft formal, polished replies that maintain your brand's professional tone.",
    wireframe: 0,
  },
  {
    bg: "radial-gradient(ellipse at 30% 60%, rgba(216,180,254,0.8) 0%, transparent 55%), radial-gradient(ellipse at 70% 20%, rgba(249,168,212,0.6) 0%, transparent 60%), #f3e8ff",
    title: "Friendly Thank You", desc: "Warm acknowledgements that make customers feel valued after positive feedback.",
    wireframe: 1,
  },
  {
    bg: "radial-gradient(ellipse at 25% 55%, rgba(110,231,183,0.7) 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, rgba(147,197,253,0.5) 0%, transparent 60%), #d1fae5",
    title: "Service Recovery", desc: "Turn negative reviews into opportunities with empathetic responses.",
    wireframe: 2,
  },
  {
    bg: "radial-gradient(ellipse at 20% 60%, rgba(251,207,232,0.9) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(216,180,254,0.6) 0%, transparent 55%), #fce7f3",
    title: "Brand Voice Match", desc: "AI-tuned responses that mirror your brand's unique tone and personality.",
    wireframe: 3,
  },
  {
    bg: "radial-gradient(ellipse at 30% 50%, rgba(253,186,116,0.8) 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, rgba(252,165,165,0.6) 0%, transparent 55%), #ffedd5",
    title: "Issue Acknowledgement", desc: "Empathetic responses that acknowledge concerns and reassure customers.",
    wireframe: 4,
  },
  {
    bg: "radial-gradient(ellipse at 25% 55%, rgba(165,180,252,0.8) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(147,197,253,0.6) 0%, transparent 60%), #e0e7ff",
    title: "Positive Reinforcement", desc: "Amplify great reviews and inspire others to share their experiences.",
    wireframe: 5,
  },
  {
    bg: "radial-gradient(ellipse at 20% 60%, rgba(167,243,208,0.8) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(110,231,183,0.5) 0%, transparent 55%), #ecfdf5",
    title: "Smart Follow-up", desc: "Timely, personalised follow-up messages that re-engage customers and build lasting relationships.",
    wireframe: 6,
  },
  {
    bg: "radial-gradient(ellipse at 25% 55%, rgba(253,186,116,0.7) 0%, transparent 55%), radial-gradient(ellipse at 80% 25%, rgba(252,211,77,0.5) 0%, transparent 55%), #fffbeb",
    title: "Escalation Handler", desc: "Professionally escalate critical reviews to management while keeping customers informed.",
    wireframe: 7,
  },
]

function WireframeCard({ idx }: { idx: number }) {
  if (idx === 0) return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5"><div className="size-5 shrink-0 animate-pulse rounded-full bg-slate-200" /><div className="h-1.5 w-14 animate-pulse rounded-full bg-slate-200" /><div className="ml-auto flex gap-0.5">{[0,1,2,3,4].map(s=><svg key={s} width="8" height="8" viewBox="0 0 24 24"><path fill="#fbbf24" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</div></div>
      <div className="space-y-1"><div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100" /><div className="h-1.5 w-4/5 animate-pulse rounded-full bg-slate-100" /></div>
      <div className="rounded-lg bg-violet-50 p-2 ring-1 ring-violet-100"><div className="flex items-center gap-1"><span className="text-[8px] font-semibold text-violet-600">✦ AI reply</span><div className="ml-auto flex gap-0.5">{[0,1,2].map(d=><span key={d} className="size-1 animate-bounce rounded-full bg-violet-400" style={{animationDelay:`${d*150}ms`}}/>)}</div></div></div>
    </div>
  )
  if (idx === 1) return (
    <div className="space-y-2">
      <div className="flex justify-start"><div className="rounded-2xl rounded-tl-sm bg-slate-100 px-2.5 py-1.5"><div className="h-1.5 w-20 animate-pulse rounded-full bg-slate-300" /><div className="mt-1 h-1.5 w-14 animate-pulse rounded-full bg-slate-200" /></div></div>
      <div className="flex justify-end"><div className="rounded-2xl rounded-tr-sm bg-violet-100 px-2.5 py-1.5"><div className="h-1.5 w-16 animate-pulse rounded-full bg-violet-300" /><div className="mt-1 h-1.5 w-12 animate-pulse rounded-full bg-violet-200" /></div></div>
      <div className="flex items-center gap-1"><span className="text-[8px] font-semibold text-violet-500">✦ AI drafting</span><div className="flex gap-0.5">{[0,1,2].map(d=><span key={d} className="size-1 animate-bounce rounded-full bg-violet-300" style={{animationDelay:`${d*150}ms`}}/>)}</div></div>
    </div>
  )
  if (idx === 2) return (
    <div className="space-y-2">
      <div className="flex items-center justify-between"><div className="flex h-4 items-center rounded-md bg-red-100 px-1.5"><span className="text-[8px] font-semibold text-red-600">1-star Review</span></div><div className="h-1.5 w-10 animate-pulse rounded-full bg-slate-100" /></div>
      <div className="space-y-1"><div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100" /><div className="h-1.5 w-3/5 animate-pulse rounded-full bg-slate-100" /></div>
      <div className="flex gap-1.5"><div className="h-4 flex-1 animate-pulse rounded-md bg-slate-100" /><div className="flex h-4 items-center rounded-md bg-emerald-100 px-1.5"><span className="text-[8px] font-semibold text-emerald-600">Resolved ✓</span></div></div>
    </div>
  )
  if (idx === 3) return (
    <div className="space-y-2">
      <div className="flex items-center gap-2"><div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 text-[8px] font-bold text-white">B</div><div className="space-y-1"><div className="h-1.5 w-16 animate-pulse rounded-full bg-slate-200" /><div className="h-1.5 w-10 animate-pulse rounded-full bg-slate-100" /></div></div>
      <div className="flex gap-1">{["Friendly","Professional","Warm"].map(t=><div key={t} className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[7px] text-slate-500">{t}</div>)}</div>
      <div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100" />
    </div>
  )
  if (idx === 4) return (
    <div className="space-y-2">
      <div className="flex items-center justify-between"><div className="flex h-4 items-center gap-1 rounded-md bg-orange-100 px-1.5"><span className="text-[8px] font-semibold text-orange-600">⚠ Issue</span></div><span className="text-[8px] text-slate-400">#2841</span></div>
      <div className="space-y-1"><div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100" /><div className="h-1.5 w-2/3 animate-pulse rounded-full bg-slate-100" /></div>
      <div className="flex items-center gap-1.5"><div className="size-4 animate-pulse rounded-full bg-slate-200" /><div className="h-1.5 w-14 animate-pulse rounded-full bg-slate-100" /><div className="ml-auto flex h-4 items-center rounded-md bg-blue-100 px-1.5"><span className="text-[8px] text-blue-600">In Review</span></div></div>
    </div>
  )
  if (idx === 5) return (
    <div className="space-y-2">
      <div className="flex gap-0.5">{[0,1,2,3,4].map(s=><svg key={s} width="10" height="10" viewBox="0 0 24 24"><path fill="#fbbf24" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</div>
      <div className="space-y-1"><div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100" /><div className="h-1.5 w-5/6 animate-pulse rounded-full bg-slate-100" /><div className="h-1.5 w-3/4 animate-pulse rounded-full bg-slate-100" /></div>
      <div className="flex items-center gap-1.5"><div className="size-4 animate-pulse rounded-full bg-slate-200" /><div className="h-1.5 w-12 animate-pulse rounded-full bg-slate-100" /></div>
    </div>
  )
  if (idx === 6) return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5"><div className="flex h-4 items-center rounded-md bg-emerald-100 px-1.5"><span className="text-[8px] font-semibold text-emerald-600">Follow-up</span></div><div className="ml-auto h-1.5 w-10 animate-pulse rounded-full bg-slate-100" /></div>
      <div className="space-y-1"><div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100" /><div className="h-1.5 w-4/5 animate-pulse rounded-full bg-slate-100" /></div>
      <div className="rounded-lg bg-emerald-50 p-1.5 ring-1 ring-emerald-100"><div className="flex items-center gap-1"><span className="text-[8px] font-semibold text-emerald-600">✦ Scheduled</span><div className="ml-auto flex gap-0.5">{[0,1,2].map(d=><span key={d} className="size-1 animate-bounce rounded-full bg-emerald-400" style={{animationDelay:`${d*150}ms`}}/>)}</div></div></div>
    </div>
  )
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between"><div className="flex h-4 items-center gap-1 rounded-md bg-amber-100 px-1.5"><span className="text-[8px] font-semibold text-amber-700">🔺 Escalated</span></div><span className="text-[8px] text-slate-400">Mgr notified</span></div>
      <div className="space-y-1"><div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100" /><div className="h-1.5 w-3/5 animate-pulse rounded-full bg-slate-100" /></div>
      <div className="flex items-center gap-2"><div className="size-4 animate-pulse rounded-full bg-amber-200" /><div className="h-1.5 w-16 animate-pulse rounded-full bg-slate-100" /><div className="ml-auto flex h-4 items-center rounded-md bg-amber-100 px-1.5"><span className="text-[8px] text-amber-700">Pending</span></div></div>
    </div>
  )
}

// Starter prompts users can pick to seed the chat instead of writing from scratch.
// `label` keeps the chip compact; `prompt` is the fuller text dropped into the input.
const examples = [
  { label: "Thank 5-star reviewers", prompt: "Thank customers for their 5-star reviews" },
  { label: "Reply with empathy", prompt: "Reply to negative reviews with empathy" },
  { label: "Match our brand voice", prompt: "Match our brand's friendly, casual tone" },
  { label: "Escalate 1-star reviews", prompt: "Escalate 1-star reviews to a manager" },
  { label: "Follow up on complaints", prompt: "Follow up after resolving a complaint" },
]

export function CreateAgent({ onBack }: { onBack: () => void }) {
  const [prompt, setPrompt] = React.useState("")
  const [showBuilder, setShowBuilder] = React.useState(false)
  const { setOpen } = useSidebar()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleBack = () => {
    setOpen(true)
    onBack()
  }

  // "Build from Scratch" opens the full-screen workflow builder; its Back returns
  // to the agent list (same as this screen's Back).
  if (showBuilder) {
    return <WorkflowBuilder onBack={handleBack} />
  }

  // Move focus into the textarea; optionally seed it with an example prompt.
  const startChat = (seed = "") => {
    setPrompt(seed)
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#fafaff] dark:bg-[#0b0b14]">
      {/* Background layers — pinned to the viewport so content scrolls over them.
          Light/dark toggled purely with Tailwind's `dark:` variant. */}
      <div
        className="pointer-events-none fixed inset-0 dark:hidden"
        style={{ background: LIGHT_MESH }}
      />
      <div
        className="pointer-events-none fixed inset-0 hidden dark:block"
        style={{ background: DARK_MESH }}
      />
      <div
        className="pointer-events-none fixed inset-0 dark:hidden"
        style={gridStyle("rgba(15,23,42,0.04)")}
      />
      <div
        className="pointer-events-none fixed inset-0 hidden dark:block"
        style={gridStyle("rgba(255,255,255,0.09)")}
      />

      {/* Sticky floating back button */}
      <div className="sticky top-0 z-10 flex items-start p-6">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full bg-white/80 shadow-sm backdrop-blur-sm dark:bg-card/70"
          onClick={handleBack}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center px-8 pb-16 pt-4">

        {/* AI orb — breathing glow + rotating ring + twinkling sparkle */}
        <div className="ca-zoom relative mb-10 flex size-24 items-center justify-center">
          <style>{`
            @keyframes orbBreathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.04) } }
            @keyframes sparkleTwinkle { 0%,100% { transform: scale(0.9) } 50% { transform: scale(1.08) } }
            @keyframes ringPulse { 0%,100% { opacity: 0.6; transform: scale(0.96) } 50% { opacity: 1; transform: scale(1.04) } }
            .orb-breathe { animation: orbBreathe 5s ease-in-out infinite; }
            .orb-sparkle { transform-box: fill-box; transform-origin: center; animation: sparkleTwinkle 3s ease-in-out infinite; }
            .orb-ring { animation: ringPulse 3.5s ease-in-out infinite; }
            @keyframes caRise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
            @keyframes caZoom { from { opacity: 0; transform: scale(0.9) } to { opacity: 1; transform: none } }
            .ca-rise { animation: caRise 650ms cubic-bezier(0.22,1,0.36,1) both; }
            .ca-zoom { animation: caZoom 700ms cubic-bezier(0.22,1,0.36,1) both; }
            @media (prefers-reduced-motion: reduce) {
              .orb-breathe, .orb-sparkle, .orb-ring, .ca-rise, .ca-zoom { animation: none; }
            }
          `}</style>

          {/* Aurora glow (blurred conic, slowly breathing) */}
          <div
            className="absolute size-24 animate-pulse rounded-full blur-2xl [animation-duration:4s]"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(25,118,210,0.5), rgba(139,92,246,0.45), rgba(236,72,153,0.4), rgba(96,165,250,0.45), rgba(25,118,210,0.5))",
            }}
          />
          {/* Static gradient ring (masked to a thin rim), gently pulsing */}
          <div
            className="orb-ring absolute size-16 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #1976d2, #8b5cf6, #ec4899, #60a5fa, #1976d2)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            }}
          />
          {/* White disc holding a single twinkling sparkle */}
          <div className="orb-breathe relative flex size-14 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5">
            <svg
              viewBox="0 0 24 24"
              className="orb-sparkle size-7 [filter:drop-shadow(0_0_6px_rgba(139,92,246,0.55))]"
            >
              <defs>
                <linearGradient id="orbSparkle" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1976d2" />
                  <stop offset="0.5" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <path
                fill="url(#orbSparkle)"
                d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="ca-rise mb-10 text-center" style={{ animationDelay: "90ms" }}>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Build Your AI Agent</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Describe it. We'll configure everything for you.
          </p>
        </div>

        {/* Chat input */}
        <div className="ca-rise w-full max-w-2xl" style={{ animationDelay: "170ms" }}>
          <div className="group relative transition-transform duration-300 ease-out focus-within:-translate-y-0.5">
            {/* Input card — gently elevates on focus */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-[border-color,box-shadow] duration-300 group-focus-within:border-transparent group-focus-within:shadow-[0_12px_28px_-12px_rgba(80,70,180,0.22)] dark:group-focus-within:shadow-[0_12px_28px_-12px_rgba(139,92,246,0.35)]">
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want your agent to do..."
              className="min-h-[120px] resize-none border-0 bg-transparent p-5 text-sm shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center gap-2 border-t border-border/40 px-5 py-3">
              <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground">
                <Paperclip className="size-3.5" />
                Attach context
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" className="size-9">
                  <Mic className="size-4 text-muted-foreground" />
                </Button>
                <Button size="icon" className="size-9 rounded-xl" disabled={!prompt.trim()}>
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </div>
            {/* Gradient stroke (AI border) — fades in softly on focus */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-80"
              style={{
                padding: "1px",
                background: "linear-gradient(135deg, #1976d2, #8b5cf6, #ec4899)",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
          </div>

          {/* Build from scratch + example starters */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full px-5"
              onClick={() => setShowBuilder(true)}
            >
              <Sparkles className="size-3.5 text-violet-500" />
              Build from Scratch
            </Button>
            {examples.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => startChat(example.prompt)}
                className="rounded-full border border-border/60 bg-white/70 px-4 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="ca-rise my-10 flex w-full max-w-4xl items-center gap-4" style={{ animationDelay: "250ms" }}>
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-xs text-muted-foreground">or choose a template</span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        {/* Template grid — 4 per row */}
        <div className="ca-rise w-full max-w-4xl" style={{ animationDelay: "320ms" }}>
          <div className="grid grid-cols-4 gap-4">
            {templates.map((tpl, i) => (
              <div key={i} className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md">
                {/* Gradient + wireframe */}
                <div className="flex h-36 items-center justify-center px-4" style={{ background: tpl.bg }}>
                  <div className="w-full rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/[0.06]">
                    <WireframeCard idx={tpl.wireframe} />
                  </div>
                </div>
                {/* Content */}
                <div className="flex flex-col gap-1.5 p-3">
                  <p className="text-xs font-semibold text-foreground">{tpl.title}</p>
                  <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{tpl.desc}</p>
                  <Button variant="outline" size="sm" className="mt-1 w-full text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
