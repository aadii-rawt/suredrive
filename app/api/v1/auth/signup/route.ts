import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { message: error?.message || "Signup failed" },
        { status: 400 }
      );
    }


    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .insert({
        id: data.user.id,
        name,
        email,
      })
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { message: profileError.message },
        { status: 500 }
      );
    }

   
    return NextResponse.json(
      {
        message: "Signup successful",
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile.name,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
