"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"

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

export function DraftReviewForm({ draftData }: DraftReviewFormProps) {
  const router = useRouter()
  const [description, setDescription] = useState(draftData.desc)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    if (!email.trim() || !phone.trim()) {
      alert("Please fill in contact information")
      return
    }

    setSubmitting(true)

    try {
      const submissionData = {
        ...draftData,
        desc: description,
        email,
        phone,
        mediaCount: mediaFiles.length,
        submittedAt: new Date().toISOString(),
      }

      console.log("Submitting report:", submissionData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Clear draft and show success
      localStorage.removeItem("draftReport")
      alert("Report submitted successfully!")
      router.push("/")
    } catch (error) {
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
            <label className="block text-sm font-medium text-card-foreground mb-2">Pollution Type</label>
            <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground">{draftData.type}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Media Upload</h2>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="media-upload"
          />
          <label htmlFor="media-upload" className="cursor-pointer block">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Click to upload media</p>
            <p className="text-xs text-muted-foreground mt-1">Images or videos</p>
          </label>
        </div>
        {mediaFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {mediaFiles.map((file, idx) => (
              <div key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251 9XX XXX XXX"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={handleSaveDraft} disabled={submitting} className="flex-1 bg-transparent">
          Save Draft
        </Button>
        <Button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-accent hover:bg-accent/90">
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
