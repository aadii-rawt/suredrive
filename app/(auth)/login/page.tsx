"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import api from "@/lib/axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("demo@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted px-4">
    
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button onClick={handleLogin} className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-primary underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>

     
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-sm text-muted-foreground">
        Made with 🩶 by{" "}
        <Link
          href="https://aditya.dotdazzle.in"
          className="underline hover:text-foreground"
          target="_blank"
        >
          Aditya Rawat
        </Link>
      </footer>
    </div>
  );
}
