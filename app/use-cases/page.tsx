"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, FileText, Calculator, Users, CheckSquare, TrendingUp } from "lucide-react"

export default function UseCasesPage() {
  const useCases = [
    {
      id: 1,
      title: "Opportunity Verification",
      icon: Search,
      description: "Instantly verify if an opportunity is legitimate and matches your business",
      features: ["AI legitimacy checks", "Requirements matching", "Compliance gaps"],
    },
    {
      id: 2,
      title: "Bid Generation",
      icon: FileText,
      description: "Generate compliant bid documents in minutes",
      features: ["Auto-populated letters", "Compliance submissions", "Professional templates"],
    },
    {
      id: 3,
      title: "Smart Pricing",
      icon: Calculator,
      description: "Calculate accurate bids with confidence",
      features: ["Cost breakdown", "Inflation adjustments", "Profit modeling"],
    },
    {
      id: 4,
      title: "Team Collaboration",
      icon: Users,
      description: "Centralize your bidding process",
      features: ["Unified pipeline", "Role-based access", "Bid tracking"],
    },
    {
      id: 5,
      title: "Compliance Management",
      icon: CheckSquare,
      description: "Keep all documents current",
      features: ["Document tracking", "Certification mgmt", "Auto-compliance"],
    },
    {
      id: 6,
      title: "Market Intelligence",
      icon: TrendingUp,
      description: "Access market trend insights",
      features: ["Industry benchmarking", "Bid data", "Competitive positioning"],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2 font-bold text-sm md:text-base">
            ContractSIG
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-xs">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-8 md:py-12 bg-muted/5">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">How ContractSIG Powers Your Business</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Six core capabilities that work together to transform how you win contracts
            </p>
          </div>
        </section>

        {/* Use Cases Grid with Radial Concept */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            {/* Center Hub */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-white font-bold text-center">
                <div>
                  <div>Contract</div>
                  <div>SIG</div>
                </div>
              </div>
            </div>

            {/* Use Cases Grid - 2 rows of 3 */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {useCases.map((useCase) => {
                const Icon = useCase.icon
                return (
                  <div
                    key={useCase.id}
                    className="relative border border-secondary/30 rounded-lg p-4 bg-secondary/5 hover:bg-secondary/10 transition-colors"
                  >
                    {/* Connector line to center (visual effect) */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-secondary/20 to-transparent"></div>

                    {/* Icon */}
                    <div className="flex justify-center mb-3">
                      <div className="p-2 bg-secondary/20 rounded-full">
                        <Icon className="h-4 w-4 text-secondary" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-center mb-2">{useCase.title}</h3>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground text-center mb-3">{useCase.description}</p>

                    {/* Features */}
                    <ul className="space-y-1">
                      {useCase.features.map((feature, i) => (
                        <li key={i} className="text-xs text-foreground flex gap-2 items-start">
                          <span className="text-secondary flex-shrink-0 mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-primary/5 border-t mt-8">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Ready to Win More Contracts?</h2>
            <p className="text-xs md:text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
              Experience how ContractSIG helps businesses win the right opportunities faster.
            </p>
            <Link href="/dashboard">
              <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs">
                Start Free Trial
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center text-xs text-muted-foreground">
          <p>© 2025 ContractSIG. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
