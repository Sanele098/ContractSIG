"use client"

import Link from "next/link"
import { TrendingUp, CheckCircle, ClipboardList, FileText, Building2, Users, Zap } from "lucide-react"

export default function DashboardHome() {
  const stats = [
    {
      label: "Active Opportunities",
      value: "0",
      change: "+3 this week",
      icon: ClipboardList,
      color: "text-blue-600",
      href: "/dashboard/opportunities?status=active",
    },
    {
      label: "Qualified Bids",
      value: "0",
      change: "66% success rate",
      icon: CheckCircle,
      color: "text-green-600",
      href: "/dashboard/contracts?status=qualified",
    },
    {
      label: "Documents Ready",
      value: "0",
      change: "Auto-generated",
      icon: FileText,
      color: "text-purple-600",
      href: "/dashboard/company",
    },
    {
      label: "This Month",
      value: "0",
      change: "Bid packages created",
      icon: TrendingUp,
      color: "text-emerald-600",
      href: "/dashboard/contracts",
    },
  ]

  return (
    <div className="h-full flex flex-col bg-background overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">Opportunity Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">AI-powered bid qualification and document automation</p>
        </div>

        {/* Industry Insights Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Zap size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm space-y-2">
                <p className="font-semibold text-amber-900">Targeted Industry Insights</p>
                <p className="text-amber-800">
                  We want to show you the latest trends and opportunities in your industry. To provide accurate
                  insights,
                  <span className="font-medium">
                    {" "}
                    please complete your company profile with your industry and focus areas
                  </span>
                  .
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/company"
              className="flex-shrink-0 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md font-medium text-xs transition-colors border border-amber-300 whitespace-nowrap"
            >
              Complete Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.label} href={stat.href} className="group">
                <div className="bg-card border border-border rounded-lg p-4 hover:border-secondary/50 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-lg font-semibold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-8 h-8 bg-muted rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon size={16} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href="/dashboard/opportunities"
            className="group p-3 bg-card border border-border rounded-lg hover:border-secondary/50 hover:shadow-sm transition-all"
          >
            <div className="w-8 h-8 bg-secondary/10 rounded-md flex items-center justify-center mb-2 group-hover:bg-secondary/20 transition-smooth">
              <FileText className="text-secondary" size={16} />
            </div>
            <h3 className="text-xs font-medium text-foreground">Opportunities</h3>
            <p className="text-xs text-muted-foreground">Verify & bid</p>
          </Link>

          <Link
            href="/dashboard/company"
            className="group p-3 bg-card border border-border rounded-lg hover:border-secondary/50 hover:shadow-sm transition-all"
          >
            <div className="w-8 h-8 bg-secondary/10 rounded-md flex items-center justify-center mb-2 group-hover:bg-secondary/20 transition-smooth">
              <Building2 className="text-secondary" size={16} />
            </div>
            <h3 className="text-xs font-medium text-foreground">Company</h3>
            <p className="text-xs text-muted-foreground">Profile & docs</p>
          </Link>

          <Link
            href="/dashboard/team"
            className="group p-3 bg-card border border-border rounded-lg hover:border-secondary/50 hover:shadow-sm transition-all"
          >
            <div className="w-8 h-8 bg-secondary/10 rounded-md flex items-center justify-center mb-2 group-hover:bg-secondary/20 transition-smooth">
              <Users className="text-secondary" size={16} />
            </div>
            <h3 className="text-xs font-medium text-foreground">Team</h3>
            <p className="text-xs text-muted-foreground">Manage access</p>
          </Link>
        </div>

        {/* Tip */}
        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 flex gap-3">
          <TrendingUp className="text-secondary flex-shrink-0" size={18} />
          <div className="flex-1">
            <h3 className="font-medium text-foreground text-xs mb-0.5">Get Started in 3 Steps</h3>
            <p className="text-xs text-muted-foreground">
              1) Complete your company profile, 2) Paste a contract opportunity, 3) Get AI-powered bid recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
