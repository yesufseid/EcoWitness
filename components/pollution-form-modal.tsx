"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface PollutionFormModalProps {
  lat: number
  lng: number 
  // onClose: () => void
}

const POLLUTION_TYPES = [
  { value: "air", label: "Air Pollution" },
  { value: "water", label: "Water Pollution" },
  { value: "waste", label: "Solid Waste" },
  { value: "noise", label: "Noise Pollution" },
  { value: "other", label: "Other" },
]

export function PollutionFormModal({lat,lng}: PollutionFormModalProps) {
  const router = useRouter()
  const [pollutionType, setPollutionType] = useState("")
  const [description, setDescription] = useState("")

  const handleSaveDraft = () => {
    if (!pollutionType) {
      alert("Please fill in all fields")
      return
    }

    const draftData = {
      lat:lat,
      lng:lng,
      type: POLLUTION_TYPES.find((t) => t.value === pollutionType)?.label || pollutionType,
      desc: description,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("draftReport", JSON.stringify(draftData))
    router.push("report/draft")
  }

  return (
 
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Report Pollution</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Pollution Type
              <span  className="text-red-600" >
                ★
              </span>
            </label>
            <Select value={pollutionType} onValueChange={setPollutionType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {POLLUTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the pollution..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows={3}
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Location: {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveDraft} className="flex-1 bg-accent hover:bg-accent/90">
              Save Draft
            </Button>
          </div>
        </div>
      </div>
    // </div>
  )
}
