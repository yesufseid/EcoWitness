import { supabase } from "@/lib/supabaseClient"

interface SaveCommentInput {
  report_id: string
  user_id: string
  comment: string
  files: string[]
}

export async function saveCommentToSupabase(data: SaveCommentInput) {
  const { error } = await supabase.from("comments").insert({
    report_id: data.report_id,
    user_id: data.user_id,
    comment: data.comment,
    files: data.files,
  })

  if (error) {
    console.error(error)
    throw error
  }
}
