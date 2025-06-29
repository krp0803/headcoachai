"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { CheckCircle, Users, Target, Globe, Zap, Heart, ArrowRight, Sparkles, Trophy } from "lucide-react"
import { LoginModal } from "../auth/LoginModal"
import { useAuth } from "../../contexts/AuthContext"

interface LandingPageProps {
  onNavigate: (page: string) => void
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, signOut } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      onNavigate("dashboard")
    } else {
      setShowLoginModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">HeadCoachAI</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="font-display font-medium text-slate-700 hover:text-brand-600 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#about"
              className="font-display font-medium text-slate-700 hover:text-brand-600 transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#community"
              className="font-display font-medium text-slate-700 hover:text-brand-600 transition-colors duration-200"
            >
              Community
            </a>
          </nav>
          <div className="space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => onNavigate("dashboard")} className="font-display font-medium">
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="font-display font-medium border-slate-300 bg-transparent"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-x-3">
                <Button variant="ghost" onClick={() => setShowLoginModal(true)} className="font-display font-medium">
                  Sign In
                </Button>
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 font-display font-semibold shadow-lg hover:shadow-glow transition-all duration-200"
                >
                  Get Started Free
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/5 to-indigo-600/5"></div>
        <div className="container mx-auto text-center relative">
          <Badge className="mb-6 bg-gradient-to-r from-brand-100 to-indigo-100 text-brand-800 border-brand-200 font-display font-medium px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            100% Free for All Youth Sports Coaches
          </Badge>
          <h1 className="text-6xl md:text-7xl font-display font-bold text-slate-900 mb-8 leading-tight">
            <span className="text-gradient">HeadCoachAI</span> - Your AI Assistant for{" "}
            <span className="text-gradient">Youth Sports</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            Create engaging, age-appropriate practice plans in minutes. Our AI understands youth development and helps
            head coaches build better athletes while keeping kids excited about sports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 font-display font-semibold text-lg px-8 py-4 shadow-glow hover:shadow-glow-lg transition-all duration-300"
              onClick={handleGetStarted}
            >
              Start Coaching Smarter
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-display font-semibold text-lg px-8 py-4 border-2 border-slate-300 hover:border-brand-300 hover:bg-brand-50 transition-all duration-200 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
          <div className="flex justify-center items-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-brand-500 mr-2" />
              <span className="font-display font-medium">Always 100% Free</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-brand-500 mr-2" />
              <span className="font-display font-medium">No Credit Card Required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-brand-500 mr-2" />
              <span className="font-display font-medium">Built for Head Coaches</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-display font-bold text-slate-900 mb-6">Everything Head Coaches Need</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Built specifically for youth sports with age-appropriate drills, safety protocols, and development
              tracking. All features are completely free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-slate-200 hover:border-brand-300 hover:shadow-glow transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="font-display font-bold text-xl text-slate-900">
                  AI-Powered Practice Plans
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium leading-relaxed">
                  Generate comprehensive practice plans tailored to your team's age, skill level, and specific focus
                  areas using advanced AI.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-brand-300 hover:shadow-glow transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="font-display font-bold text-xl text-slate-900">
                  Real-Time Drill Research
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium leading-relaxed">
                  Access the latest drills from top coaching websites. Our AI searches and incorporates current best
                  practices into your plans.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-brand-300 hover:shadow-glow transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="font-display font-bold text-xl text-slate-900">Multi-Sport Support</CardTitle>
                <CardDescription className="text-slate-600 font-medium leading-relaxed">
                  Soccer, Basketball, Baseball, Volleyball, Flag Football - HeadCoachAI supports all major youth sports
                  with sport-specific expertise.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-brand-300 hover:shadow-glow transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="font-display font-bold text-xl text-slate-900">Safety-First Protocols</CardTitle>
                <CardDescription className="text-slate-600 font-medium leading-relaxed">
                  Built-in injury prevention, proper warm-ups, and age-appropriate intensity monitoring for youth
                  athletes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-brand-300 hover:shadow-glow transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="font-display font-bold text-xl text-slate-900">Coaching Intelligence</CardTitle>
                <CardDescription className="text-slate-600 font-medium leading-relaxed">
                  Save your practice history, track team progress, and let AI learn your coaching style to provide
                  better recommendations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-brand-300 hover:shadow-glow transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="font-display font-bold text-xl text-slate-900">Head Coach Tools</CardTitle>
                <CardDescription className="text-slate-600 font-medium leading-relaxed">
                  Professional-grade tools designed specifically for head coaches managing youth teams and developing
                  young athletes.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Single Free Tier Section */}
      <section id="about" className="py-24 px-4 bg-gradient-to-br from-slate-900 to-dark-900 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-display font-bold mb-6">Free Forever, For Every Head Coach</h2>
            <p className="text-xl text-slate-300 font-medium">
              We believe every youth coach should have access to professional-grade tools, regardless of budget.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-brand-400 bg-gradient-to-br from-white to-slate-50 shadow-glow-lg">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-4xl font-display font-bold text-slate-900">100% Free</CardTitle>
                <CardDescription className="text-lg text-slate-600 font-medium">
                  Everything you need to be an amazing head coach
                </CardDescription>
                <div className="text-6xl font-display font-bold text-gradient py-4">$0</div>
                <p className="text-sm text-slate-500 font-display font-medium">Forever and always</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    "Unlimited AI-generated practice plans",
                    "Real-time drill research from coaching websites",
                    "Multi-sport support and expertise",
                    "Personal coaching history and progress tracking",
                    "Age-appropriate safety protocols",
                    "Professional head coach tools",
                    "Secure cloud storage for all your plans",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-brand-500 mr-4 flex-shrink-0" />
                      <span className="font-display font-medium text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-8 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 font-display font-semibold text-lg py-4 shadow-glow hover:shadow-glow-lg transition-all duration-300"
                  onClick={handleGetStarted}
                >
                  Start Coaching with AI - Free!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-display font-bold text-gradient">HeadCoachAI</span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                Empowering youth sports head coaches with free AI-powered practice planning.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-white">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a href="#features" className="font-display font-medium hover:text-brand-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="font-display font-medium hover:text-brand-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/demo" className="font-display font-medium hover:text-brand-400 transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-white">Community</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a href="/templates" className="font-display font-medium hover:text-brand-400 transition-colors">
                    Practice Templates
                  </a>
                </li>
                <li>
                  <a href="/coaches" className="font-display font-medium hover:text-brand-400 transition-colors">
                    Find Coaches
                  </a>
                </li>
                <li>
                  <a href="/blog" className="font-display font-medium hover:text-brand-400 transition-colors">
                    Coaching Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <a href="/help" className="font-display font-medium hover:text-brand-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/contact" className="font-display font-medium hover:text-brand-400 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="font-display font-medium hover:text-brand-400 transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p className="font-display font-medium">
              &copy; 2025 HeadCoachAI. Made with ❤️ for youth sports coaches. Always free.
            </p>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  )
}