"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { useAuth } from "../../contexts/AuthContext"
import { Github, Chrome, X, Trophy } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signInWithGoogle, signInWithGitHub } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  if (!isOpen) return null

  const handleGoogleSignIn = async () => {
    try {
      setLoading("google")
      await signInWithGoogle()
    } catch (error) {
      console.error("Error signing in with Google:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleGitHubSignIn = async () => {
    try {
      setLoading("github")
      await signInWithGitHub()
    } catch (error) {
      console.error("Error signing in with GitHub:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 border-2 border-slate-200 shadow-glow">
        <CardHeader className="relative text-center">
          <Button variant="ghost" size="sm" className="absolute right-2 top-2" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="font-display font-bold text-2xl text-slate-900">Welcome to HeadCoachAI</CardTitle>
          <CardDescription className="font-medium text-slate-600">
            Sign in to save your practice plans and track your coaching progress with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading !== null}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-brand-300 font-display font-semibold transition-all duration-200"
            variant="outline"
          >
            <Chrome className="h-5 w-5 mr-3" />
            {loading === "google" ? "Signing in..." : "Continue with Google"}
          </Button>

          <Button
            onClick={handleGitHubSignIn}
            disabled={loading !== null}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-semibold transition-all duration-200"
          >
            <Github className="h-5 w-5 mr-3" />
            {loading === "github" ? "Signing in..." : "Continue with GitHub"}
          </Button>

          <div className="text-center text-sm text-slate-500 mt-6 space-y-1">
            <p className="font-display font-medium">🏆 100% Free • No Credit Card Required</p>
            <p className="font-medium">Your data is secure and private</p>
            <p className="font-medium">Built specifically for head coaches</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}