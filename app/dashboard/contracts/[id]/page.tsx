"use client"

import { ArrowLeft, Download, CheckCircle, AlertCircle, ExternalLink, FileText, HelpCircle, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ContractDetailPage({ params }) {
  const contractId = params.id
  const [activeTab, setActiveTab] = useState("overview")
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      message:
        "Hi! I'm here to help you understand this procurement opportunity. Ask me anything about the requirements, timeline, compliance, or bidding process.",
    },
  ])
  const [chatInput, setChatInput] = useState("")

  // Mock contract data
  const contract = {
    id: contractId,
    name: "Service Agreement - Acme Corp",
    source: "https://linkedin.com/in/acme",
    action: "Verify Opportunity",
    date: "2025-01-02",
    status: "verified",
    businessMatch: 95,
    bidDetails: {
      requestTitle: "Request for Bid (Open-Tender): WTE-0456 CS",
      department: "Water and Sanitation",
      bidDescription:
        "SUPPLY AND DELIVERY OF CCA PRESERVATIVE TREATED GUM POLES ON THE NAMAKWA REFURBISHMENT SCHEME IN THE NORTHERN CAPE PROVINCE FOR DWS CONSTRUCTION SOUTH.",
      location: "SPRINGBOK - STEINKOPF - SPRINGBOK",
      openingDate: "Monday, 5 Jan 2026",
      closingDate: "Thursday, 22 Jan 2026 11:00AM",
      modifiedDate: "Monday, 5 Jan 2026 3:40PM",
      contact: {
        name: "F. Ngwenya",
        email: "ngwenyaf@dws.gov.za",
        tel: "021-872-0591",
      },
      briefingSession: "NO",
      compulsoryBriefing: "NO",
      specialConditions: "N/A",
    },
    complianceIssues: [
      { text: "Tax ID verified", status: "verified" },
      { text: "Insurance premium active", status: "verified" },
      { text: "License renewal pending", status: "pending" },
    ],
    findings: {
      overview: "Strong business alignment with good compliance track record. Minor documentation pending.",
      strengths: [
        "Excellent payment history",
        "Strong financial position",
        "ISO 9001 certified",
        "Established for 8+ years",
      ],
      risks: [
        "License renewal due in 3 months",
        "Insurance policy expiring Q2 2025",
        "No international certifications",
      ],
    },
    documents: [
      { name: "Company Registration", type: "required", status: "attached", file: "company-reg.pdf" },
      { name: "Tax Certificate", type: "required", status: "attached", file: "tax-cert.pdf" },
      { name: "Insurance Certificate", type: "required", status: "missing", file: null },
      { name: "Business License", type: "required", status: "pending", file: null },
      { name: "ISO 9001 Certification", type: "optional", status: "attached", file: "iso-cert.pdf" },
      { name: "Previous Work References", type: "optional", status: "missing", file: null },
      { name: "Financial Statements", type: "required", status: "attached", file: "financials-2024.pdf" },
      { name: "Bid Bond/Security", type: "required", status: "missing", file: null },
    ],
    relatedOpportunities: [
      {
        id: "DOC-042",
        name: "Similar Service Agreement - TechStart Inc",
        match: "88%",
        source: "LinkedIn",
        sourceUrl: "https://linkedin.com",
        summary: "Technology services contract with similar compliance requirements. Successfully closed in 30 days.",
      },
      {
        id: "DOC-035",
        name: "Professional Services - Global Solutions",
        match: "85%",
        source: "Industry Email",
        sourceUrl: "https://example.com",
        summary: "Enterprise service agreement. Notable: Required additional insurance certification before signing.",
      },
    ],
    coverLetter: {
      subject: "Proposal: Service Agreement Enhancement",
      preview:
        "Dear Acme Corp Team,\n\nThank you for considering our services. We have reviewed your requirements and are confident in delivering a comprehensive solution that meets all your specifications...",
      file: "acme-cover-letter.pdf",
    },
    generatedLetter: {
      type: "Engagement Letter",
      content: "This engagement outlines the scope of services, deliverables, timeline, and terms of the agreement...",
      file: "engagement-letter-acme.pdf",
    },
  }

  const procurementTips = [
    {
      question: "What's a Bid Bond?",
      answer:
        "A bid bond is a financial guarantee that ensures you're serious about your bid. It's typically 2-5% of the bid value.",
    },
    {
      question: "How long does procurement take?",
      answer:
        "Government tenders typically take 30-60 days from opening to award. Private contracts vary between 14-45 days.",
    },
    {
      question: "What's due diligence?",
      answer:
        "The buyer verifies your company details, financial health, references, and compliance. Ensure all documents are current.",
    },
    {
      question: "When should I follow up?",
      answer:
        "Follow up after the closing date only if you're listed as a bidder. Unsolicited contact may disqualify your bid.",
    },
  ]

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { role: "user", message: chatInput }])
      // Simulate AI response
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            message: "I'm processing your question. This is a helpful response about your inquiry.",
          },
        ])
      }, 500)
      setChatInput("")
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contracts">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft size={18} className="text-foreground" />
            </button>
          </Link>
          <div>
            <h2 className="text-base font-semibold text-foreground">{contract.name}</h2>
            <p className="text-xs text-muted-foreground mt-1">ID: {contract.id}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
          Verified
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-border px-6 flex gap-8 sticky top-16 bg-background z-10 overflow-x-auto">
        {[
          { id: "overview", label: "Overview" },
          { id: "findings", label: "Findings" },
          { id: "documents", label: "Documents" },
          { id: "chat", label: "AI Chat" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-0 py-4 border-b-2 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === id
                ? "border-secondary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="p-6 space-y-6 max-w-4xl">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{contract.bidDetails.requestTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Department</p>
                  <p className="text-sm text-foreground mt-1">{contract.bidDetails.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Bid Description</p>
                  <p className="text-sm text-foreground mt-1">{contract.bidDetails.bidDescription}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Place where goods, works or services are required
                </p>
                <p className="text-sm text-foreground mt-1">{contract.bidDetails.location}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Opening Date</p>
                  <p className="text-sm text-foreground mt-1">{contract.bidDetails.openingDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Closing Date</p>
                  <p className="text-sm text-foreground mt-1">{contract.bidDetails.closingDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Modified Date</p>
                  <p className="text-sm text-foreground mt-1">{contract.bidDetails.modifiedDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Enquiries/Contact Person</p>
                  <p className="text-sm text-foreground mt-1">{contract.bidDetails.contact.name}</p>
                  <a
                    href={`mailto:${contract.bidDetails.contact.email}`}
                    className="text-xs text-secondary hover:underline"
                  >
                    {contract.bidDetails.contact.email}
                  </a>
                  <p className="text-xs text-foreground mt-1">Tel: {contract.bidDetails.contact.tel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Briefing Session</p>
                  <p className="text-sm text-foreground mt-1">{contract.bidDetails.briefingSession}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Compulsory Briefing</p>
                  <p className="text-sm text-foreground mt-1">{contract.bidDetails.compulsoryBriefing}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">Special Conditions</p>
                <p className="text-sm text-foreground mt-1">{contract.bidDetails.specialConditions}</p>
              </div>
            </div>

            {/* System-Generated Intelligence */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-4">System Generated Intelligence</h3>

              {/* Business Match */}
              <div className="bg-card border border-border rounded-lg p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">Business Profile Match</p>
                  <p className="text-lg font-bold text-secondary">{contract.businessMatch}%</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: `${contract.businessMatch}%` }} />
                </div>
              </div>

              {/* Compliance Status */}
              <div className="bg-card border border-border rounded-lg p-5">
                <p className="text-sm font-medium text-foreground mb-4">Compliance Status</p>
                <div className="space-y-3">
                  {contract.complianceIssues.map((issue, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {issue.status === "verified" ? (
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground">{issue.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Opportunities */}
            {contract.relatedOpportunities.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">Related Opportunities</h3>
                <div className="space-y-3">
                  {contract.relatedOpportunities.map((opp, idx) => (
                    <div
                      key={idx}
                      className="bg-card border border-border rounded-lg p-4 hover:border-secondary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{opp.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">{opp.source}</span>
                            <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
                              <ExternalLink size={12} className="text-secondary" />
                            </a>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-secondary px-2 py-1 bg-secondary/10 rounded">
                          {opp.match} match
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{opp.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "findings" && (
          <div className="p-6 space-y-4 max-w-4xl">
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Analysis Overview</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{contract.findings.overview}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <p className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={16} /> Strengths
                </p>
                <ul className="space-y-2">
                  {contract.findings.strengths.map((item, idx) => (
                    <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <p className="text-sm font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={16} /> Potential Risks
                </p>
                <ul className="space-y-2">
                  {contract.findings.risks.map((item, idx) => (
                    <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="p-6 space-y-4 max-w-4xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Document Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">File</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.documents.map((doc, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-muted-foreground" />
                          <span className="text-foreground font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            doc.type === "required" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {doc.type === "required" ? "Required" : "Optional"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {doc.status === "attached" && (
                          <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-green-700 text-xs font-medium">Attached</span>
                          </div>
                        )}
                        {doc.status === "missing" && (
                          <div className="flex items-center gap-2">
                            <AlertCircle size={14} className="text-red-500" />
                            <span className="text-red-700 text-xs font-medium">Missing</span>
                          </div>
                        )}
                        {doc.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <AlertCircle size={14} className="text-amber-500" />
                            <span className="text-amber-700 text-xs font-medium">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{doc.file || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        {doc.status === "attached" ? (
                          <button className="p-2 hover:bg-muted rounded transition-colors">
                            <Download size={14} className="text-secondary" />
                          </button>
                        ) : (
                          <button className="text-xs text-secondary hover:underline">Upload</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Documents Section */}
            <div className="pt-6 border-t border-border space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Generated Documents</h3>

              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">Cover Letter</p>
                  <button className="p-2 hover:bg-muted rounded transition-colors">
                    <Download size={16} className="text-secondary" />
                  </button>
                </div>
                <div className="bg-muted/30 rounded p-3 border border-border">
                  <p className="text-xs font-mono text-muted-foreground mb-2">{contract.coverLetter.subject}</p>
                  <p className="text-sm text-foreground line-clamp-3">{contract.coverLetter.preview}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="p-6 max-w-4xl space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {procurementTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-lg p-4 hover:border-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground mb-1">{tip.question}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tip.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-4 py-3 rounded-lg text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-foreground border border-border"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about compliance, timeline, or bidding..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-secondary/50 bg-background text-sm text-foreground placeholder-muted-foreground"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
