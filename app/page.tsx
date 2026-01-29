"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ShieldCheck,
  Clock,
  Users,
  ArrowRight,
  FileCheck,
  ChevronDown,
  User,
  Zap,
  TrendingUp,
  Building2,
} from "lucide-react"
import { useState } from "react"

export default function Page() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <FileCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-primary">ContractSIG</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-xs font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#why-exists" className="hover:text-primary transition-colors">
              Why It Exists
            </Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#use-cases" className="hover:text-primary transition-colors">
              Use Cases
            </Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="#contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <Link href="/auth/sign-up">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("/images/hero-contract-workflow.jpg")',
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="container mx-auto relative z-10 px-4 md:px-6 py-16">
            <div className="w-3/4">
              <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-2xl p-8 md:p-12 space-y-6 shadow-xl">
                <div className="inline-block rounded-full bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-secondary backdrop-blur-sm border border-secondary/30 w-fit">
                  For Growing Businesses
                </div>
                <h1 className="text-3xl md:text-3xl font-bold tracking-tight text-primary leading-[1.2]">
                  Decide which contract <br />
                  opportunities are worth <br />
                  pursuing—with <span className="text-secondary">certainty.</span>
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enterprise-grade systems that help you qualify contract opportunities, verify legitimacy, meet
                  compliance requirements, and prepare submissions—without a legal team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/auth/sign-up">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/40 text-primary hover:bg-primary/10 bg-white/20 backdrop-blur-sm"
                  >
                    Book a Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="py-16 bg-muted/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h3 className="text-secondary font-bold tracking-widest uppercase text-xs">Capabilities</h3>
              <h2 className="text-2xl font-bold tracking-tight text-primary mt-2">Core Features</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Legitimacy Verification",
                  desc: "Comprehensive vetting of counterparties and documentation",
                  icon: ShieldCheck,
                },
                {
                  title: "Submission Preparation",
                  desc: "Smart document generation with embedded compliance",
                  icon: FileCheck,
                },
                {
                  title: "Continuous Compliance",
                  desc: "Automatic monitoring and policy enforcement",
                  icon: Clock,
                },
                {
                  title: "Intelligent Guidance",
                  desc: "AI-powered voice guidance when you need clarity",
                  icon: Users,
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-background p-5 rounded-lg border shadow-sm space-y-3 hover:shadow-md transition-shadow"
                >
                  <feature.icon className="h-8 w-8 text-secondary" />
                  <h4 className="font-bold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Platform Exists */}
        <section id="why-exists" className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative flex items-center justify-center">
                <img
                  src="/images/image-202601051649.jpeg"
                  alt="The problem diagram showing three barriers to growth and platform solutions"
                  className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>

              <div>
                <h3 className="text-secondary font-bold tracking-widest uppercase text-xs">The Problem</h3>
                <h2 className="text-2xl font-bold tracking-tight text-primary mt-2">Why This Platform Exists</h2>
                <div className="space-y-4 mt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Many capable businesses struggle to secure contracts not because they lack quality, but because of
                    three barriers: legitimacy risk, compliance complexity, and lack of clear guidance.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Without demonstrating institutional credibility and navigating legal requirements with confidence,
                    partnerships remain out of reach. This platform removes that friction by bringing enterprise-grade
                    systems to growing businesses.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed font-semibold text-primary">
                    Most failures happen before a contract is ever signed—during qualification, compliance checks, and
                    preparation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Structured Operations */}
        <section id="how-it-works" className="py-16 bg-muted/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h3 className="text-secondary font-bold tracking-widest uppercase text-xs">Process</h3>
              <h2 className="text-2xl font-bold tracking-tight text-primary mt-2">Structured Operations</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="flex items-center justify-center">
                <img
                  src="/images/create-me-an-202601051646.png"
                  alt="Structured operations process showing four stages: Intake & Triage, Due Diligence, Preparation, and Escalation"
                  className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>

              <div className="space-y-4">
                {[
                  {
                    num: "01",
                    title: "Opportunity Intake & Qualification",
                    desc: "Incoming contract opportunities are analyzed for eligibility, risk, and readiness",
                  },
                  {
                    num: "02",
                    title: "Due Diligence",
                    desc: "Automated verification of counterparty legitimacy and documentation",
                  },
                  {
                    num: "03",
                    title: "Preparation",
                    desc: "Smart document generation with built-in compliance rules",
                  },
                  {
                    num: "04",
                    title: "Escalation",
                    desc: "Complex items receive context-aware guidance and support",
                  },
                ].map((step, i) => (
                  <div key={i} className="bg-background p-4 rounded-lg border hover:border-secondary/50 transition-all">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <span className="text-secondary font-bold text-sm">{step.num}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-primary">{step.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Designed For */}
        <section id="use-cases" className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h3 className="text-secondary font-bold tracking-widest uppercase text-xs">Designed For</h3>
              <h2 className="text-2xl font-bold tracking-tight text-primary mt-2">Built for Every Stage of Growth</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Solopreneurs",
                  desc: "Handle contracts without hiring legal support. Clear guidance at every step.",
                  icon: User,
                },
                {
                  title: "Early-Stage Bidders",
                  desc: "Secure your first contracts with institutional credibility and confidence.",
                  icon: Zap,
                },
                {
                  title: "Startup",
                  desc: "Establish B2B partnerships and scale operations without a legal department.",
                  icon: TrendingUp,
                },
                {
                  title: "Small & Medium Enterprise",
                  desc: "Scale contract operations with institutional-grade systems at startup pricing.",
                  icon: Building2,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-background p-5 rounded-lg border hover:border-secondary/50 hover:shadow-md transition-all space-y-3"
                >
                  <item.icon className="h-8 w-8 text-secondary" />
                  <h4 className="font-bold text-sm text-primary">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Voice Agent Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h3 className="text-secondary font-bold tracking-widest uppercase text-xs">Intelligent Guidance</h3>
              <h2 className="text-2xl font-bold tracking-tight text-primary mt-2">AI Voice Agent</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When contract terms don't fit standard patterns, our AI Voice Agent steps in—providing real-time,
                  conversational guidance on complex compliance issues, unusual clauses, and strategic decisions.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      title: "Natural Conversation",
                      desc: "Ask questions in your own words. The agent understands context and provides relevant guidance.",
                    },
                    {
                      title: "Escalation Intelligence",
                      desc: "Identifies when issues need human review and flags them with full context for your team.",
                    },
                    {
                      title: "Learning Your Business",
                      desc: "The agent learns your company's risk profile, compliance standards, and decision patterns over time.",
                    },
                    {
                      title: "24/7 Availability",
                      desc: "Get guidance when you need it—no waiting for legal review or external consultants.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-secondary/20 border border-secondary/50">
                          <Zap className="h-3 w-3 text-secondary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Experience the Agent
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-secondary/30 rounded-2xl p-8 flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-secondary/20 p-4 rounded-full border border-secondary/50">
                      <Users className="h-8 w-8 text-secondary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-primary">Voice-Powered Intelligence</h4>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Real-time contract analysis and guidance through conversational AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-muted/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h3 className="text-secondary font-bold tracking-widest uppercase text-xs">Questions</h3>
              <h2 className="text-2xl font-bold tracking-tight text-primary mt-2">Frequently Asked Questions</h2>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
              {[
                {
                  q: "How does the platform verify legitimacy?",
                  a: "We use automated verification systems that check company registration, credentials, and documentation against multiple trusted databases.",
                },
                {
                  q: "Do I need legal expertise to use this?",
                  a: "No. The platform is designed for non-lawyers. All compliance rules are embedded, and AI-powered guidance walks you through each step.",
                },
                {
                  q: "What happens if something unusual comes up?",
                  a: "Unusual items are automatically flagged for escalation. You receive intelligent voice guidance explaining the issue and recommended next steps.",
                },
                {
                  q: "How does it integrate with my existing tools?",
                  a: "We support integrations with major ERPs, email platforms, spreadsheets, and communication tools.",
                },
                {
                  q: "Is my data secure?",
                  a: "Yes. We maintain SOC 2 Type II compliance, end-to-end encryption, RBAC permissions, and full audit trails.",
                },
                {
                  q: "What's the typical onboarding time?",
                  a: "Most businesses are operational within 1-2 weeks with white-glove onboarding including setup and training.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-background border rounded-lg overflow-hidden hover:border-secondary/30 transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-start justify-between p-4 hover:bg-muted/20 transition-colors text-left gap-2"
                  >
                    <p className="font-semibold text-xs text-foreground leading-snug">{item.q}</p>
                    <ChevronDown
                      className={`h-4 w-4 text-secondary flex-shrink-0 transition-transform duration-200 ${
                        expandedFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-3 border-t border-border/50 pt-3 bg-muted/5">
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where This Fits in the Process */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h3 className="text-secondary font-bold tracking-widest uppercase text-xs">Timeline</h3>
              <h2 className="text-2xl font-bold tracking-tight text-primary mt-2">Where This Fits in the Process</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-3 text-center">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="bg-muted/40 p-4 rounded-lg border border-border/50 inline-block min-w-[140px]">
                      <p className="text-xs font-semibold text-foreground">
                        Opportunity
                        <br />
                        Identified
                      </p>
                    </div>
                  </div>
                  <div className="h-0.5 w-8 bg-secondary mx-2"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="h-0.5 w-8 bg-secondary mx-2"></div>
                  <div className="flex-1">
                    <div className="bg-primary/10 border-2 border-primary p-4 rounded-lg inline-block min-w-[160px]">
                      <p className="text-xs font-semibold text-foreground">
                        Qualification &<br />
                        Readiness
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">(This Platform)</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="bg-muted/40 p-4 rounded-lg border border-border/50 inline-block min-w-[140px]">
                      <p className="text-xs font-semibold text-foreground">
                        Procurement &<br />
                        Negotiation
                      </p>
                    </div>
                  </div>
                  <div className="h-0.5 w-8 bg-secondary mx-2"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="h-0.5 w-8 bg-secondary mx-2"></div>
                  <div className="flex-1">
                    <div className="bg-muted/40 p-4 rounded-lg border border-border/50 inline-block min-w-[140px]">
                      <p className="text-xs font-semibold text-foreground">
                        Execution &<br />
                        Delivery
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-secondary/10 border border-secondary/30 rounded-lg text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We operate before procurement begins—where most disqualifications happen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-10">
                <h2 className="text-2xl font-bold tracking-tight text-primary mb-2">Get In Touch</h2>
                <p className="text-sm text-muted-foreground">
                  Ready to transform your contract operations? Tell us about your needs.
                </p>
              </div>

              <Card className="p-8">
                <form className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Full Name</label>
                      <input
                        className="w-full rounded-md border bg-muted/50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Email Address</label>
                      <input
                        type="email"
                        className="w-full rounded-md border bg-muted/50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Company</label>
                    <input
                      className="w-full rounded-md border bg-muted/50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your company"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Business Type</label>
                    <select className="w-full rounded-md border bg-muted/50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Select business type</option>
                      <option>Solopreneur</option>
                      <option>Early-Stage Bidder</option>
                      <option>Startup</option>
                      <option>Small & Medium Enterprise</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Message</label>
                    <textarea
                      className="w-full rounded-md border bg-muted/50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center text-xs text-muted-foreground">
          <p>© 2025 Contract Operations Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
