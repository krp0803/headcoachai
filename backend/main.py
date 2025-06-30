from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import requests
import json
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="HeadCoachAI Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

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

# Auth dependency (simplified for now)


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
            ),
            DrillSearchResult(
                title="Ball Control Circuit",
                description="Players move through stations working on different touches: inside foot, outside foot, sole, and laces.",
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
            ),
            DrillSearchResult(
                title="Defensive Slides",
                description="Players practice defensive stance and lateral movement along the baseline.",
                source="headcoach-basics"
            )
        ],
        "baseball": [
            DrillSearchResult(
                title="Tee Work Progression",
                description="Start with tee at different heights, focus on level swing and contact point.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Fielding Fundamentals",
                description="Ground ball practice with proper footwork and glove positioning.",
                source="headcoach-basics"
            )
        ],
        "volleyball": [
            DrillSearchResult(
                title="Bump Set Spike",
                description="Three-person drill focusing on the basic volleyball sequence.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Serving Accuracy",
                description="Target practice with serves to different zones of the court.",
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
        # Create a comprehensive practice plan
        sport_title = request.sport.title()
        duration = int(request.duration) if request.duration else 60

        # Calculate time segments
        warmup_time = max(5, duration // 6)
        skill_time = max(15, duration // 3)
        game_time = max(10, duration // 4)
        cooldown_time = max(5, duration // 12)

        practice_plan = f"""# 🏆 HeadCoachAI Practice Plan - {sport_title}

## 📋 Practice Overview
- **Sport**: {sport_title}
- **Duration**: {duration} minutes
- **Focus**: {request.focus}
- **Age Group**: {request.ageGroup or 'All ages'}
- **Skill Level**: {request.skillLevel or 'Mixed'}
- **Players**: {request.playerCount or 'Flexible'}

## 🔥 Warm-Up ({warmup_time} minutes)
**Objective**: Prepare body and mind for practice

### Dynamic Movement (5 minutes)
- Light jogging around the field/court
- High knees, butt kicks, side shuffles
- Arm circles and leg swings

### Sport-Specific Warm-up ({warmup_time-5} minutes)
- {sport_title}-specific movements
- Ball touches and basic skills
- Gradual intensity increase

**Coaching Points**: 
- Emphasize proper form over speed
- Check for any injuries or concerns
- Build energy and focus

## ⚽ Technical Skills Development ({skill_time} minutes)
**Primary Focus**: {request.focus}

### Skill Station 1 ({skill_time//2} minutes)
- Progressive skill building related to {request.focus}
- Individual technique work
- Immediate feedback and correction

### Skill Station 2 ({skill_time//2} minutes)
- Partner/small group application
- Add pressure and decision-making
- Competition element to maintain engagement

**Coaching Points**:
- Break down complex skills into simple steps
- Use positive reinforcement
- Ensure all players get equal attention
- Modify difficulty based on individual needs

## 🎯 Game Application ({game_time} minutes)
**Objective**: Apply skills in game-like situations

### Small-Sided Games
- Reduced numbers to increase touches
- Modified rules to emphasize {request.focus}
- Rotate teams to ensure equal playing time

### Competitive Drills
- Fun competitions that reinforce skills
- Team vs team challenges
- Individual skill contests

**Coaching Points**:
- Let players make mistakes and learn
- Encourage communication
- Praise good decision-making
- Keep games moving and energetic

## 🧘 Cool-Down & Wrap-Up ({cooldown_time} minutes)
**Objective**: Proper recovery and reflection

### Physical Cool-Down (3 minutes)
- Light walking or easy movement
- Static stretching for major muscle groups
- Deep breathing exercises

### Team Huddle (2 minutes)
- Highlight positive moments from practice
- Ask players what they learned
- Preview next practice/game
- Team cheer or motivational moment

## 🎯 Key Teaching Points for {sport_title}
- Safety first - proper technique prevents injuries
- Encourage creativity and decision-making
- Focus on effort and improvement, not perfection
- Make it fun - youth sports should be enjoyable!

## 📝 Equipment Needed
- {sport_title} balls (one per 2-3 players)
- Cones or markers
- Water bottles for hydration
- First aid kit
- Positive attitude and enthusiasm!

## 🔄 Modifications for Different Skill Levels
**Beginners**: Slow down pace, more demonstrations, simpler rules
**Intermediate**: Add complexity, increase speed, introduce tactics
**Advanced**: Higher intensity, advanced techniques, leadership roles

---
*This practice plan was generated by HeadCoachAI - Your AI assistant for youth sports coaching*
*Remember: Every child is different. Adapt this plan to meet your team's specific needs!*
        """

        # Add selected drills if any
        if request.selectedDrills:
            practice_plan += f"\n\n## 🎯 Your Selected Drills\n"
            for i, drill in enumerate(request.selectedDrills, 1):
                practice_plan += f"{i}. **{drill}** - Incorporate into appropriate practice segments\n"

        return {
            "generated_plan": practice_plan,
            "web_drills_found": len(get_fallback_drills(request.sport, request.focus)),
            "sources_used": ["headcoach-basics", "youth-sports-fundamentals"]
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
        return {"success": True, "id": f"practice-{datetime.now().strftime('%Y%m%d%H%M%S')}"}

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
        # Return sample data for now
        sample_plans = [
            {
                "id": "sample-1",
                "title": "Soccer - U10 Passing Focus",
                "sport": "soccer",
                "duration": 60,
                "created_at": "2024-01-15T10:00:00Z",
                "selected_drills": ["Passing Accuracy", "1v1 Defending"]
            },
            {
                "id": "sample-2",
                "title": "Basketball - U12 Shooting",
                "sport": "basketball",
                "duration": 75,
                "created_at": "2024-01-14T15:30:00Z",
                "selected_drills": ["Shooting Form", "Dribbling"]
            }
        ]
        return sample_plans[:limit]
    except Exception as e:
        print(f"Error fetching practice plans: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch practice plans: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
