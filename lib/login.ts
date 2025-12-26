import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import  supabase  from "./supabase"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  // hash password
  const password_hash = await bcrypt.hash(password, 10)

  const { error } = await supabase.from("users").insert({
    name,
    email,
    password_hash,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: "User created" })
}
