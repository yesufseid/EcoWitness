import { supabase } from "@/lib/supabaseClient"


export async function uploadMediaFiles(
  files: File[]
): Promise<string[]> {
  const uploadedUrls: string[] = []

  for (const file of files) {
    const ext = file.name.split(".").pop()
    const path = `${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from("report-media")
      .upload(path, file, {
        contentType: file.type,
      })

    if (error) throw error

    const { data } = supabase.storage
      .from("report-media")
      .getPublicUrl(path)

    uploadedUrls.push(data.publicUrl)
  }

  return uploadedUrls
}
