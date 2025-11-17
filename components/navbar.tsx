"use client"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">PR</span>
          </div>
          {/* <span className="font-semibold text-foreground">Pollution Report Platform</span> */}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button size="sm" className="bg-accent hover:bg-accent/90">
            Sign up 
          </Button>
        </div>
      </div>
    </nav>
  )
}
