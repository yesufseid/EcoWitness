"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DraftReviewForm } from "@/components/draft-review-form"
import dynamic from "next/dynamic"

interface Comment {
  author: string
  comment: string
  timestamp: string
}

interface PollutionReport {
  id: string
  type: string
  description: string
  location: { lat: number; lng: number }
  timestamp: string
  reporterEmail: string
  media: string[]
  status: string
  analysis: Comment[]
}
const DraftMapPreview = dynamic(() => import("@/components/draft-map-preview"), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-muted flex items-center justify-center rounded-lg">Loading map...</div>,
})
export default function ReportDetailsPage() {
  const { id } = useParams()
  const [report, setReport] = useState<PollutionReport | null>(null)
  const [newComment, setNewComment] = useState("")

  /* ---------------- LOAD REPORT FROM LOCALSTORAGE ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem(`report-${id}`)
    if (stored) {
      const parsed = JSON.parse(stored)

      setReport({
        id: parsed.id,
        type: parsed.type,
        description: parsed.description,
        location: { lat: parsed.lat, lng: parsed.long },
        timestamp: parsed.created_at,
        reporterEmail: parsed.email || "Unknown",
        media: parsed.file || [],
        status: "pending",
        analysis: parsed.analysis || [],
      })
    }
  }, [id])

  /* ---------------- ADD COMMENT ---------------- */
  const addComment = () => {
    if (!newComment.trim() || !report) return

    const updatedReport: PollutionReport = {
      ...report,
      analysis: [
        ...report.analysis,
        {
          author: "Anonymous Expert",
          comment: newComment,
          timestamp: new Date().toLocaleString(),
        },
      ],
    }

    setReport(updatedReport)
    localStorage.setItem(`report-${id}`, JSON.stringify(updatedReport))
    setNewComment("")
  }

  if (!report) return <p className="p-6">Loading report...</p>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <Card className="p-6 space-y-2">
        <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
          {report.type}
        </span>

        <h1 className="text-2xl font-bold text-foreground">
          Pollution Report Details
        </h1>

        <p className="text-muted-foreground">
          Reported on {new Date(report.timestamp).toLocaleString()}
        </p>

        <p className="text-sm text-muted-foreground">
          Reporter: {report.reporterEmail}
        </p>
      </Card>

      {/* DESCRIPTION */}
      <Card className="p-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-foreground">{report.description}</p>
      </Card>

      {/* MAP */}
       <DraftMapPreview lat={report.location.lat} lng={report.location.lng} />

      {/* COMMENTS / ANALYSIS */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">
          Expert Analysis ({report.analysis.length})
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {report.analysis.length > 0 ? (
            report.analysis.map((c, i) => (
              <div key={i} className="bg-secondary/30 rounded p-3 text-sm">
                <p className="font-medium">{c.author}</p>
                <p className="text-xs text-muted-foreground mb-1">
                  {c.timestamp}
                </p>
                <p>{c.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No comments yet
            </p>
          )}
        </div>

        {/* ADD COMMENT */}
        <div className="border-t pt-4 space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write expert analysis or comment..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm "
            rows={3}
          />
          <Button
            onClick={addComment}
            className="bg-accent hover:bg-accent/90"
          >
            Submit Comment
          </Button>
        </div>
      </Card>
    </div>
  )
}
