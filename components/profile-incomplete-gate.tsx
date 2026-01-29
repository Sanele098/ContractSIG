"use client"

import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight } from "lucide-react"

interface ProfileIncompleteGateProps {
  percentage?: number
  missingItems?: string[]
  isComplete?: boolean
}

export function ProfileIncompleteGate({
  percentage = 0,
  missingItems = [],
  isComplete = false,
}: ProfileIncompleteGateProps) {
  const router = useRouter()

  if (isComplete) return null

  return (
    <div className="h-full flex items-center justify-center bg-background p-4 md:p-8">
      <div className="max-w-md w-full bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-amber-600" />
          </div>
        </div>

        {/* Title and Message */}
        <div>
          <h2 className="text-xl font-semibold text-amber-900 mb-2">Complete Your Profile</h2>
          <p className="text-sm text-amber-800">
            Finish setting up your company profile to unlock all features and create bidding packages.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-amber-900">Profile Completion</span>
            <span className="text-sm font-bold text-amber-700">{percentage}%</span>
          </div>
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {/* Missing Items */}
        {missingItems.length > 0 && (
          <div className="text-left bg-white/50 rounded-lg p-3 space-y-1">
            <p className="text-xs font-medium text-amber-900">Missing Items:</p>
            <ul className="text-xs text-amber-800 space-y-0.5">
              {missingItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => router.push("/dashboard/company")}
          className="w-full px-4 py-3 bg-secondary/40 text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium text-sm flex items-center justify-center gap-2 group"
        >
          Complete Profile
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Info Text */}
        <p className="text-xs text-amber-700">
          This ensures all compliance documents and business information are accurate and up-to-date.
        </p>
      </div>
    </div>
  )
}
