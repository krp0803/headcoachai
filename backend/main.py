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
            ),
            DrillSearchResult(
                title="Small-Sided Games",
                description="4v4 or 3v3 games in small areas to increase touches and decision-making opportunities.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Shooting Technique",
                description="Progressive shooting drill starting close to goal, focusing on placement over power.",
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
            ),
            DrillSearchResult(
                title="Layup Lines",
                description="Classic drill for practicing layups from both sides of the basket.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Passing Fundamentals",
                description="Partner passing focusing on chest pass, bounce pass, and overhead pass.",
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
            ),
            DrillSearchResult(
                title="Throwing Accuracy",
                description="Partner throwing focusing on proper mechanics and accuracy to target.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Base Running",
                description="Practice proper running form and base running techniques.",
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
            ),
            DrillSearchResult(
                title="Pepper Drill",
                description="Continuous bump, set, spike between partners to develop ball control.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Blocking Technique",
                description="Practice proper blocking form and timing at the net.",
                source="headcoach-basics"
            )
        ],
        "flag-football": [
            DrillSearchResult(
                title="Route Running",
                description="Practice basic routes: slant, out, go, and comeback patterns.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Flag Pulling",
                description="Defensive drill focusing on proper flag pulling technique.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Quarterback Accuracy",
                description="Throwing drills with targets at different distances and heights.",
                source="headcoach-basics"
            ),
            DrillSearchResult(
                title="Center-QB Exchange",
                description="Practice proper snap technique and quarterback footwork.",
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
- Sport-specific movement patterns

### Sport-Specific Warm-up ({warmup_time-5} minutes)
- {sport_title}-specific movements and touches
- Ball handling and basic skills at low intensity
- Gradual intensity increase
- Partner warm-up activities

**Coaching Points**: 
- Emphasize proper form over speed
- Check for any injuries or concerns
- Build energy and focus for the session
- Encourage communication between players

## ⚽ Technical Skills Development ({skill_time} minutes)
**Primary Focus**: {request.focus}

### Skill Station 1 ({skill_time//2} minutes)
- Progressive skill building related to {request.focus}
- Individual technique work with immediate feedback
- Break down complex movements into simple steps
- Use demonstrations and guided practice

### Skill Station 2 ({skill_time//2} minutes)
- Partner/small group application of skills
- Add pressure and decision-making elements
- Competitive drills to maintain engagement
- Rotate players through different roles

**Coaching Points**:
- Focus on quality over quantity
- Provide specific, actionable feedback
- Celebrate improvement and effort
- Modify difficulty based on individual player needs
- Keep players active and engaged

## 🎯 Game Application ({game_time} minutes)
**Objective**: Apply skills in game-like situations

### Small-Sided Games ({game_time//2} minutes)
- Reduced numbers (3v3, 4v4) to increase touches
- Modified rules to emphasize {request.focus}
- Multiple fields/courts for maximum participation
- Quick rotations to keep energy high

### Competitive Challenges ({game_time//2} minutes)
- Skills competitions and team challenges
- Fun games that reinforce technique
- Individual and team scoring systems
- Positive competition and sportsmanship

**Coaching Points**:
- Let players make mistakes and learn
- Encourage communication and teamwork
- Praise good decision-making over results
- Keep games moving with quick transitions
- Focus on fun while maintaining structure

## 🧘 Cool-Down & Wrap-Up ({cooldown_time} minutes)
**Objective**: Proper recovery and positive closure

### Physical Cool-Down (3 minutes)
- Light walking or easy movement
- Static stretching for major muscle groups
- Deep breathing exercises
- Hydration break

### Team Huddle (2 minutes)
- Highlight positive moments from practice
- Ask players what they learned today
- Preview next practice or upcoming games
- Team cheer or motivational closing

## 🎯 Key Teaching Points for {sport_title}
- **Safety First**: Proper technique prevents injuries
- **Decision Making**: Encourage players to think and react
- **Effort Over Outcome**: Praise hard work and improvement
- **Fun Factor**: Keep youth sports enjoyable and engaging
- **Individual Growth**: Every player develops at their own pace

## 📝 Equipment Needed
- {sport_title} balls (one per 2-3 players)
- Cones or markers for boundaries and drills
- Water bottles and hydration station
- First aid kit and emergency contacts
- Positive attitude and coaching enthusiasm!

## 🔄 Modifications for Different Skill Levels

**Beginners**:
- Slower pace with more demonstrations
- Simpler rules and fewer variables
- More encouragement and basic skill focus
- Shorter activity durations

**Intermediate**:
- Add complexity and tactical elements
- Increase speed and intensity gradually
- Introduce more advanced techniques
- Longer sustained activities

**Advanced**:
- Higher intensity and game-like pressure
- Advanced techniques and strategies
- Leadership roles and peer coaching
- Competitive elements and challenges

## 🌟 Additional Tips for Success
- Arrive early to set up equipment and plan
- Learn every player's name and use it often
- Stay positive and energetic throughout
- Be flexible and adapt based on player needs
- End on a high note with something fun

---
*This practice plan was generated by HeadCoachAI - Your AI assistant for youth sports coaching*

*Remember: Every child is different. Adapt this plan to meet your team's specific needs and always prioritize safety, fun, and individual development!*
        """

        # Add selected drills if any
        if request.selectedDrills:
            practice_plan += f"\n\n## 🎯 Your Selected Drills\n"
            for i, drill in enumerate(request.selectedDrills, 1):
                practice_plan += f"{i}. **{drill}** - Incorporate into appropriate practice segments\n"

        return {
            "generated_plan": practice_plan,
            "web_drills_found": len(get_fallback_drills(request.sport, request.focus)),
            "sources_used": ["headcoach-basics", "youth-sports-fundamentals", "coaching-excellence"]
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
            },
            {
                "id": "sample-3",
                "title": "Baseball - U8 Fundamentals",
                "sport": "baseball",
                "duration": 60,
                "created_at": "2024-01-13T16:00:00Z",
                "selected_drills": ["Tee Work", "Fielding Basics"]
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
