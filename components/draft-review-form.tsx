"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"
import { uploadMediaFiles } from "@/lib/uploadMedia"
import saveReportToSupabase from "@/lib/saveReport"

interface DraftData {
  lat: number
  lng: number
  type: string
  desc: string
  createdAt: string
}

interface DraftReviewFormProps {
  draftData: DraftData
}

type User = {
  id: string
  email: string
  role: string
}

export function DraftReviewForm({ draftData }: DraftReviewFormProps) {
  const router = useRouter()
  const [description, setDescription] = useState(draftData.desc)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // ✅ Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(stored))
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      alert("You must be logged in to submit a report")
      router.push("/login")
      return
    }

    setSubmitting(true)
    try {
      // 1. Upload media
      let fileUrls: string[] = []
      if (mediaFiles.length > 0) {
        fileUrls = await uploadMediaFiles(mediaFiles)
      }

      // 2. Save report with user_id
      await saveReportToSupabase({
        user_id: user.id,
        lat: draftData.lat,
        long: draftData.lng,
        type: draftData.type,
        description: description,
        file: fileUrls,
      })

      localStorage.removeItem("draftReport")
      alert("Report submitted successfully!")
      router.push("/")
    } catch (error) {
      console.error(error)
      alert("Failed to submit report. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    const updatedDraft = {
      ...draftData,
      desc: description,
    }
    localStorage.setItem("draftReport", JSON.stringify(updatedDraft))
    alert("Draft saved locally!")
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Report Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pollution Type</label>
            <div className="px-3 py-2 bg-muted rounded-md">{draftData.type}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-md bg-background resize-none"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Media Upload</h2>

        <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="media-upload"
          />
          <label htmlFor="media-upload" className="cursor-pointer block">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Click to upload media</p>
            <p className="text-xs opacity-70">Images or videos</p>
          </label>
        </div>

        {mediaFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {mediaFiles.map((file, idx) => (
              <div key={idx} className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={handleSaveDraft} disabled={submitting} className="flex-1">
          Save Draft
        </Button>

        <Button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-accent">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Report"
          )}
        </Button>
      </div>
    </div>
  )
}
