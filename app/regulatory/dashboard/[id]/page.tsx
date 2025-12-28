"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { uploadMediaFiles } from "@/lib/uploadMedia"
import { saveCommentToSupabase } from "@/lib/saveComment"
import { getCommentsByReport } from "@/lib/getCommentsByReport"
import { CommentItem } from "@/components/comment-item"


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
  media: string[]
  status: string
}

const DraftMapPreview = dynamic(
  () => import("@/components/draft-map-preview"),
  { ssr: false }
)

export default function ReportDetailsPage() {
  const { id } = useParams()
  const [report, setReport] = useState<PollutionReport | null>(null)
  const [newComment, setNewComment] = useState("")
  const [commentFiles, setCommentFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [comments, setComments] = useState<any[]>([])

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  /* ---------------- LOAD REPORT ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem(`report-${id}`)
    if (!stored) return

    const parsed = JSON.parse(stored)
    console.log(parsed);
    
    setReport({
      id: parsed.id,
      type: parsed.type,
      description: parsed.description,
      location: { lat: parsed.lat, lng: parsed.long },
      timestamp: parsed.created_at,
      media: parsed.files || [],
      status: parsed.status || "active",
    })
    getCommentsByReport(parsed.id as string).then(setComments)
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCommentFiles(Array.from(e.target.files))
    }
  }

  /* ---------------- ADD COMMENT ---------------- */
  const addComment = async () => {
    if (!newComment.trim() || !report || !user) return

    try {
      setSubmitting(true)

      let fileUrls: string[] = []
      if (commentFiles.length > 0) {
        fileUrls = await uploadMediaFiles(commentFiles)
      }

      await saveCommentToSupabase({
        report_id: report.id,
        user_id: user.id,
        comment: newComment,
        files: fileUrls,
      })

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
        <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs rounded-full">
          {report.type}
        </span>
        <h1 className="text-2xl font-bold">Pollution Report</h1>
        <p className="text-muted-foreground">
          Reported on {new Date(report.timestamp).toLocaleString()}
        </p>
      </Card>

      {/* DESCRIPTION */}
      <Card className="p-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p>{report.description}</p>
      </Card>

      {/* MEDIA */}
      {report.media.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Attached Media</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {report.media.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Report media"
                className="rounded-lg border object-cover h-40 w-full"
              />
            ))}
          </div>
        </Card>
      )}

      {/* MAP */}
      <DraftMapPreview lat={report.location.lat} lng={report.location.lng} />

      {/* ANALYSIS */}
     <Card className="p-6 space-y-4">
        <h3 className="font-semibold">
    Comments ({comments.length})
  </h3>

  {comments.length === 0 && (
    <p className="text-sm text-muted-foreground">
      No comments yet
    </p>
  )}

  <div className="space-y-3">
    {comments.map((c) => (
      <CommentItem key={c.id} comment={c} />
    ))}
  </div>
        {/* ADD COMMENT */}
        <div className="border-t pt-4 space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write analysis or comment..."
            className="w-full px-3 py-2 border rounded-lg text-sm"
            rows={3}
          />

<div className="space-y-2">
  <label
    htmlFor="comment-files"
    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition text-sm text-muted-foreground"
  >
    📎 Attach images (optional)
  </label>

  <input
    id="comment-files"
    type="file"
    multiple
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />

  {commentFiles.length > 0 && (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
      {commentFiles.map((file, i) => (
        <div
          key={i}
          className="text-xs bg-muted rounded p-2 truncate flex items-center gap-2"
        >
          🖼 {file.name}
        </div>
      ))}
    </div>
  )}
</div>

          <Button onClick={addComment} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Comment"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
