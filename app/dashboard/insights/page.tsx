"use client"

import { useState } from "react"
import { Send, MessageCircle, TrendingUp, Lightbulb, Users } from "lucide-react"

export default function BusinessInsights() {
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to Business Insights. I'm here to help you discuss your company strategy, market positioning, growth opportunities, and operational improvements. What would you like to explore today?",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: inputValue,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content:
          "This is a placeholder response. In production, this would connect to your AI backend to provide intelligent business insights and recommendations tailored to your company profile and industry.",
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 md:p-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Business Insights</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Discuss strategy, improvements, and opportunities for your business
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb size={24} className="text-secondary" />
            </div>
          </div>

          {/* Quick Topics */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { icon: TrendingUp, label: "Market Trends" },
              { icon: Users, label: "Team Structure" },
              { icon: MessageCircle, label: "Growth Strategy" },
              { icon: Lightbulb, label: "Best Practices" },
            ].map((topic, index) => {
              const Icon = topic.icon
              return (
                <button
                  key={index}
                  onClick={() => setInputValue(`Tell me about ${topic.label.toLowerCase()}`)}
                  className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm bg-muted/50 hover:bg-muted/80 rounded-lg transition-colors text-foreground font-medium"
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{topic.label}</span>
                  <span className="sm:hidden">{topic.label.split(" ")[0]}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={16} className="text-secondary" />
                </div>
              )}
              <div
                className={`max-w-md md:max-w-2xl px-4 py-3 rounded-lg text-sm ${
                  message.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted/50 text-foreground border border-border"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle size={16} className="text-secondary animate-pulse" />
              </div>
              <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 md:p-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about your business, strategy, improvements..."
              className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2"
            >
              <Send size={16} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
