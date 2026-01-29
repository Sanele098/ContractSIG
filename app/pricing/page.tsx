"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for testing and solopreneurs",
      price: "$0",
      period: "/forever",
      features: [
        "Up to 3 opportunity verifications per month",
        "Basic compliance checklist",
        "Simple bid package generation",
        "Community access",
        "Email support",
      ],
      cta: "Start Free",
      highlighted: false,
    },
    {
      name: "Professional",
      description: "For growing businesses",
      price: "$20",
      period: "/month",
      features: [
        "Unlimited opportunity verifications",
        "Advanced compliance automation",
        "Custom bid package templates",
        "Priority email & chat support",
        "Team access (up to 5 users)",
        "Full AI voice agent access",
        "Historical bid benchmarking",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Custom",
      description: "For enterprise and complex needs",
      price: "Custom",
      period: "pricing",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Custom compliance rules",
        "API access",
        "Dedicated account manager",
        "24/7 support",
        "Advanced integrations",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2 font-bold text-base md:text-lg text-primary">
            ContractSIG
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-xs md:text-sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Pricing Header */}
        <section className="py-12 md:py-16 bg-muted/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-3">
                Simple, Transparent Pricing
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Choose the plan that fits your business. Scale up as you grow. No hidden fees.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl border transition-all ${
                    plan.highlighted
                      ? "border-secondary/50 bg-secondary/5 ring-2 ring-secondary/30 md:scale-105"
                      : "border-border bg-background hover:border-secondary/30"
                  } p-5 md:p-6`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground text-xs">{plan.period}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className={`w-full mb-6 text-xs md:text-sm ${
                      plan.highlighted
                        ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>

                  <div className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <Check className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-8 text-primary">Pricing FAQ</h2>

            <div className="space-y-3">
              {[
                {
                  q: "Can I change plans anytime?",
                  a: "Yes. Upgrade or downgrade your plan anytime. Changes take effect at the next billing cycle.",
                },
                {
                  q: "What's included in the free trial?",
                  a: "All plans include a 14-day free trial with full feature access. No credit card required.",
                },
                {
                  q: "Do you offer annual discounts?",
                  a: "Yes. Pay annually and save 20% on any plan. Contact us for custom annual arrangements.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-muted/30 border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">{item.q}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary/5 border-t">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-lg md:text-2xl font-bold mb-3 text-primary">Ready to get started?</h2>
            <p className="text-xs md:text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
              Join growing businesses transforming how they handle contract opportunities.
            </p>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs md:text-sm"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center text-xs text-muted-foreground">
          <p>© 2025 ContractSIG. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
