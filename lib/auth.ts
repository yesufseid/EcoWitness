import bcrypt from "bcryptjs"
import { supabase } from "./supabaseClient"

export async function signUp(
  email: string,
  password: string,
) {
  // hash password on client
  const hashedPassword = await bcrypt.hash(password, 10)

  const { error } = await supabase.from("users").insert({
    email,
    password: hashedPassword,
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
    .single()

  if (error || !user) {
    throw new Error("User not found")
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw new Error("Invalid password")
  }

  // store user (education only)
  localStorage.setItem("user", JSON.stringify(user))

  return user
}
