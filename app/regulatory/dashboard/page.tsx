
 "use client"
 import { useEffect, useState } from "react"
 import getReportsByStatus from "@/lib/getReport"
 import { ReportCard } from "@/components/report-card2"
 import { Button } from "@/components/ui/button"
 import { Input } from "@/components/ui/input"
 import {Card }from "@/components/ui/card"
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select"
 
 interface Report {
   id: string
   lat: number
   long: number
   type: string
   description: string
   created_at: string
   file: string[]
 }
 
 export default function DashboardPage() {
   const [reports, setReports] = useState<Report[]>([])
   const [filteredReports, setFilteredReports] = useState<Report[]>([])
   const [filterType, setFilterType] = useState("all")
   const [searchTerm, setSearchTerm] = useState("")
   const [loading, setLoading] = useState(true)
 
   /* ---------------- FETCH REPORTS ---------------- */
   useEffect(() => {
     async function fetchReports() {
       try {
         const data = await getReportsByStatus("active")
         setReports(data || [])
         setFilteredReports(data || [])
         console.log(data);
         
       } catch (err) {
         console.error("Failed to fetch reports", err)
       } finally {
         setLoading(false)
       }
     }
 
     fetchReports()
   }, [])
 
   /* ---------------- FRONTEND FILTERING ---------------- */
   useEffect(() => {
     let filtered = [...reports]
 
     if (filterType !== "all") {
       filtered = filtered.filter((r) => r.type === filterType)
     }
 
     if (searchTerm) {
       const term = searchTerm.toLowerCase()
       filtered = filtered.filter(
         (r) =>
           r.description.toLowerCase().includes(term) ||
           r.type.toLowerCase().includes(term),
       )
     }
 
     setFilteredReports(filtered)
   }, [filterType, searchTerm, reports])
 
   const pollutionTypes = [
     "Air Pollution",
     "Water Pollution",
     "Soil Contamination",
     "Noise Pollution",
     "Solid Waste",
     "Other",
   ]
 
   return (
     <div className="min-h-screen bg-background">
       <main className="max-w-7xl mx-auto px-4 py-8">
 
         {/* Header */}
         <div className="mb-8">
           <h1 className="text-3xl font-bold">Environmental Reports</h1>
           <p className="text-muted-foreground">
             Review and analyze community pollution reports
           </p>
         </div>
 
            {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Total Reports</p>
            <p className="text-3xl font-bold text-foreground">{}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Pending</p>
            <p className="text-3xl font-bold text-foreground">{}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Investigating</p>
            <p className="text-3xl font-bold text-foreground">{}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Resolved</p>
            <p className="text-3xl font-bold text-foreground">{}</p>
          </Card>
        </div>
 
         {/* Filters */}
         <div className="bg-card border rounded-lg p-6 mb-8">
           <h2 className="font-semibold mb-4">Filters</h2>
           <div className="flex flex-col md:flex-row gap-4">
             <Input
               placeholder="Search description, email, or type..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
 
             <Select value={filterType} onValueChange={setFilterType}>
               <SelectTrigger className="md:w-48">
                 <SelectValue placeholder="Filter by type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Types</SelectItem>
                 {pollutionTypes.map((type) => (
                   <SelectItem key={type} value={type}>
                     {type}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
 
             <Button
               variant="outline"
               onClick={() => {
                 setFilterType("all")
                 setSearchTerm("")
               }}
             >
               Reset
             </Button>
           </div>
         </div>
 
         {/* Reports */}
         {loading ? (
           <p className="text-center text-muted-foreground">Loading reports...</p>
         ) : filteredReports.length === 0 ? (
           <p className="text-center text-muted-foreground">
             No reports match your filters.
           </p>
         ) : (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {filteredReports.map((report, index) => (
               <ReportCard key={index} report={report} />
             ))}
           </div>
         )}
       </main>
     </div>
   )
 }
 
 /* ---------------- SMALL STAT COMPONENT ---------------- */
 function Stat({ title, value }: { title: string; value: any }) {
   return (
     <div className="bg-card border rounded-lg p-6">
       <div className="text-sm text-muted-foreground">{title}</div>
       <div className="text-3xl font-bold">{value}</div>
     </div>
   )
 }

