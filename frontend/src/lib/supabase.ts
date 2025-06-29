import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables!")
  console.log("VITE_SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing")
  console.log("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Set" : "✗ Missing")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("practice_plans").select("count").limit(1)
    if (error) throw error
    console.log("✅ Supabase connection successful")
    return true
  } catch (error) {
    console.error("❌ Supabase connection failed:", error)
    return false
  }
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      practice_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          sport: string
          duration: number
          age_group: string | null
          skill_level: string | null
          focus_areas: string | null
          selected_drills: string[]
          generated_plan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          sport: string
          duration: number
          age_group?: string | null
          skill_level?: string | null
          focus_areas?: string | null
          selected_drills?: string[]
          generated_plan: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          sport?: string
          duration?: number
          age_group?: string | null
          skill_level?: string | null
          focus_areas?: string | null
          selected_drills?: string[]
          generated_plan?: string
          updated_at?: string
        }
      }
    }
  }
}