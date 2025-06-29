"use client"

import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Plus, Calendar, Users, Trophy, TrendingUp, Award, User } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { supabase } from "../../lib/supabase"

interface DashboardProps {
  onNavigate: (page: string) => void
}

interface PracticePlan {
  id: string
  title: string
  sport: string
  duration: number
  created_at: string
  selected_drills: string[]
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, signOut } = useAuth()
  const [recentPlans, setRecentPlans] = useState<PracticePlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRecentPlans()
    }
  }, [user])

  const fetchRecentPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("practice_plans")
        .select("id, title, sport, duration, created_at, selected_drills")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      setRecentPlans(data || [])
    } catch (error) {
      console.error("Error fetching practice plans:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-2 border-slate-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-display font-bold text-xl">Please Sign In</CardTitle>
            <CardDescription className="font-medium">You need to be signed in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full font-display font-semibold" onClick={() => onNavigate("landing")}>
              Go to Home Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url || "/placeholder.svg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-brand-200"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-display font-medium text-slate-700">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate("landing")}
              className="font-display font-medium text-slate-600 hover:text-brand-600"
            >
              Home
            </Button>
            <Button
              variant="outline"
              onClick={signOut}
              className="font-display font-medium border-slate-300 bg-transparent hover:bg-slate-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">
            Welcome back, Coach {user.user_metadata?.full_name?.split(" ")[0] || ""}!
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Ready to create some amazing practice plans with HeadCoachAI?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card
            className="border-2 border-dashed border-brand-300 hover:border-brand-400 bg-gradient-to-br from-brand-50 to-indigo-50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-glow"
            onClick={() => onNavigate("practice-builder")}
          >
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="font-display font-bold text-xl text-brand-700">Create New Practice</CardTitle>
              <CardDescription className="font-medium text-slate-600">
                Let HeadCoachAI help you build the perfect practice plan for your team
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-slate-200 hover:border-brand-300 hover:shadow-glow transition-all duration-300 cursor-pointer group shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="font-display font-bold text-xl text-slate-900">Practice Schedule</CardTitle>
              <CardDescription className="font-medium text-slate-600">
                View your upcoming practices and manage your coaching calendar
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-slate-200 hover:border-brand-300 hover:shadow-glow transition-all duration-300 cursor-pointer group shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="font-display font-bold text-xl text-slate-900">Team Management</CardTitle>
              <CardDescription className="font-medium text-slate-600">
                Manage players, track progress, and analyze team development
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity & Stats */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Practices */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center font-display font-bold text-xl">
                  <Calendar className="h-6 w-6 mr-3 text-brand-600" />
                  Your Recent Practice Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-4 bg-slate-100 rounded-xl">
                        <div className="h-5 bg-slate-300 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-slate-300 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentPlans.length > 0 ? (
                  <div className="space-y-4">
                    {recentPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:border-brand-300 transition-colors"
                      >
                        <div>
                          <h4 className="font-display font-bold text-slate-900 mb-1">{plan.title}</h4>
                          <p className="text-sm text-slate-600 font-medium mb-3">
                            {plan.sport} • {plan.duration} minutes • {new Date(plan.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            {plan.selected_drills.slice(0, 3).map((drill, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs font-display font-medium bg-brand-100 text-brand-700 border-brand-200"
                              >
                                {drill}
                              </Badge>
                            ))}
                            {plan.selected_drills.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="text-xs font-display font-medium bg-slate-100 text-slate-600"
                              >
                                +{plan.selected_drills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-display font-medium bg-transparent border-slate-300 hover:bg-brand-50 hover:border-brand-300"
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="font-display font-semibold text-lg mb-2">No practice plans yet</p>
                    <p className="text-sm font-medium">Create your first practice plan with HeadCoachAI!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats & Achievements */}
          <div className="space-y-6">
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center font-display font-bold text-xl">
                  <TrendingUp className="h-6 w-6 mr-3 text-brand-600" />
                  Coaching Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 font-display font-medium">Practice Plans Created</span>
                      <span className="font-display font-bold text-lg text-slate-900">{recentPlans.length}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-brand-500 to-brand-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (recentPlans.length / 10) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 font-display font-medium">HeadCoachAI Member Since</span>
                      <span className="font-display font-semibold text-slate-900">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center font-display font-bold text-xl">
                  <Award className="h-6 w-6 mr-3 text-brand-600" />
                  Coaching Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`flex items-center space-x-3 ${recentPlans.length > 0 ? "" : "opacity-50"}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        recentPlans.length > 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-500" : "bg-slate-200"
                      }`}
                    >
                      <Award className={`h-5 w-5 ${recentPlans.length > 0 ? "text-white" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm text-slate-900">First Practice Plan</p>
                      <p className="text-xs text-slate-600 font-medium">
                        {recentPlans.length > 0
                          ? "Created your first AI practice plan"
                          : "Create your first practice plan"}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center space-x-3 ${recentPlans.length >= 5 ? "" : "opacity-50"}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        recentPlans.length >= 5 ? "bg-gradient-to-br from-green-400 to-green-500" : "bg-slate-200"
                      }`}
                    >
                      <Award className={`h-5 w-5 ${recentPlans.length >= 5 ? "text-white" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm text-slate-900">Active Head Coach</p>
                      <p className="text-xs text-slate-600 font-medium">Create 5 practice plans</p>
                    </div>
                  </div>

                  <div className={`flex items-center space-x-3 ${recentPlans.length >= 10 ? "" : "opacity-50"}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        recentPlans.length >= 10 ? "bg-gradient-to-br from-blue-400 to-blue-500" : "bg-slate-200"
                      }`}
                    >
                      <Award className={`h-5 w-5 ${recentPlans.length >= 10 ? "text-white" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm text-slate-900">Dedicated Head Coach</p>
                      <p className="text-xs text-slate-600 font-medium">Create 10 practice plans</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}