'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [registered, setRegistered] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setMessage("")

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      if (data.user) {
        await supabase.from('users').update({ full_name: fullName }).eq('id', data.user.id)
      }
      setRegistered(true)
      setMessage("Check your email for a verification link!")
    }

    setLoading(false)
  }

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setMessage(error ? error.message : "Verification email resent!")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              placeholder="Juan dela Cruz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          {message && (
            <p className="text-sm text-center text-muted-foreground">
              {message}
            </p>
          )}

          {registered && (
            <p className="text-sm text-center">
              Didn't receive it?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={handleResend}
              >
                Resend email
              </Button>
            </p>
          )}

        </CardContent>
      </Card>
    </div>
  )
}