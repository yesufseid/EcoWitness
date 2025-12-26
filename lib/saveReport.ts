

import { supabase } from "@/lib/supabaseClient"

async function saveReportToSupabase(data: {
  user_id:string
  lat: number
  long:number
  type: string
  description: string
  file: string[]
}) {
  const { error } = await supabase.from("reports").insert(
    {
      user_id:data.user_id,
      lat: data.lat,
      long: data.long,
      type: data.type,
      description: data.description,
      files: data.file,
      status:"active"
    },
  )
  console.log(error);
  
  if (error) throw error
}


export default saveReportToSupabase