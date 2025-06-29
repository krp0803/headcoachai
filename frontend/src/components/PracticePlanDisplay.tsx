"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Sparkles, Trophy } from "lucide-react"

interface PracticePlanDisplayProps {
  plan: string
  focus?: string
}

export function PracticePlanDisplay({ plan, focus }: PracticePlanDisplayProps) {
  // Clean up the text formatting but keep it simple
  const cleanText = (text: string) => {
    return text
      .replace(/\*\*/g, "") // Remove markdown bold
      .replace(/^\*\s*/gm, "• ") // Convert asterisks to bullets
      .replace(/^-\s*/gm, "• ") // Convert dashes to bullets
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  const lines = cleanText(plan)

  return (
    <Card className="border-2 border-brand-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center font-display font-bold text-xl">
          <Trophy className="h-6 w-6 mr-2 text-brand-600" />
          Your HeadCoachAI Practice Plan
        </CardTitle>
        {focus && (
          <Badge className="bg-gradient-to-r from-brand-100 to-indigo-100 text-brand-800 border-brand-200 font-display font-medium px-3 py-1 w-fit">
            <Sparkles className="w-4 h-4 mr-1" />
            Focus: {focus}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="bg-white p-6 rounded-xl border border-slate-200 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {lines.map((line, index) => (
              <div key={index} className="text-slate-700 leading-relaxed">
                {line.startsWith("•") ? (
                  <div className="flex items-start space-x-2">
                    <span className="text-brand-600 font-bold mt-1">•</span>
                    <span className="font-medium">{line.substring(1).trim()}</span>
                  </div>
                ) : line.includes(":") && line.length < 100 ? (
                  <h3 className="font-display font-bold text-lg text-slate-900 mt-4 first:mt-0">{line}</h3>
                ) : (
                  <p className="font-medium">{line}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}