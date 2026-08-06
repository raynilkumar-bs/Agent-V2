"use client"

import { ChevronRight, Sparkle } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/new-york-v4/ui/collapsible"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/new-york-v4/ui/sidebar"

const navItems = [
  { title: "Actions", items: [] },
  { title: "Reports", items: [] },
  { title: "Competitors", items: [] },
  {
    title: "Agents",
    defaultOpen: true,
    items: [
      { title: "Review generation agents", url: "#", isActive: false },
      { title: "Review response agents", url: "#", isActive: true },
    ],
  },
  { title: "Settings", items: [] },
]

export function NavReviews({
  onPathChange,
}: {
  onPathChange?: (path: string[]) => void
}) {
  return (
    <>
      <SidebarHeader className="gap-3 p-4">
        <div className="text-base font-medium text-foreground">Reviews AI</div>
        <Button variant="outline" className="w-full transition-all duration-200" size="sm">
          Send a review request
        </Button>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {navItems.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.defaultOpen}
            className="group/collapsible"
          >
            <SidebarGroup className="py-0">
              <SidebarGroupLabel
                asChild
                className="group/label text-sm font-medium text-foreground transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  <span className="flex items-center gap-1.5">
                    {item.title}
                    {item.title === "Agents" && (
                      <Sparkle className="size-3.5 text-violet-500 dark:text-violet-400" fill="currentColor" strokeWidth={0} />
                    )}
                  </span>
                  <ChevronRight className="ml-auto transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        {subItem.title === "Review response agents" ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <SidebarMenuButton
                                isActive={subItem.isActive}
                                className={`transition-colors duration-200 ${subItem.isActive
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground font-normal"
                                }`}
                                onClick={() =>
                                  onPathChange?.(["Reviews AI", item.title, subItem.title])
                                }
                              >
                                {subItem.title}
                              </SidebarMenuButton>
                            </PopoverTrigger>
                            <PopoverContent side="right" align="start" className="w-72 overflow-hidden p-0">
                              {/* Gradient image area */}
                              <div
                                className="flex h-32 w-full items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #3b82f6 100%)" }}
                              >
                                <svg width="48" height="48" viewBox="0 0 24 24">
                                  <defs>
                                    <linearGradient id="pop-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#fff" />
                                      <stop offset="100%" stopColor="#e0e7ff" />
                                    </linearGradient>
                                  </defs>
                                  <path fill="url(#pop-sparkle)" d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                                </svg>
                              </div>
                              {/* Text content */}
                              <div className="p-4">
                                <h4 className="text-sm font-semibold text-foreground">Review Response Agents</h4>
                                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                                  Automatically respond to customer reviews using AI-powered agents that maintain your brand voice and improve response time.
                                </p>
                                <Button size="sm" className="mt-4 w-full">Get Started</Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            isActive={subItem.isActive}
                            className={`transition-colors duration-200 ${subItem.isActive
                              ? "text-primary font-medium"
                              : "text-muted-foreground font-normal"
                            }`}
                          >
                            <a
                              href={subItem.url}
                              onClick={() =>
                                onPathChange?.(["Reviews AI", item.title, subItem.title])
                              }
                            >
                              {subItem.title}
                            </a>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </>
  )
}
