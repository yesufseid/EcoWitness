"use client"

import { useState} from "react"
import dynamic from "next/dynamic"
import { PollutionFormModal } from "@/components/pollution-form-modal"



const HomeClient = dynamic(() => import("../../components/HomeClient"), { ssr: false });


export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  return (
    <div className="w-full h-screen flex flex-col">
      <HomeClient />
    </div>
  )
}
