"use client"

import { useState } from "react"
import { Plus, Shield, Users } from "lucide-react"

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const team = [] // Empty array - data will come from Convex database

  const roleDescriptions = {
    Owner: "Full access to all features and team management",
    "Bid Manager": "Can create and manage bids, upload documents",
    "Compliance Officer": "Can review documents and verify compliance",
    Viewer: "Read-only access to contracts and documents",
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-auto">
      <div className="p-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">Team Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Invite team members to collaborate on bid qualification</p>
        </div>

        {team.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-12 text-center max-w-md w-full">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-secondary" size={32} />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Invite Your Team</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Collaborate with team members on bid qualification and document management.
              </p>
              <button
                onClick={() => setShowInviteModal(true)}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus size={18} />
                Invite First Member
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Team Members Grid */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus size={18} />
                Invite Member
              </button>
            </div>

            <div className="grid gap-4">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="bg-card border border-border rounded-lg p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-secondary">{member.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          member.status === "active" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {member.status === "active" ? "Active" : "Pending"}
                      </span>
                      {/* <MoreVertical size={16} className="text-muted-foreground" /> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Role</p>
                      <p className="text-sm font-medium text-foreground">{member.role}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Join Date</p>
                      <p className="text-sm font-medium text-foreground">{member.joinDate || "Pending"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Status</p>
                      <p className="text-sm font-medium text-foreground capitalize">{member.status}</p>
                    </div>
                  </div>

                  {member.permissions && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Permissions</p>
                      <div className="flex flex-wrap gap-2">
                        {member.permissions.map((perm, idx) => (
                          <span key={idx} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
                      Edit Role
                    </button>
                    {member.status === "pending" && (
                      <button className="px-3 py-1 text-xs hover:bg-muted rounded transition-colors">
                        Resend Invite
                      </button>
                    )}
                    {member.id !== 1 && (
                      <button className="px-3 py-1 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Role Information */}
        <div className="pt-8 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Available Roles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(roleDescriptions).map(([role, description]) => (
              <div key={role} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-secondary" />
                  <h3 className="font-semibold text-foreground text-sm">{role}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Invite Team Member</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 hover:bg-muted rounded transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-secondary/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Role</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-secondary/50">
                  <option>Bid Manager</option>
                  <option>Compliance Officer</option>
                  <option>Viewer</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors">
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
