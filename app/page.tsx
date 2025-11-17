"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { PollutionFormModal } from "@/components/pollution-form-modal"


const HomeClient = dynamic(() => import("../components/HomeClient"), { ssr: false });

// const MapComponent = dynamic(() => import("@/components/map-component"), {
//   ssr: false,
//   loading: () => <div className="w-full h-screen bg-background flex items-center justify-center">Loading map...</div>,
// })

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar />
      <HomeClient />
    </div>
  )
}
