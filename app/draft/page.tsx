"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { DraftReviewForm } from "@/components/draft-review-form"

const DraftMapPreview = dynamic(() => import("@/components/draft-map-preview"), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-muted flex items-center justify-center rounded-lg">Loading map...</div>,
})

interface DraftData {
  lat: number
  lng: number
  type: string
  desc: string
  createdAt: string
}

export default function DraftPage() {
  const router = useRouter()
  const [draftData, setDraftData] = useState<DraftData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const draft = localStorage.getItem("draftReport")
    if (!draft) {
      router.push("/")
      return
    }
    setDraftData(JSON.parse(draft))
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading draft...</p>
        </div>
      </div>
    )
  }

  if (!draftData) {
    return null
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Finish Your Pollution Report</h1>
            <p className="text-muted-foreground">Add more details to help identify and respond faster.</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Location Preview</h2>
            <DraftMapPreview lat={draftData.lat} lng={draftData.lng} />
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-accent hover:text-accent/80 text-sm font-medium transition-colors"
            >
              ← Change Location
            </button>
          </div>

          <DraftReviewForm draftData={draftData} />
        </div>
      </main>
    </div>
  )
}
