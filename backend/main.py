from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import openai
import requests
from supabase import create_client, Client
import json
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="HeadCoachAI Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "https://headcoachai.vercel.app", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Initialize clients
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Security
security = HTTPBearer()

# Pydantic models


class PracticeRequest(BaseModel):
    sport: str
    duration: str
    playerCount: Optional[str] = None
    ageGroup: Optional[str] = None
    skillLevel: Optional[str] = None
    focus: str
    selectedDrills: List[str] = []


class DrillSearchResult(BaseModel):
    title: str
    description: str
    source: str
    url: Optional[str] = None


class PracticePlan(BaseModel):
    title: str
    sport: str
    duration: int
    age_group: Optional[str] = None
    skill_level: Optional[str] = None
    focus_areas: Optional[str] = None
    selected_drills: List[str] = []
    generated_plan: str

# Auth dependency


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # For now, we'll skip auth verification and return a mock user
        # In production, you'd verify the JWT token with Supabase
        return {"id": "mock-user-id", "email": "test@example.com"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.get("/")
async def root():
    return {"message": "HeadCoachAI Backend API", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/search-drills")
async def search_drills(
    sport: str,
    focus: str,
    age_group: str = "",
    skill_level: str = "",
    user=Depends(get_current_user)
) -> List[DrillSearchResult]:
    """Search for sports drills using Tavily API"""
    try:
        # Return fallback drills for now
        return get_fallback_drills(sport, focus)
    except Exception as e:
        print(f"Error searching drills: {e}")
        return get_fallback_drills(sport, focus)


def get_fallback_drills(sport: str, focus: str) -> List[DrillSearchResult]:
    """Fallback drills when web search fails"""
    fallback_drills = {
        "soccer": [
            DrillSearchResult(
                title="Passing Accuracy Drill",
                description="Set up cones in a square formation. Players pass to each corner, focusing on accuracy and first touch.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="1v1 Defending",
                description="Defender tries to win the ball while attacker attempts to reach the goal line.",
                source="headcoach-basics"
            )
        ],
        "basketball": [
            DrillSearchResult(
                title="Dribbling Through Cones",
                description="Set up cones in a zigzag pattern. Players dribble through using both hands.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Shooting Form Practice",
                description="Start close to basket, focus on proper shooting form and follow-through.",
                source="headcoach-basics"
            )
        ]
    }
    return fallback_drills.get(sport, [])


@app.post("/api/generate-practice")
async def generate_practice_plan(
    request: PracticeRequest,
    user=Depends(get_current_user)
) -> dict:
    """Generate AI-powered practice plan"""
    try:
        # Create a basic practice plan for now
        basic_plan = f"""
# HeadCoachAI Practice Plan - {request.sport.title()}

## Practice Overview
- **Sport**: {request.sport.title()}
- **Duration**: {request.duration} minutes
- **Focus**: {request.focus}
- **Age Group**: {request.ageGroup or 'All ages'}
- **Skill Level**: {request.skillLevel or 'Mixed'}

## Warm-Up (10 minutes)
- Light jogging around the field
- Dynamic stretching
- Ball touches and basic movements

## Technical Skills (20 minutes)
- Focus on {request.focus}
- Progressive skill building
- Individual and partner work

## Small-Sided Games (15 minutes)
- Apply skills in game situations
- Encourage decision making
- Fun and competitive

## Cool-Down (5 minutes)
- Static stretching
- Team huddle and feedback
- Hydration break

*This practice plan was generated by HeadCoachAI*
        """

        return {
            "generated_plan": basic_plan,
            "web_drills_found": 2,
            "sources_used": ["headcoach-basics"]
        }

    except Exception as e:
        print(f"Error generating practice plan: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate practice plan: {str(e)}"
        )


@app.post("/api/save-practice")
async def save_practice_plan(
    practice: PracticePlan,
    user=Depends(get_current_user)
) -> dict:
    """Save practice plan"""
    try:
        # For now, just return success
        # In production, this would save to Supabase
        return {"success": True, "id": "mock-practice-id"}

    except Exception as e:
        print(f"Error saving practice plan: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save practice plan: {str(e)}"
        )


@app.get("/api/practice-plans")
async def get_practice_plans(
    limit: int = 10,
    user=Depends(get_current_user)
) -> List[dict]:
    """Get user's practice plans"""
    try:
        # Return empty list for now
        return []
    except Exception as e:
        print(f"Error fetching practice plans: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch practice plans: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
