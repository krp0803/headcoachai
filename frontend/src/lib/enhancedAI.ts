import { searchSportsDrills, getFallbackDrills } from "./webSearch"

export interface EnhancedPracticeRequest {
  sport: string
  duration: string
  playerCount: string
  ageGroup: string
  skillLevel: string
  focus: string
  selectedDrills: string[]
}

export async function generateEnhancedPracticePlan(request: EnhancedPracticeRequest): Promise<string> {
  try {
    // Step 1: Search for relevant drills online using Tavily
    console.log("Searching for drills using Tavily API...")
    let webDrills = await searchSportsDrills(request.sport, request.focus, request.ageGroup, request.skillLevel)

    // Fallback to basic drills if web search fails
    if (webDrills.length === 0) {
      console.log("Using fallback drills...")
      webDrills = await getFallbackDrills(request.sport, request.focus)
    }

    // Step 2: Create enhanced prompt with web research
    const webDrillsContext =
      webDrills.length > 0
        ? `\n\nRECENT DRILL RESEARCH FROM COACHING WEBSITES:\n${webDrills
            .map(
              (drill, index) =>
                `${index + 1}. ${drill.title}\n   Description: ${drill.description}\n   Source: ${drill.source}\n`,
            )
            .join("\n")}`
        : "\n\nNote: Using standard coaching principles and proven drill techniques."

    const enhancedPrompt = `Create a detailed youth sports practice plan using the latest coaching techniques and drills.

PRACTICE REQUIREMENTS:
- Sport: ${request.sport}
- Duration: ${request.duration} minutes
- Players: ${request.playerCount || "Not specified"}
- Age Group: ${request.ageGroup || "Not specified"}
- Skill Level: ${request.skillLevel || "Not specified"}
- Primary Focus: ${request.focus || "General skill development for ${request.sport}"}
- Selected Drills: ${request.selectedDrills.length > 0 ? request.selectedDrills.join(", ") : "None specified"}

${webDrillsContext}

INSTRUCTIONS:
1. Use the drill research above to inspire specific, detailed drill descriptions
2. Include exact setup instructions, equipment needed, and coaching points
3. Provide variations for different skill levels within the group
4. Include timing for each activity segment
5. Add safety considerations and modifications
6. Reference coaching sources when applicable
7. Make drills engaging and age-appropriate
8. Focus heavily on the specified practice focus areas

Create a comprehensive practice plan that incorporates modern coaching techniques and specific drills found in current coaching resources. Make it actionable and detailed enough for any coach to follow.`

    // Step 3: Generate AI response with enhanced context
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert youth sports coach with access to the latest coaching resources and drill databases. You specialize in creating detailed, research-backed practice plans that incorporate proven drills from top coaching websites and organizations. 

Your practice plans should:
- Reference specific drills with detailed setup instructions
- Include exact equipment lists and field/court setup diagrams
- Provide multiple variations for different skill levels
- Include specific coaching cues and teaching points
- Emphasize safety and age-appropriate progressions
- Be engaging and fun for young athletes
- Include timing and transitions between activities

Always cite when you're using inspiration from coaching resources and adapt drills to fit the specific team's needs.`,
          },
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || "Failed to generate enhanced practice plan")
    }

    const data = await response.json()
    const generatedContent = data.choices[0]?.message?.content

    if (!generatedContent) {
      throw new Error("No content generated")
    }

    return generatedContent
  } catch (error) {
    console.error("Enhanced AI generation failed:", error)
    throw error
  }
}