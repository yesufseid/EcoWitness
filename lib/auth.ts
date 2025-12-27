import { supabase } from "./supabaseClient"

export async function signUp(email: string, password: string) {
  const { error } = await supabase.from("users").insert({
    email,
    password, // plain text (education only)
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function login(email: string, password: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single()

  if (error || !user) {
    throw new Error("Invalid email or password")
  }

  localStorage.setItem("user", JSON.stringify(user))
  return user
}
