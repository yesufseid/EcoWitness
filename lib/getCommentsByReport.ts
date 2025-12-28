"use server"

import { supabase } from "@/lib/supabaseClient"

export interface ReportComment {
  id: string
  comment: string
  files: string[]
  created_at: string
  user: {
    id: string
    email: string
  }
}

export async function getCommentsByReport(
  reportId: string
): Promise<ReportComment[]> {
    console.log(reportId);
    
  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      comment,
      files,
      created_at,
      user:users (
        id,
        email
      )
    `)
    .eq("report_id", reportId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching comments:", error)
    return []
  }

  return data as unknown as ReportComment[]
}
