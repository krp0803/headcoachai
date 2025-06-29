import { supabase } from "./supabase"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

// Get auth token from Supabase
const getAuthToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token
}

export interface PracticeRequest {
  sport: string
  duration: string
  playerCount?: string
  ageGroup?: string
  skillLevel?: string
  focus: string
  selectedDrills: string[]
}

export interface DrillSearchResult {
  title: string
  description: string
  source: string
  url?: string
}

export async function searchDrills(
  sport: string,
  focus: string,
  ageGroup = "",
  skillLevel = "",
): Promise<DrillSearchResult[]> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error("Please sign in to search for drills")
  }

  const params = new URLSearchParams({
    sport,
    focus,
    age_group: ageGroup,
    skill_level: skillLevel,
  })

  const response = await fetch(`${API_BASE_URL}/api/search-drills?${params}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to search drills" }))
    throw new Error(error.detail || "Failed to search drills")
  }

  return response.json()
}

export async function generatePracticePlan(
  request: PracticeRequest,
): Promise<{ generated_plan: string; web_drills_found: number; sources_used: string[] }> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error("Please sign in to generate practice plans")
  }

  const response = await fetch(`${API_BASE_URL}/api/generate-practice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to generate practice plan" }))
    throw new Error(error.detail || "Failed to generate practice plan")
  }

  return response.json()
}

export async function savePracticePlan(practice: {
  title: string
  sport: string
  duration: number
  age_group?: string
  skill_level?: string
  focus_areas?: string
  selected_drills: string[]
  generated_plan: string
}): Promise<{ success: boolean; id: string }> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error("Please sign in to save practice plans")
  }

  const response = await fetch(`${API_BASE_URL}/api/save-practice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(practice),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to save practice plan" }))
    throw new Error(error.detail || "Failed to save practice plan")
  }

  return response.json()
}

export async function getPracticePlans(limit = 10): Promise<any[]> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error("Please sign in to view practice plans")
  }

  const response = await fetch(`${API_BASE_URL}/api/practice-plans?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Failed to fetch practice plans" }))
    throw new Error(error.detail || "Failed to fetch practice plans")
  }

  return response.json()
}