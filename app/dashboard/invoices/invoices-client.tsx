"use client"

import { Receipt, Search, Download, Eye, Plus, TrendingUp } from "lucide-react"
import { useState } from "react"
import { ProfileIncompleteGate } from "@/components/profile-incomplete-gate"

export default function InvoicesClient() {
  const [searchTerm, setSearchTerm] = useState("")

  const invoices = []
  const isProfileComplete = false

  if (!isProfileComplete) {
    return <ProfileIncompleteGate isComplete={false} />
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700"
      case "pending":
        return "bg-amber-50 text-amber-700"
      case "overdue":
        return "bg-red-50 text-red-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const stats = [
    { label: "Total Revenue", value: "$0", change: "+0% this month", icon: TrendingUp },
    { label: "Pending", value: "0", change: "$0", icon: Receipt },
  ]

  return (
    <div className="h-full flex flex-col bg-background overflow-auto">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-foreground">Invoices</h1>
            <p className="text-xs text-muted-foreground mt-1">Manage billing and payment tracking</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-smooth text-xs md:text-sm font-medium">
            <Plus size={16} />
            New Invoice
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-base md:text-lg font-semibold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-secondary flex-shrink-0">
                    <Icon size={16} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary/50 bg-card text-xs md:text-sm"
          />
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-foreground">Invoice ID</th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-foreground hidden sm:table-cell">
                    Client
                  </th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-foreground">Amount</th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                  <th className="px-3 md:px-4 py-3 text-left text-xs font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <p className="text-xs text-muted-foreground">No invoices found</p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm font-mono text-muted-foreground">
                        {invoice._id}
                      </td>
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-foreground hidden sm:table-cell truncate">
                        {invoice.client}
                      </td>
                      <td className="px-3 md:px-4 py-3 text-xs md:text-sm font-semibold text-foreground">
                        {invoice.amount}
                      </td>
                      <td className="px-3 md:px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(invoice.status)}`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 py-3 flex gap-1">
                        <button className="p-1.5 hover:bg-muted rounded transition-colors">
                          <Eye size={14} className="text-secondary" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded transition-colors">
                          <Download size={14} className="text-secondary" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
