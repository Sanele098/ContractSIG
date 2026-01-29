"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Volume2, HelpCircle, Shield, Clock, FileCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConsultationPage() {
  const [isInCall, setIsInCall] = useState(false)
  const [callMode, setCallMode] = useState<"chat" | "voice">("chat")
  const [messages, setMessages] = useState<Array<{ type: "user" | "assistant"; text: string }>>([
    {
      type: "assistant",
      text: "Hello! I'm here to help you with contract bidding strategies, compliance requirements, timeline planning, and more. How can I assist you today?",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [callTime, setCallTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)

  // Timer for call duration
  useEffect(() => {
    if (!isInCall) return
    const timer = setInterval(() => setCallTime((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [isInCall])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    setMessages((prev) => [
      ...prev,
      { type: "user", text: inputValue },
      {
        type: "assistant",
        text: "Thank you for that question. How else can I assist you?",
      },
    ])
    setInputValue("")
  }

  const startCall = (mode: "chat" | "voice") => {
    setCallMode(mode)
    setIsInCall(true)
    setCallTime(0)
    setMessages([
      {
        type: "assistant",
        text: "Hello! I'm here to help you with contract bidding strategies, compliance requirements, timeline planning, and more. How can I assist you today?",
      },
    ])
  }

  const endCall = () => {
    setIsInCall(false)
    setShowTranscript(false)
  }

  // Landing Page
  if (!isInCall) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-50 p-8">
        <div className="max-w-2xl mx-auto pt-12">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm text-secondary mb-1">Contract Specialist</p>
            <h1 className="text-3xl font-medium text-foreground mb-1">Hello there</h1>
            <p className="text-sm text-muted-foreground">How can I help you today?</p>
          </div>

          {/* Suggestion Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Card 1: Bidding Strategy */}
            <button
              onClick={() => startCall("chat")}
              className="group p-4 bg-white border border-border rounded-lg hover:border-secondary/30 hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-secondary/10 group-hover:bg-secondary/15 transition-colors flex-shrink-0">
                  <FileCheck size={16} className="text-secondary" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground mb-0.5">Bidding Strategy</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Guidance on winning bids</p>
                </div>
              </div>
            </button>

            {/* Card 2: Compliance */}
            <button
              onClick={() => startCall("chat")}
              className="group p-4 bg-white border border-border rounded-lg hover:border-secondary/30 hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-secondary/10 group-hover:bg-secondary/15 transition-colors flex-shrink-0">
                  <Shield size={16} className="text-secondary" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground mb-0.5">Compliance</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Regulatory requirements</p>
                </div>
              </div>
            </button>

            {/* Card 3: Timeline Planning */}
            <button
              onClick={() => startCall("chat")}
              className="group p-4 bg-white border border-border rounded-lg hover:border-secondary/30 hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-secondary/10 group-hover:bg-secondary/15 transition-colors flex-shrink-0">
                  <Clock size={16} className="text-secondary" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground mb-0.5">Timeline Planning</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Deadline management</p>
                </div>
              </div>
            </button>

            {/* Card 4: General Questions */}
            <button
              onClick={() => startCall("chat")}
              className="group p-4 bg-white border border-border rounded-lg hover:border-secondary/30 hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-secondary/10 group-hover:bg-secondary/15 transition-colors flex-shrink-0">
                  <HelpCircle size={16} className="text-secondary" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground mb-0.5">General Questions</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Ask anything about contracts</p>
                </div>
              </div>
            </button>
          </div>

          {/* Or start voice */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground mb-3">Or start with voice consultation</p>
            <button
              onClick={() => startCall("voice")}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/15 text-secondary transition-colors text-sm font-medium"
            >
              <Volume2 size={16} />
              Start Voice Call
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Active Call Page
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-50">
      {/* Header */}
      <div className="border-b border-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center">
              {callMode === "chat" ? (
                <MessageSquare size={14} className="text-secondary" strokeWidth={2} />
              ) : (
                <Volume2 size={14} className="text-secondary" strokeWidth={2} />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">
                {callMode === "chat" ? "Chat Consultation" : "Voice Consultation"}
              </p>
              <p className="text-xs text-muted-foreground">{formatTime(callTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-xs text-secondary hover:text-secondary/80 transition-colors"
            >
              {showTranscript ? "Hide" : "Show"} Transcript
            </button>
            <button
              onClick={endCall}
              className="px-3 py-1.5 text-xs bg-destructive hover:bg-destructive/90 text-white rounded-md transition-colors"
            >
              End Call
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 max-w-4xl mx-auto w-full px-8 py-6">
        {/* Chat/Voice Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {callMode === "chat" ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-xs leading-relaxed ${
                        msg.type === "user"
                          ? "bg-secondary/15 text-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-white text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary/30"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-3 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg transition-colors text-xs font-medium"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            // Voice Mode
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center mb-3 animate-pulse">
                <Volume2 size={24} className="text-secondary" strokeWidth={1.5} />
              </div>
              <p className="text-xs text-foreground font-medium mb-1">Listening...</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Speak your question about contracts, bidding, or compliance
              </p>
            </div>
          )}
        </div>

        {/* Transcript Sidebar */}
        {showTranscript && (
          <div className="w-64 border-l border-border pl-6 overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-foreground sticky top-0 bg-gradient-to-b from-slate-50">
                Conversation Transcript
              </h3>
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-xs font-medium text-secondary capitalize">{msg.type}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
