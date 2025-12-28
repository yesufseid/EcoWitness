"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  email: string
  role: "user" | "student" | "regulator"
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()
   console.log(pathname);
   
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  // Restrict access based on role
 useEffect(() => {
  const publicRoutes = ["/report", "/login", "/signup"]

  // ✅ Allow public routes for everyone
  if (publicRoutes.some((p) => pathname.startsWith(p))) {
    // 🚫 Logged-in users should NOT see login/signup
    if (user && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
      router.push("/")
    }
    return
  }

  // ❌ Not logged in → block everything else
  if (!user) {
    router.push("/login")
    return
  }

  // 🔐 Role-based access
  const roleAllowedPaths: Record<string, string[]> = {
    user: ["/report"],
    student: ["/students", "/report"],
    regulator: ["/regulatory", "/report"],
  }

  const allowedPaths = roleAllowedPaths[user.role] || []

  const hasAccess = allowedPaths.some((p) =>
    pathname.startsWith(p)
  )

  if (!hasAccess) {
    router.push("/")
  }
}, [user, pathname, router])



  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">PR</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
            <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => router.push("/report")}>
              Report Now
            </Button>
          {!user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => router.push("/signup")}>
                Sign up
              </Button>
            </>
          ) : (
            <>
              {/* Report Now button only for "user" role */}
                {user.role === "student" && (
                <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => router.push("/students/dashboard")}>
                  Dashboard
                </Button>
              )}
              {user.role === "regulator" && (
                <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => router.push("/regulatory/dashboard")}>
                  Dashboard
                </Button>
              )}


              {/* Profile Circle */}
              <div
                title={user.email}
                className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold cursor-pointer"
              >
                {user.email.charAt(0).toUpperCase()}
              </div>

              {/* Logout */}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
