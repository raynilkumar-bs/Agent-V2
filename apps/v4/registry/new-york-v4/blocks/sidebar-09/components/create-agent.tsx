"use client"

import * as React from "react"
import { ArrowLeft, FileText, Flag, Heart, LifeBuoy, Mic, Palette, Paperclip, Send, ThumbsUp, TriangleAlert } from "lucide-react"

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
  { icon: FileText, tile: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300", title: "Professional Response", desc: "Craft formal, polished replies that maintain your brand's professional tone." },
  { icon: Heart, tile: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300", title: "Friendly Thank You", desc: "Warm acknowledgements that make customers feel valued after positive feedback." },
  { icon: LifeBuoy, tile: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300", title: "Service Recovery", desc: "Turn negative reviews into opportunities with empathetic responses." },
  { icon: Palette, tile: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300", title: "Brand Voice Match", desc: "AI-tuned responses that mirror your brand's unique tone and personality." },
  { icon: TriangleAlert, tile: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300", title: "Issue Acknowledgement", desc: "Empathetic responses that acknowledge concerns and reassure customers." },
  { icon: ThumbsUp, tile: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300", title: "Positive Reinforcement", desc: "Amplify great reviews and inspire others to share their experiences." },
  { icon: Send, tile: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300", title: "Smart Follow-up", desc: "Timely, personalised follow-up messages that re-engage customers and build lasting relationships." },
  { icon: Flag, tile: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300", title: "Escalation Handler", desc: "Professionally escalate critical reviews to management while keeping customers informed." },
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
                <Button size="icon" className="size-9 rounded-xl" disabled={!prompt.trim()} onClick={() => setShowBuilder(true)}>
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
                <Button variant="outline" size="sm" onClick={() => setShowBuilder(true)} className="mt-4 w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
