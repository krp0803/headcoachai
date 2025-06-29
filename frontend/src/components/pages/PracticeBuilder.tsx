"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Separator } from "../ui/separator"
import { Trophy, Clock, Users, Plus, X, Save, AlertCircle, Globe, Sparkles } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { generatePracticePlan, savePracticePlan } from "../../lib/api"
import { PracticePlanDisplay } from "../PracticePlanDisplay"

interface PracticeBuilderProps {
  onNavigate: (page: string) => void
}

export default function PracticeBuilder({ onNavigate }: PracticeBuilderProps) {
  const { user } = useAuth()
  const [selectedDrills, setSelectedDrills] = useState<string[]>([])
  const [practiceDetails, setPracticeDetails] = useState({
    sport: "",
    duration: "",
    playerCount: "",
    ageGroup: "",
    skillLevel: "",
    focus: "",
  })
  const [generatedPlan, setGeneratedPlan] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [searchStatus, setSearchStatus] = useState("")
  const [webDrillsFound, setWebDrillsFound] = useState(0)
  const [sourcesUsed, setSourcesUsed] = useState<string[]>([])

  const drillCategories = {
    "Warm-up": ["Dynamic Stretching", "Light Jogging", "Ball Touches"],
    "Technical Skills": ["Passing", "Shooting", "Dribbling", "First Touch"],
    Tactical: ["Positioning", "Set Pieces", "Game Situations"],
    Physical: ["Agility", "Speed", "Endurance", "Strength"],
    "Cool-down": ["Static Stretching", "Recovery", "Team Talk"],
  }

  const addDrill = (drill: string) => {
    if (!selectedDrills.includes(drill)) {
      setSelectedDrills([...selectedDrills, drill])
    }
  }

  const removeDrill = (drill: string) => {
    setSelectedDrills(selectedDrills.filter((d) => d !== drill))
  }

  const generatePracticePlanHandler = async () => {
    if (!user) {
      setError("Please sign in to generate practice plans")
      return
    }

    if (!practiceDetails.sport || !practiceDetails.duration) {
      setError("Please select sport and duration")
      return
    }

    setIsGenerating(true)
    setError("")
    setSearchStatus("HeadCoachAI is researching the latest drills online...")

    try {
      const result = await generatePracticePlan({
        sport: practiceDetails.sport,
        duration: practiceDetails.duration,
        playerCount: practiceDetails.playerCount,
        ageGroup: practiceDetails.ageGroup,
        skillLevel: practiceDetails.skillLevel,
        focus: practiceDetails.focus,
        selectedDrills: selectedDrills,
      })

      setGeneratedPlan(result.generated_plan)
      setWebDrillsFound(result.web_drills_found)
      setSourcesUsed(result.sources_used)
      setSearchStatus("")
    } catch (error: any) {
      console.error("Error generating practice plan:", error)
      setError(`Failed to generate practice plan: ${error.message}`)
      setSearchStatus("")
    } finally {
      setIsGenerating(false)
    }
  }

  const savePracticePlanHandler = async () => {
    if (!user || !generatedPlan) {
      setError("Missing user or practice plan data")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const title =
        `${practiceDetails.sport || "Practice"} - ${practiceDetails.ageGroup || ""} ${practiceDetails.skillLevel || ""}`.trim()

      const result = await savePracticePlan({
        title: title,
        sport: practiceDetails.sport || "general",
        duration: practiceDetails.duration ? Number.parseInt(practiceDetails.duration) : 60,
        age_group: practiceDetails.ageGroup || undefined,
        skill_level: practiceDetails.skillLevel || undefined,
        focus_areas: practiceDetails.focus || undefined,
        selected_drills: selectedDrills,
        generated_plan: generatedPlan,
      })

      if (result.success) {
        alert("Practice plan saved successfully!")
        setTimeout(() => {
          onNavigate("dashboard")
        }, 500)
      }
    } catch (error: any) {
      console.error("Error saving practice plan:", error)
      setError(`Failed to save practice plan: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>You need to be signed in to create practice plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => onNavigate("landing")}>
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
            <Button variant="outline" onClick={() => onNavigate("dashboard")} className="font-display font-medium">
              Back to Dashboard
            </Button>
            {generatedPlan && (
              <Button
                variant="outline"
                onClick={savePracticePlanHandler}
                disabled={isSaving}
                className="font-display font-medium bg-transparent"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Plan"}
              </Button>
            )}
            <Button
              className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 font-display font-semibold shadow-lg hover:shadow-glow transition-all duration-200"
              onClick={generatePracticePlanHandler}
              disabled={isGenerating || !practiceDetails.sport || !practiceDetails.duration}
            >
              <Globe className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate with HeadCoachAI"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">HeadCoachAI Practice Builder</h1>
          <p className="text-lg text-slate-600 font-medium">
            Create professional practice plans powered by AI and real-time research of the latest coaching techniques.
          </p>
          <div className="flex items-center mt-3 text-sm text-brand-600">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="font-display font-medium">
              Now includes live drill research from top coaching websites
            </span>
          </div>
        </div>

        {/* Search Status */}
        {searchStatus && (
          <div className="mb-6">
            <Card className="border-brand-200 bg-brand-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-brand-700">
                  <Globe className="h-5 w-5 animate-spin" />
                  <p className="font-display font-medium">{searchStatus}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Status */}
        {webDrillsFound > 0 && (
          <div className="mb-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-green-700">
                  <Sparkles className="h-5 w-5" />
                  <p className="font-display font-medium">
                    HeadCoachAI found {webDrillsFound} drills from {sourcesUsed.length} coaching websites!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-display font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Practice Details */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display font-bold text-xl">Practice Details</CardTitle>
                <CardDescription className="font-medium">
                  Tell HeadCoachAI about your team and session goals for personalized drill research
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sport" className="font-display font-medium">
                    Sport *
                  </Label>
                  <Select
                    value={practiceDetails.sport}
                    onChange={(e) => setPracticeDetails({ ...practiceDetails, sport: e.target.value })}
                    required
                    className="font-medium"
                  >
                    <option value="">Select sport</option>
                    <option value="soccer">Soccer</option>
                    <option value="basketball">Basketball</option>
                    <option value="baseball">Baseball</option>
                    <option value="volleyball">Volleyball</option>
                    <option value="flag-football">Flag Football</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration" className="font-display font-medium">
                    Duration (minutes) *
                  </Label>
                  <Select
                    value={practiceDetails.duration}
                    onChange={(e) => setPracticeDetails({ ...practiceDetails, duration: e.target.value })}
                    required
                    className="font-medium"
                  >
                    <option value="">Select duration</option>
                    <option value="60">60 minutes</option>
                    <option value="75">75 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="players" className="font-display font-medium">
                    Number of Players
                  </Label>
                  <Input
                    id="players"
                    placeholder="e.g., 12-15"
                    value={practiceDetails.playerCount}
                    onChange={(e) => setPracticeDetails({ ...practiceDetails, playerCount: e.target.value })}
                    className="font-medium"
                  />
                </div>

                <div>
                  <Label htmlFor="age" className="font-display font-medium">
                    Age Group
                  </Label>
                  <Select
                    value={practiceDetails.ageGroup}
                    onChange={(e) => setPracticeDetails({ ...practiceDetails, ageGroup: e.target.value })}
                    className="font-medium"
                  >
                    <option value="">Select age group</option>
                    <option value="u8">Under 8</option>
                    <option value="u10">Under 10</option>
                    <option value="u12">Under 12</option>
                    <option value="u14">Under 14</option>
                    <option value="u16">Under 16</option>
                    <option value="u18">Under 18</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="skill" className="font-display font-medium">
                    Skill Level
                  </Label>
                  <Select
                    value={practiceDetails.skillLevel}
                    onChange={(e) => setPracticeDetails({ ...practiceDetails, skillLevel: e.target.value })}
                    className="font-medium"
                  >
                    <option value="">Select skill level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="focus" className="font-display font-medium">
                    Practice Focus *
                  </Label>
                  <Textarea
                    id="focus"
                    placeholder="What specific skills do you want to work on? (e.g., passing accuracy under pressure, defensive positioning, ball control in tight spaces)"
                    value={practiceDetails.focus}
                    onChange={(e) => setPracticeDetails({ ...practiceDetails, focus: e.target.value })}
                    className="min-h-[100px] font-medium"
                  />
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Be specific - this helps HeadCoachAI find the most relevant drills from coaching websites
                  </p>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 font-display font-semibold shadow-lg hover:shadow-glow transition-all duration-200"
                  onClick={generatePracticePlanHandler}
                  disabled={isGenerating || !practiceDetails.sport || !practiceDetails.duration}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {isGenerating ? "HeadCoachAI Working..." : "Generate with HeadCoachAI"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Practice Plan */}
          {generatedPlan && (
            <div className="lg:col-span-2">
              <PracticePlanDisplay plan={generatedPlan} focus={practiceDetails.focus} />
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={savePracticePlanHandler}
                  disabled={isSaving}
                  className="font-display font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Plan"}
                </Button>
                <Button
                  variant="outline"
                  onClick={generatePracticePlanHandler}
                  disabled={isGenerating}
                  className="font-display font-medium bg-transparent"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Research New Drills
                </Button>
              </div>
            </div>
          )}

          {/* Selected Drills and Drill Library remain the same but with updated styling */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-display font-bold text-xl">
                <Clock className="h-6 w-6 mr-2 text-brand-600" />
                Selected Drills (Optional)
              </CardTitle>
              <CardDescription className="font-medium">
                {selectedDrills.length > 0
                  ? `${selectedDrills.length} drills selected - these will be included in your HeadCoachAI-generated plan`
                  : "Select specific drills to include, or let HeadCoachAI choose the best ones for your focus"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDrills.length > 0 ? (
                <div className="space-y-3">
                  {selectedDrills.map((drill, index) => (
                    <div key={drill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-semibold text-green-600">
                          {index + 1}
                        </div>
                        <span className="font-medium">{drill}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeDrill(drill)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No specific drills selected</p>
                  <p className="text-sm">HeadCoachAI will choose the best drills based on your practice focus</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Drill Library */}
          <Card className="border-2 border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display font-bold text-xl">Drill Library</CardTitle>
              <CardDescription className="font-medium">
                Choose from our curated collection of youth-appropriate drills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(drillCategories).map(([category, drills]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {drills.map((drill) => (
                        <Button
                          key={drill}
                          variant={selectedDrills.includes(drill) ? "default" : "outline"}
                          size="sm"
                          className="justify-start font-display font-medium"
                          onClick={() => (selectedDrills.includes(drill) ? removeDrill(drill) : addDrill(drill))}
                        >
                          {selectedDrills.includes(drill) ? (
                            <X className="h-3 w-3 mr-2" />
                          ) : (
                            <Plus className="h-3 w-3 mr-2" />
                          )}
                          {drill}
                        </Button>
                      ))}
                    </div>
                    {category !== "Cool-down" && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}