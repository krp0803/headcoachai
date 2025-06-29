// Web search utility for finding sports drills
export interface DrillSearchResult {
  title: string
  description: string
  source: string
  url?: string
  equipment?: string[]
  duration?: string
  playerCount?: string
}

export async function searchSportsDrills(
  sport: string,
  focus: string,
  ageGroup: string,
  skillLevel: string,
): Promise<DrillSearchResult[]> {
  try {
    // Using Tavily API for web search (AI-optimized)
    const searchQuery = `${sport} drills ${focus} ${ageGroup} ${skillLevel} youth coaching practice exercises`

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query: searchQuery,
        search_depth: "basic",
        include_answer: false,
        include_images: false,
        include_raw_content: true,
        max_results: 8,
        include_domains: [
          "soccercoachweekly.net",
          "basketball-drills-and-plays.com",
          "baseballpositive.com",
          "volleyballadvantage.com",
          "youthfootballonline.com",
          "activekids.com",
          "stack.com",
          "usasoccer.com",
          "nfhs.org",
          "coachup.com",
          "breakthroughbasketball.com",
          "soccerxpert.com",
        ],
      }),
    })

    if (!response.ok) {
      console.warn("Tavily API failed, falling back to basic drills")
      return getFallbackDrills(sport, focus)
    }

    const data = await response.json()

    // Process search results to extract drill information
    const drills: DrillSearchResult[] =
      data.results?.map((result: any) => ({
        title: result.title,
        description: result.content?.substring(0, 300) + "...",
        source: result.url?.split("/")[2] || "Unknown",
        url: result.url,
      })) || []

    return drills.slice(0, 6) // Return top 6 results
  } catch (error) {
    console.error("Web search failed:", error)
    return []
  }
}

// Alternative: Use Serper API (Google Search)
export async function searchDrillsWithSerper(
  sport: string,
  focus: string,
  ageGroup: string,
): Promise<DrillSearchResult[]> {
  try {
    const searchQuery = `"${sport} drills" "${focus}" "${ageGroup}" youth coaching practice`

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": import.meta.env.VITE_SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: searchQuery,
        num: 8,
      }),
    })

    if (!response.ok) {
      throw new Error("Serper API failed")
    }

    const data = await response.json()

    const drills: DrillSearchResult[] =
      data.organic?.map((result: any) => ({
        title: result.title,
        description: result.snippet,
        source: result.displayLink,
        url: result.link,
      })) || []

    return drills.slice(0, 6)
  } catch (error) {
    console.error("Serper search failed:", error)
    return []
  }
}

// Fallback function if Tavily fails
export async function getFallbackDrills(sport: string, focus: string): Promise<DrillSearchResult[]> {
  // Return some basic drill suggestions as fallback
  const fallbackDrills: Record<string, DrillSearchResult[]> = {
    soccer: [
      {
        title: "Passing Accuracy Drill",
        description:
          "Set up cones in a square formation. Players pass to each corner, focusing on accuracy and first touch.",
        source: "coaching-basics",
      },
      {
        title: "1v1 Defending",
        description: "Defender tries to win the ball while attacker attempts to reach the goal line.",
        source: "coaching-basics",
      },
    ],
    basketball: [
      {
        title: "Dribbling Through Cones",
        description: "Set up cones in a zigzag pattern. Players dribble through using both hands.",
        source: "coaching-basics",
      },
      {
        title: "Shooting Form Practice",
        description: "Start close to basket, focus on proper shooting form and follow-through.",
        source: "coaching-basics",
      },
    ],
    // Add more sports as needed
  }

  return fallbackDrills[sport] || []
}