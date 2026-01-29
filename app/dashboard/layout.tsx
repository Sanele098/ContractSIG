"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, FileText, Users, Building2, Zap, MessageSquare } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/consultation", label: "Consultation", icon: MessageSquare },
    { href: "/dashboard/opportunities", label: "Opportunities", icon: Zap },
    { href: "/dashboard/contracts", label: "My Contracts", icon: FileText },
    { href: "/dashboard/calculator", label: "Bid Calculator", icon: FileText, beta: true },
    { href: "/dashboard/company", label: "Company Profile", icon: Building2 },
    { href: "/dashboard/team", label: "Team Management", icon: Users },
  ]

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      {/* Sidebar - Mobile overlay and desktop fixed */}
      <>
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={() => setSidebarOpen(false)} />
        )}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } fixed md:relative transition-all duration-300 border-r border-border bg-sidebar overflow-hidden flex flex-col h-screen md:h-full z-50 md:z-auto`}
        >
          <div className="p-4 md:p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-secondary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-10-2h8v2h-8V4zm10 14H4V8h16v10zm-11-7h6a1 1 0 0 0 0-2h-6a1 1 0 0 0 0 2zm0 4h6a1 1 0 0 0 0-2h-6a1 1 0 0 0 0 2z" />
                </svg>
              </div>
              <span className="font-semibold text-sidebar-foreground text-sm md:text-base hidden sm:inline">
                ContractSIG
              </span>
            </div>
          </div>

          <nav className="flex-1 p-2 md:p-3 space-y-0.5 md:space-y-1 overflow-hidden">
            {navItems.map((item) => {
              const isActive =
                (item.href === "/dashboard" && pathname === "/dashboard") ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      const isMobile = window.innerWidth < 768
                      if (isMobile) setSidebarOpen(false)
                    }}
                    className={`flex items-center gap-2 px-3 md:px-3 py-1.5 md:py-2 rounded-lg font-medium transition-all text-xs md:text-sm group ${
                      isActive
                        ? "bg-secondary/15 text-secondary hover:bg-secondary/25"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.beta && (
                      <span className="ml-auto text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-semibold flex-shrink-0">
                        Beta
                      </span>
                    )}
                  </Link>
                </div>
              )
            })}
          </nav>

          <div className="p-2 md:p-3 bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-lg mx-2 md:mx-2 mb-2 md:mb-3 flex-shrink-0">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground leading-tight">Available Tokens</p>
                <p className="text-base md:text-lg font-bold mt-0.5 text-foreground">2,500</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">Used: 1,200 (48%)</p>
              </div>
              <div className="w-7 h-7 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-secondary" />
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <button className="w-full px-2 py-1 bg-secondary text-secondary-foreground rounded font-medium text-xs hover:bg-secondary/90 transition-smooth">
                Purchase
              </button>
              <button className="w-full px-2 py-1 border border-secondary/20 text-secondary rounded font-medium text-xs hover:bg-secondary/5 transition-smooth">
                Upgrade
              </button>
            </div>
          </div>

          <div className="p-2 md:p-3 border-t border-sidebar-border text-xs text-muted-foreground flex-shrink-0">
            <p className="leading-tight">© 2025 ContractSIG</p>
          </div>
        </div>
      </>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Mobile responsive */}
        <div className="h-14 md:h-16 border-b border-border bg-white flex items-center justify-between px-3 md:px-6 gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-smooth md:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-smooth hidden md:block"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="text-xs md:text-sm text-muted-foreground flex-1 text-right md:text-left">
            {navItems.find((item) => item.href === pathname || pathname.startsWith(item.href + "/"))?.label}
          </div>
        </div>

        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
