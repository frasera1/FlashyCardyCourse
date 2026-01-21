import { PricingTable } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AppHeader } from '@/components/app-header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Plans | Flashcard App',
  description: 'Choose the perfect plan for your learning needs. Start free and upgrade for unlimited decks and AI-powered features.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <AppHeader showPricingLink={false} />
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start for free and upgrade when you need more. All plans include core flashcard features.
          </p>
        </div>

        {/* Pricing Table with Features */}
        <div className="max-w-5xl mx-auto">
          <PricingTable />
          
          {/* Feature Details - Positioned to appear as part of pricing cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Free Plan Features */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base">Up to 3 Decks</p>
                    <p className="text-sm text-muted-foreground">
                      Perfect for getting started
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Unlimited cards per deck</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Interactive study sessions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Cross-device sync</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Plan Features */}
            <div className="bg-card border-2 border-primary rounded-lg p-6 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                RECOMMENDED
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-primary/20">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base">Unlimited Decks</p>
                    <p className="text-sm text-muted-foreground">
                      No limits on your learning
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">AI flashcard generation</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Priority support</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">All free features included</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <Link href="/dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
