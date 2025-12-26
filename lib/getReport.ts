import { supabase } from "@/lib/supabaseClient"

async function getReportsByStatus(status: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("status", status)

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export default getReportsByStatus
