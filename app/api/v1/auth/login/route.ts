import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Login user using Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { message: error?.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2️⃣ Fetch user profile from DB
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("id, name, email, created_at")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Return user data
    return NextResponse.json(
      {
        message: "Login successful",
        user: profile,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
