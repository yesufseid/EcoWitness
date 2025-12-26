"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"


interface PollutionReport {
  id: string
  type: string
  description: string
  location: { lat: number; lng: number }
  timestamp: string
  reporterEmail: string
  media: string[]
  status: string
  analysis: Array<{ author: string; comment: string; timestamp: string }>
  regulatoryActions: Array<{ action: string; status: string; date: string; officer: string }>
}

export default function RegulatoryDashboard() {
  const [reports, setReports] = useState<PollutionReport[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const [newAction, setNewAction] = useState("")
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [actionStatus, setActionStatus] = useState("pending")

  useEffect(() => {
    const stored = localStorage.getItem("pollutionReports")
    if (stored) {
      const parsed = JSON.parse(stored)
      setReports(
        parsed.map((r: any) => ({
          ...r,
          status: r.status || "pending",
          regulatoryActions: r.regulatoryActions || [],
        })),
      )
    }
  }, [])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || report.type === filterType
    const matchesStatus = filterStatus === "all" || report.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleAddAction = (reportId: string) => {
    if (!newAction.trim()) return

    setReports(
      reports.map((r) =>
        r.id === reportId
          ? {
              ...r,
              regulatoryActions: [
                ...(r.regulatoryActions || []),
                {
                  action: newAction,
                  status: actionStatus,
                  date: new Date().toLocaleDateString(),
                  officer: "Officer Unknown",
                },
              ],
            }
          : r,
      ),
    )
    localStorage.setItem(
      "pollutionReports",
      JSON.stringify(
        reports.map((r) =>
          r.id === reportId
            ? {
                ...r,
                regulatoryActions: [
                  ...(r.regulatoryActions || []),
                  {
                    action: newAction,
                    status: actionStatus,
                    date: new Date().toLocaleDateString(),
                    officer: "Officer Unknown",
                  },
                ],
              }
            : r,
        ),
      ),
    )
    setNewAction("")
    setActionStatus("pending")
    setSelectedReportId(null)
  }

  const pollutionTypes = ["Air Pollution", "Water Pollution", "Soil Contamination", "Noise Pollution", "Waste Dumping"]
  const statuses = ["pending", "investigating", "resolved", "escalated"]

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    investigating: reports.filter((r) => r.status === "investigating").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Regulatory Dashboard</h1>
          <p className="text-muted-foreground">
            Manage pollution reports, coordinate enforcement actions, and work with environmental experts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Total Reports</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Pending</p>
            <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Investigating</p>
            <p className="text-3xl font-bold text-foreground">{stats.investigating}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Resolved</p>
            <p className="text-3xl font-bold text-foreground">{stats.resolved}</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search</label>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pollution Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
              >
                <option value="all">All Types</option>
                {pollutionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
              >
                <option value="all">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground opacity-0">Action</label>
              <Button onClick={() => setSearchQuery("")} variant="outline" className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <p className="text-muted-foreground">No reports found. Adjust your filters.</p>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card
                key={report.id}
                className="bg-card border-border overflow-hidden hover:border-accent/50 transition cursor-pointer"
                onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
              >
                <div className="p-6 space-y-4">
                  {/* Report Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                          {report.type}
                        </span>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            report.status === "resolved"
                              ? "bg-green-500/20 text-green-700"
                              : report.status === "investigating"
                                ? "bg-blue-500/20 text-blue-700"
                                : "bg-yellow-500/20 text-yellow-700"
                          }`}
                        >
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>
                      <p className="font-semibold text-foreground mb-1">{report.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Location: {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Reported: {new Date(report.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Reporter: {report.reporterEmail}</p>
                    </div>
                    <svg
                      className={`w-6 h-6 text-muted-foreground transition ${
                        expandedReport === report.id ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>

                  {/* Expanded Content */}
                  {expandedReport === report.id && (
                    <div className="border-t border-border pt-6 space-y-6">
                      {/* Expert Analysis */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">
                          Expert Analysis ({report.analysis?.length || 0})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {report.analysis && report.analysis.length > 0 ? (
                            report.analysis.map((comment, idx) => (
                              <div key={idx} className="bg-secondary/30 rounded p-3 text-sm">
                                <p className="font-medium text-foreground">{comment.author}</p>
                                <p className="text-muted-foreground text-xs mb-1">{comment.timestamp}</p>
                                <p className="text-foreground">{comment.comment}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No analysis yet</p>
                          )}
                        </div>
                      </div>

                      {/* Regulatory Actions */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Enforcement Actions</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {report.regulatoryActions && report.regulatoryActions.length > 0 ? (
                            report.regulatoryActions.map((action, idx) => (
                              <div key={idx} className="bg-secondary/30 rounded p-3 text-sm border-l-4 border-accent">
                                <p className="font-medium text-foreground">{action.action}</p>
                                <p className="text-xs text-muted-foreground">
                                  Status: {action.status} | Date: {action.date} | Officer: {action.officer}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No actions yet</p>
                          )}
                        </div>

                        {/* Add New Action */}
                        {selectedReportId === report.id ? (
                          <div className="space-y-3 pt-3 border-t border-border">
                            <textarea
                              value={newAction}
                              onChange={(e) => setNewAction(e.target.value)}
                              placeholder="Describe enforcement action..."
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm resize-none"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <select
                                value={actionStatus}
                                onChange={(e) => setActionStatus(e.target.value)}
                                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm"
                              >
                                {statuses.map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                              </select>
                              <Button
                                onClick={() => handleAddAction(report.id)}
                                className="bg-accent hover:bg-accent/90"
                                size="sm"
                              >
                                Submit
                              </Button>
                              <Button onClick={() => setSelectedReportId(null)} variant="outline" size="sm">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => setSelectedReportId(report.id)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Add Action
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
