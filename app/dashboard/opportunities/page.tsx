"use client"

import { FileText, Search, Plus, AlertCircle, CheckCircle, Loader2, Upload, LinkIcon, Mail, FileUp } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OpportunitiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputMethod, setInputMethod] = useState("url")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState({ input: "" })

  const opportunities = []

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp._id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || opp.stage === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleUpload = async (e) => {
    e.preventDefault()
    setIsAnalyzing(true)
    try {
      // TODO: Connect to Convex mutation once API is auto-generated
      setFormData({ input: "" })
      setIsModalOpen(false)
    } catch (error) {
      console.error("[v0] Error creating opportunity:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRowClick = (oppId) => {
    router.push(`/dashboard/opportunities/${oppId}`)
  }

  const handleProcessToContract = (oppId) => {
    router.push(`/dashboard/contracts/${oppId}`)
  }

  const getStageIcon = (stage) => {
    if (stage === "verified") return <CheckCircle size={14} className="text-green-600" />
    if (stage === "failed") return <AlertCircle size={14} className="text-red-600" />
    return <Loader2 size={14} className="text-blue-600 animate-spin" />
  }

  const getStageColor = (stage) => {
    switch (stage) {
      case "verified":
        return "bg-green-50 text-green-700 border border-green-200"
      case "failed":
        return "bg-red-50 text-red-700 border border-red-200"
      case "analyzing":
        return "bg-blue-50 text-blue-700 border border-blue-200"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Workflow Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg m-4 p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm space-y-2">
              <p className="font-semibold text-amber-900">Opportunity Verification Only</p>
              <p className="text-amber-800">
                We can verify and analyze opportunities immediately. However,{" "}
                <span className="font-medium">
                  bidding packages cannot be generated until your company profile is 100% complete
                </span>
                . This ensures all compliance documents and business information are current and accurate.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/company")}
            className="flex-shrink-0 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md font-medium text-xs transition-colors border border-amber-300 whitespace-nowrap"
          >
            Complete Profile
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Opportunities</h2>
          <p className="text-xs text-muted-foreground mt-1">Ingest, verify, and bid on opportunities</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-xs font-medium"
          >
            <Plus size={16} />
            New Opportunity
          </button>
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search opportunities..."
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
            <option value="all">All Stages</option>
            <option value="analyzing">Analyzing</option>
            <option value="verified">Verified</option>
            <option value="failed">Failed</option>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Opportunity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Stage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Company Match</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Compliance Issues</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Confidence</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Deadline</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.map((opp) => (
                  <tr key={opp._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{opp._id}</td>
                    <td
                      className="px-4 py-3 flex items-center gap-2 min-w-0 cursor-pointer"
                      onClick={() => handleRowClick(opp._id)}
                    >
                      <FileText size={14} className="text-secondary flex-shrink-0" />
                      <span className="text-xs text-foreground truncate hover:underline">{opp.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${getStageColor(opp.stage)}`}
                      >
                        {getStageIcon(opp.stage)}
                        {opp.stage.charAt(0).toUpperCase() + opp.stage.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {opp.companyMatch ? (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle size={12} /> Match
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle size={12} /> Mismatch
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">
                      {opp.complianceIssues > 0
                        ? `${opp.complianceIssues} issue${opp.complianceIssues > 1 ? "s" : ""}`
                        : "None"}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground font-medium">{opp.confidence}%</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{opp.deadline}</td>
                    <td className="px-4 py-3">
                      {opp.stage === "verified" && (
                        <button
                          onClick={() => handleProcessToContract(opp._id)}
                          className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors font-medium"
                        >
                          → Contract
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOpportunities.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <FileText size={32} className="text-muted-foreground mb-2 opacity-30" />
              <p className="text-xs font-medium text-foreground">No opportunities found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Add New Opportunity</h3>
              <p className="text-xs text-muted-foreground mt-1">Ingest opportunity from multiple sources</p>
            </div>

            {/* Input Method Selector */}
            <div className="p-4 border-b border-border space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "url", label: "URL", icon: LinkIcon },
                  { id: "email", label: "Email", icon: Mail },
                  { id: "text", label: "Text", icon: FileText },
                  { id: "document", label: "Document", icon: FileUp },
                ].map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => setInputMethod(method.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        inputMethod === method.id
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-border text-foreground hover:border-secondary/50"
                      }`}
                    >
                      <Icon size={14} />
                      {method.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleUpload} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  {inputMethod === "url" && "Opportunity URL or Link"}
                  {inputMethod === "email" && "Paste Email Content"}
                  {inputMethod === "text" && "Paste Opportunity Text"}
                  {inputMethod === "document" && "Upload Document (PDF/DOCX)"}
                </label>
                {inputMethod === "document" ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-secondary/50 transition-colors">
                    <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                ) : (
                  <textarea
                    placeholder={inputMethod === "url" ? "https://tender.gov.za/..." : "Paste your content here..."}
                    value={formData.input}
                    onChange={(e) => setFormData({ input: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary/50 bg-card text-xs min-h-24 resize-none"
                    required
                  />
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg hover:bg-secondary/90 font-medium text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Verify & Analyze"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isAnalyzing}
                  className="flex-1 border border-border text-foreground py-2 rounded-lg hover:bg-muted/50 text-xs disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
