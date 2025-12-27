"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DraftReviewForm } from "@/components/draft-review-form"
import dynamic from "next/dynamic"
import { uploadMediaFiles } from "@/lib/uploadMedia"
import { saveCommentToSupabase } from "@/lib/saveComment"


interface Comment {
  user_id: string
  comment: string
  timestamp: string
  files?: string[]
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
  const [commentFiles, setCommentFiles] = useState<File[]>([])
const [submitting, setSubmitting] = useState(false)
const [user, setUser] = useState<{ id: string; email: string } | null>(null)

useEffect(() => {
  const storedUser = localStorage.getItem("user")
  if (storedUser) {
    setUser(JSON.parse(storedUser))
  }
}, [])
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
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setCommentFiles(Array.from(e.target.files))
  }
}

  /* ---------------- ADD COMMENT ---------------- */
 const addComment = async () => {
  if (!newComment.trim() || !report || !user) {
    alert("You must be logged in to comment")
    return
  }

  try {
    setSubmitting(true)

    // 1. Upload files
    let fileUrls: string[] = []
    if (commentFiles.length > 0) {
      fileUrls = await uploadMediaFiles(commentFiles)
    }

    // 2. Save to Supabase
    await saveCommentToSupabase({
      report_id: report.id,
      user_id: user.id,
      comment: newComment,
      files: fileUrls,
    })

    // 3. Update UI + localStorage
    const updatedReport: PollutionReport = {
      ...report,
      analysis: [
        ...report.analysis,
        {
          user_id: user.id,
          comment: newComment,
          timestamp: new Date().toLocaleString(),
          files: fileUrls,
        },
      ],
    }

    setReport(updatedReport)
    localStorage.setItem(`report-${id}`, JSON.stringify(updatedReport))

    setNewComment("")
    setCommentFiles([])
  } catch (err) {
    console.error(err)
    alert("Failed to submit comment")
  } finally {
    setSubmitting(false)
  }
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
                <p className="font-medium">{c.user_id}</p>
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
    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
    rows={3}
  />

  <input
    type="file"
    multiple
    onChange={handleFileChange}
    className="block text-sm"
  />

  {commentFiles.length > 0 && (
    <div className="text-xs text-muted-foreground">
      {commentFiles.map((f, i) => (
        <p key={i}>📎 {f.name}</p>
      ))}
    </div>
  )}

  <Button
    onClick={addComment}
    disabled={submitting}
    className="bg-accent hover:bg-accent/90"
  >
    {submitting ? "Submitting..." : "Submit Comment"}
  </Button>

</div>

      </Card>
    </div>
  )
}
