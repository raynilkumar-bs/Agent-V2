import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = { title: "Birdeye AI Agents", description: "Birdeye AI agent builder — Reviews AI" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" suppressHydrationWarning><body>{children}</body></html>)
}
