"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MapPin, Calendar, MessageCircle } from "lucide-react"
import { getCommentCount } from "@/lib/getCommentCount"

interface Report {
  id: string
  lat: number
  long: number
  type: string
  description: string
  created_at: string
  file: string[]
}

export function ReportCard({ report }: { report: Report }) {
  const router = useRouter()
  const [commentCount, setCommentCount] = useState<number>(0)

  useEffect(() => {
    getCommentCount(report.id).then(setCommentCount)
  }, [report.id])

  const handleClick = () => {
    localStorage.setItem(`report-${report.id}`, JSON.stringify(report))
    router.push(`/regulatory/dashboard/${report.id}`)
  }

  const createdDate = new Date(report.created_at).toLocaleDateString()

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition"
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">
          {report.description.slice(0, 60)}...
        </CardTitle>

        <CardDescription className="space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {createdDate}
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {report.lat.toFixed(4)}, {report.long.toFixed(4)}
          </div>

          {/* ✅ Comment count */}
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {commentCount} comment{commentCount !== 1 ? "s" : ""}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          Write Commentary
        </Button>
      </CardContent>
    </Card>
  )
}
