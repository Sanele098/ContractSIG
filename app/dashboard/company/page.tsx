"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  Edit2,
  Loader2,
  FileText,
  Upload,
  X,
  Check,
  AlertCircle,
  Building2,
  DollarSign,
  Users,
  Globe,
  MapPin,
  Phone,
  Mail,
  Download,
  Trash2,
  Sparkles,
} from "lucide-react"
import { getCompanyProfile, saveCompanyProfile } from "@/lib/supabase-helpers"
import { uploadDocument, getDocuments, deleteDocument } from "@/lib/document-helpers"

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState("")
  const [uploadingDocumentType, setUploadingDocumentType] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string>("")
  const [documentFiles, setDocumentFiles] = useState<{ [key: string]: any[] }>({})
  const [documentsLoaded, setDocumentsLoaded] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState<"coverLetter" | "businessPlan" | null>(null)

  const [companyProfile, setCompanyProfile] = useState({
    name: "",
    registrationNumber: "",
    industry: "",
    yearEstablished: new Date().getFullYear(),
    employees: 0,
    website: "",
    description: "",
    location: "",
    phone: "",
    email: "",
    taxId: "",
    businessType: "",
    yearsInOperation: 0,
    certifications: "",
    specializations: "",
  })

  const documents = documentFiles; // Declare the documents variable

  useEffect(() => {
    async function loadProfile() {
      const result = await getCompanyProfile()
      if (result.success && result.data) {
        setCompanyId(result.data.id)
        setCompanyProfile({
          name: result.data.name || "",
          registrationNumber: result.data.registration_number || "",
          industry: result.data.industry || "",
          yearEstablished: result.data.year_established || new Date().getFullYear(),
          employees: result.data.employees || 0,
          website: result.data.website || "",
          description: result.data.description || "",
          location: result.data.location || "",
          phone: result.data.phone || "",
          email: result.data.email || "",
          taxId: result.data.tax_id || "",
          businessType: result.data.business_type || "",
          yearsInOperation: result.data.years_in_operation || 0,
          certifications: result.data.certifications || "",
          specializations: result.data.specializations || "",
        })
      }
      setIsLoading(false)
    }
    loadProfile()
  }, [])

  // Load documents once on component mount
  useEffect(() => {
    async function loadDocuments() {
      const documentTypes = [
        "company_registration",
        "tax_certificate",
        "reference_letter",
        "industry_certificate",
        "partner_certificate",
        "cover_letter",
        "business_plan",
      ]

      const docs: { [key: string]: any[] } = {}
      for (const docType of documentTypes) {
        const result = await getDocuments(docType)
        if (result.success) {
          docs[docType] = result.data
        }
      }
      setDocumentFiles(docs)
      setDocumentsLoaded(true)
    }

    if (!documentsLoaded) {
      loadDocuments()
    }
  }, [documentsLoaded])

  const handleProfileChange = (field: string, value: any) => {
    setCompanyProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSaveMessage("")
    try {
      const result = await saveCompanyProfile(companyProfile)
      if (result.success) {
        setSaveMessage("Profile saved successfully!")
        setIsEditing(false)
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        setSaveMessage("Error saving profile.")
      }
    } catch (error) {
      setSaveMessage("Error saving profile.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) => {
    const file = e.target.files?.[0]
    if (!file || !companyId) return

    setUploadingDocumentType(documentType)
    try {
      const result = await uploadDocument(file, documentType, companyId)
      if (result.success) {
        setDocumentFiles((prev) => ({
          ...prev,
          [documentType]: [...(prev[documentType] || []), result.data],
        }))
        setSaveMessage(`${file.name} uploaded successfully!`)
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        setSaveMessage(result.error || "Failed to upload document")
      }
    } catch (error) {
      setSaveMessage("Error uploading document")
    } finally {
      setUploadingDocumentType(null)
      // Reset file input
      e.target.value = ""
    }
  }

  const handleDeleteDocument = async (documentId: string, filePath: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const result = await deleteDocument(documentId, filePath)
      if (result.success) {
        setDocumentFiles((prev) => ({
          ...prev,
          ...Object.keys(prev).reduce(
            (acc, key) => {
              acc[key] = prev[key].filter((doc: any) => doc.id !== documentId)
              return acc
            },
            {} as { [key: string]: any[] }
          ),
        }))
        setSaveMessage("Document deleted successfully!")
        setTimeout(() => setSaveMessage(""), 3000)
      } else {
        setSaveMessage("Failed to delete document")
      }
    } catch (error) {
      setSaveMessage("Error deleting document")
    }
  }

  const requiredFields = ["name", "registrationNumber", "industry", "employees", "description"]
  const filledRequiredFields = requiredFields.filter((field) => {
    const value = companyProfile[field as keyof typeof companyProfile]
    return value !== "" && value !== 0
  }).length
  const completionPercentage = Math.round((filledRequiredFields / requiredFields.length) * 100)

  const mandatoryDocuments = [
    { key: "company_registration", label: "Company Registration Certificate", required: true },
    { key: "tax_certificate", label: "Tax Certificate", required: true },
  ]

  const optionalDocuments = [
    { key: "reference_letter", label: "Reference Letters (from past contracts)" },
    { key: "industry_certificate", label: "Industry Regulation Certificates" },
    { key: "partner_certificate", label: "Partner/Reseller Certificates" },
  ]

  const renderDocumentUploadSection = (docType: string, label: string, required: boolean = false) => {
    const files = documentFiles[docType] || []
    const isUploading = uploadingDocumentType === docType

    return (
      <div key={docType} className="p-4 border border-border rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-medium flex items-center gap-2">
              {label}
              {required && <span className="text-red-500">*</span>}
            </p>
            {files.length > 0 && <p className="text-xs text-green-600 mt-1">✓ {files.length} document(s) uploaded</p>}
          </div>
        </div>

        {files.length > 0 && (
          <div className="mb-4 space-y-2">
            {files.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 bg-muted rounded text-sm"
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-500" />
                  <span>{file.file_name}</span>
                  <span className="text-xs text-muted-foreground">({(file.file_size / 1024).toFixed(1)} KB)</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={file.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-background rounded"
                    title="Download"
                  >
                    <Download size={14} />
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(file.id, file.file_path)}
                    className="p-1 hover:bg-red-900/20 rounded text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <label className="inline-flex items-center px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted cursor-pointer">
          <Upload size={14} className="mr-2" />
          {isUploading ? "Uploading..." : "Upload PDF"}
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload(e, docType)}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Company Profile</h1>
        <p className="text-muted-foreground">Manage your company information and documents for contract bidding</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {[
          { id: "profile", label: "Profile", icon: Building2 },
          { id: "documents", label: "Documents", icon: FileText },
          { id: "cover-letters", label: "Cover Letters", icon: Mail },
          { id: "business-plans", label: "Business Plans", icon: DollarSign },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === tab.id
                ? "border-secondary text-secondary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab - unchanged from before */}
      {activeTab === "profile" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{companyProfile.name || "Your Company"}</h2>
              <p className="text-sm text-muted-foreground">{companyProfile.industry || "Add your industry"}</p>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-muted rounded-lg">
              <Edit2 size={18} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium">Profile Completion</span>
              <span className="text-xs font-semibold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded h-2">
              <div className="bg-secondary h-2 rounded transition-all" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Building2 size={16} /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company Name *"
                    value={companyProfile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Industry *"
                    value={companyProfile.industry}
                    onChange={(e) => handleProfileChange("industry", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Registration Number *"
                    value={companyProfile.registrationNumber}
                    onChange={(e) => handleProfileChange("registrationNumber", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Tax ID"
                    value={companyProfile.taxId}
                    onChange={(e) => handleProfileChange("taxId", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Business Type"
                    value={companyProfile.businessType}
                    onChange={(e) => handleProfileChange("businessType", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Year Established"
                    value={companyProfile.yearEstablished}
                    onChange={(e) => handleProfileChange("yearEstablished", parseInt(e.target.value) || 0)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                </div>
              </div>

              {/* Operations Information */}
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Users size={16} /> Operations Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Number of Employees *"
                    value={companyProfile.employees}
                    onChange={(e) => handleProfileChange("employees", parseInt(e.target.value) || 0)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Years in Operation"
                    value={companyProfile.yearsInOperation}
                    onChange={(e) => handleProfileChange("yearsInOperation", parseInt(e.target.value) || 0)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Globe size={16} /> Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Website"
                    value={companyProfile.website}
                    onChange={(e) => handleProfileChange("website", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={companyProfile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={companyProfile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={companyProfile.location}
                    onChange={(e) => handleProfileChange("location", e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Certifications</label>
                    <textarea
                      placeholder="List any relevant certifications (ISO, etc.)"
                      value={companyProfile.certifications}
                      onChange={(e) => handleProfileChange("certifications", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Specializations</label>
                    <textarea
                      placeholder="What are your company's specializations?"
                      value={companyProfile.specializations}
                      onChange={(e) => handleProfileChange("specializations", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Company Description *</label>
                    <textarea
                      placeholder="Provide a comprehensive description of your company, its strengths, and bidding capabilities..."
                      value={companyProfile.description}
                      onChange={(e) => handleProfileChange("description", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  Cancel
                </button>
                {saveMessage && <span className="text-sm flex items-center">{saveMessage}</span>}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Company</p>
                  <p className="font-medium">{companyProfile.name || "—"}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Industry</p>
                  <p className="font-medium">{companyProfile.industry || "—"}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Employees</p>
                  <p className="font-medium">{companyProfile.employees || "—"}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Registration #</p>
                  <p className="font-medium">{companyProfile.registrationNumber || "—"}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Year Established</p>
                  <p className="font-medium">{companyProfile.yearEstablished || "—"}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{companyProfile.location || "—"}</p>
                </div>
              </div>

              {companyProfile.description && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">About</p>
                  <p className="text-sm">{companyProfile.description}</p>
                </div>
              )}

              {companyProfile.specializations && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Specializations</p>
                  <p className="text-sm">{companyProfile.specializations}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* Mandatory Documents */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
              <AlertCircle size={18} />
              Required Documents
            </h3>
            <div className="space-y-4">
              {mandatoryDocuments.map((doc) => renderDocumentUploadSection(doc.key, doc.label, doc.required))}
            </div>
          </div>

          {/* Optional Documents */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Optional Documents</h3>
            <div className="space-y-4">
              {optionalDocuments.map((doc) => renderDocumentUploadSection(doc.key, doc.label, false))}
            </div>
          </div>

          {saveMessage && (
            <div className={`p-4 rounded-lg ${saveMessage.includes("success") ? "bg-green-900/20 text-green-200" : "bg-red-900/20 text-red-200"}`}>
              {saveMessage}
            </div>
          )}
        </div>
      )}

      {/* Cover Letters Tab */}
      {activeTab === "cover-letters" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-6">Cover Letter</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You can either generate a cover letter using AI or upload your own PDF (1 page max).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* AI Generation Option */}
              <button
                onClick={() => setShowAIDialog("coverLetter")}
                className="p-6 border-2 border-dashed border-secondary rounded-lg hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"
              >
                <Sparkles size={32} className="text-secondary" />
                <div className="text-center">
                  <p className="font-semibold">Generate with AI</p>
                  <p className="text-xs text-muted-foreground">AI will create a tailored cover letter</p>
                  <span className="text-xs text-amber-600 mt-2 block">(Coming Soon)</span>
                </div>
              </button>

              {/* Upload Option */}
              <label className="p-6 border-2 border-dashed border-border rounded-lg hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer">
                <Upload size={32} className="text-muted-foreground" />
                <div className="text-center">
                  <p className="font-semibold">Upload PDF</p>
                  <p className="text-xs text-muted-foreground">Single page PDF file (max 5MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, "cover_letter")}
                  disabled={uploadingDocumentType === "cover_letter"}
                  className="hidden"
                />
              </label>
            </div>

            {/* Display uploaded cover letters */}
            {(documentFiles["cover_letter"] || []).length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-medium mb-3">Uploaded Cover Letters</p>
                <div className="space-y-2">
                  {documentFiles["cover_letter"].map((file: any) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-muted rounded"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" />
                        <span className="text-sm">{file.file_name}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={file.publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-background rounded"
                        >
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => handleDeleteDocument(file.id, file.file_path)}
                          className="p-1 hover:bg-red-900/20 rounded text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {saveMessage && (
              <div
                className={`mt-4 p-4 rounded-lg ${saveMessage.includes("success") ? "bg-green-900/20 text-green-200" : "bg-red-900/20 text-red-200"}`}
              >
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Business Plans Tab */}
      {activeTab === "business-plans" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-6">Business Plan / Proposal</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You can either generate a business plan using AI or upload your own PDF (1 page max).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* AI Generation Option */}
              <button
                onClick={() => setShowAIDialog("businessPlan")}
                className="p-6 border-2 border-dashed border-secondary rounded-lg hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3"
              >
                <Sparkles size={32} className="text-secondary" />
                <div className="text-center">
                  <p className="font-semibold">Generate with AI</p>
                  <p className="text-xs text-muted-foreground">AI will create a tailored business plan</p>
                  <span className="text-xs text-amber-600 mt-2 block">(Coming Soon)</span>
                </div>
              </button>

              {/* Upload Option */}
              <label className="p-6 border-2 border-dashed border-border rounded-lg hover:bg-muted transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer">
                <Upload size={32} className="text-muted-foreground" />
                <div className="text-center">
                  <p className="font-semibold">Upload PDF</p>
                  <p className="text-xs text-muted-foreground">Single page PDF file (max 5MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e, "business_plan")}
                  disabled={uploadingDocumentType === "business_plan"}
                  className="hidden"
                />
              </label>
            </div>

            {/* Display uploaded business plans */}
            {(documentFiles["business_plan"] || []).length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-medium mb-3">Uploaded Business Plans</p>
                <div className="space-y-2">
                  {documentFiles["business_plan"].map((file: any) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-muted rounded"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" />
                        <span className="text-sm">{file.file_name}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={file.publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-background rounded"
                        >
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => handleDeleteDocument(file.id, file.file_path)}
                          className="p-1 hover:bg-red-900/20 rounded text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {saveMessage && (
              <div
                className={`mt-4 p-4 rounded-lg ${saveMessage.includes("success") ? "bg-green-900/20 text-green-200" : "bg-red-900/20 text-red-200"}`}
              >
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
