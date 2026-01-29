"use client"

import { FileText, Search, ExternalLink, CheckCircle, AlertTriangle, Download } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileIncompleteGate } from "@/components/profile-incomplete-gate"
import { isCompanyProfileComplete } from "@/lib/supabase-helpers"

export default function ContractsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated and profile is complete on mount
  useEffect(() => {
    async function checkProfile() {
      const result = await isCompanyProfileComplete()
      setIsAuthenticated(result.authenticated)
      setIsProfileComplete(result.complete)
      setIsLoading(false)
    }
    checkProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <div className="rounded-lg border border-border bg-muted p-8">
          <h2 className="text-2xl font-bold mb-2">Sign in required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to access contracts.</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  if (!isProfileComplete) {
    return <ProfileIncompleteGate isComplete={false} />
  }

  const contracts = []

  if (!isProfileComplete) {
    return <ProfileIncompleteGate isComplete={false} />
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract._id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || contract.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleRowClick = (contractId) => {
    router.push(`/dashboard/contracts/${contractId}`)
  }

  const handleDownloadBid = (filename) => {
    console.log("[v0] Downloading:", filename)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "bid-generated":
        return "bg-green-50 text-green-700 border border-green-200"
      case "generating":
        return "bg-blue-50 text-blue-700 border border-blue-200"
      case "compliance-review":
        return "bg-amber-50 text-amber-700 border border-amber-200"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Contracts & Bids</h2>
          <p className="text-xs text-muted-foreground mt-1">Verified opportunities with generated bid documents</p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary/50 bg-card text-xs"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary/50 bg-card text-xs"
          >
            <option value="all">All Status</option>
            <option value="bid-generated">Bid Generated</option>
            <option value="generating">Generating</option>
            <option value="compliance-review">Compliance Review</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="border border-border rounded-lg overflow-hidden flex flex-col h-full">
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30 sticky top-0">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Contract Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Compliance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Deadline</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Bid Document</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract) => (
                  <tr key={contract._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{contract._id}</td>
                    <td
                      className="px-4 py-3 flex items-center gap-2 min-w-0 cursor-pointer"
                      onClick={() => handleRowClick(contract._id)}
                    >
                      <FileText size={14} className="text-secondary flex-shrink-0" />
                      <span className="text-xs text-foreground truncate hover:underline">{contract.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={contract.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-secondary hover:underline flex items-center gap-1 w-fit"
                      >
                        Open <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">{contract.value}</td>
                    <td className="px-4 py-3">
                      {contract.complianceStatus === "compliant" ? (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle size={12} /> Compliant
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                          <AlertTriangle size={12} /> Review
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status.replace("-", " ").charAt(0).toUpperCase() +
                          contract.status.replace("-", " ").slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{contract.deadline}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDownloadBid(contract.bidDocument)}
                        className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors flex items-center gap-1"
                      >
                        <Download size={12} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredContracts.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <FileText size={32} className="text-muted-foreground mb-2 opacity-30" />
              <p className="text-xs font-medium text-foreground">No contracts found</p>
              <p className="text-xs text-muted-foreground mt-1">Verify opportunities to generate bid contracts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
