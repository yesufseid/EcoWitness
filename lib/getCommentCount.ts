import { supabase } from "@/lib/supabaseClient"

export async function getCommentCount(reportId: string): Promise<number> {
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("report_id", reportId)

  if (error) {
    console.error("Failed to count comments", error)
    return 0
  }

  return count ?? 0
}