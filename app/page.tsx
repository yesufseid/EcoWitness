"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-accent uppercase tracking-wide">Environmental Action Platform</p>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                Report Pollution. Create Change.
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Empower communities to document environmental issues with precise location data and multimedia evidence.
                Connect with environmental experts and regulatory agencies.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/report">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Report an Issue
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative h-96 md:h-full min-h-96 bg-secondary/30 rounded-2xl border border-border flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
            <div className="text-center space-y-4">
              <svg className="w-24 h-24 mx-auto text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-muted-foreground">Interactive Map Integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Why Use Our Platform?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive solution for environmental reporting and analysis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "📍",
              title: "Precise Location Mapping",
              description: "Use GPS to mark exact pollution hotspots on an interactive map",
            },
            {
              icon: "📸",
              title: "Media Documentation",
              description: "Attach photos and videos as evidence to your pollution reports",
            },
            {
              icon: "👥",
              title: "Expert Analysis",
              description: "Connect with environmental students and regulatory bodies for insights",
            },
            {
              icon: "📊",
              title: "Real-time Tracking",
              description: "Monitor reported incidents and view analysis from experts",
            },
            {
              icon: "🔒",
              title: "Secure & Anonymous",
              description: "Report safely with optional anonymity and data protection",
            },
            {
              icon: "🌍",
              title: "Community Impact",
              description: "Be part of a movement creating real environmental change",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition group"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* User Roles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-secondary/20 rounded-2xl my-20 border border-border">
        <h2 className="text-4xl font-bold text-foreground mb-16 text-center">For Everyone</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">Citizens</h3>
            <p className="text-muted-foreground">
              Report environmental issues directly from your location with comprehensive documentation and track
              response progress.
            </p>
            <Link href="/report">
              <Button variant="outline" className="w-full bg-transparent">
                Start Reporting
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">Environmental Students</h3>
            <p className="text-muted-foreground">
              Access all pollution reports, analyze data patterns, add professional commentary and insights to help
              communities.
            </p>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full bg-transparent">
                View Dashboard
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚖️</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">Regulatory Bodies</h3>
            <p className="text-muted-foreground">
              Monitor pollution incidents, collaborate with environmental experts, and coordinate enforcement actions.
            </p>
            <Link href="/regulatory">
              <Button variant="outline" className="w-full bg-transparent">
                Access Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Ready to Make a Difference?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of concerned citizens creating environmental accountability today.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/report">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Report Now
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              View Reports
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">PR</span>
              </div>
              <span className="font-semibold text-foreground">Pollution Report Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">Making environmental accountability accessible to everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
