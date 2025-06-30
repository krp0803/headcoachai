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
        # For now, return enhanced fallback drills
        return get_enhanced_drills(sport, focus, age_group, skill_level)
    except Exception as e:
        print(f"Error searching drills: {e}")
        return get_enhanced_drills(sport, focus, age_group, skill_level)


def get_enhanced_drills(sport: str, focus: str, age_group: str = "", skill_level: str = "") -> List[DrillSearchResult]:
    """Enhanced drill database with more comprehensive options"""

    # Base drills for each sport
    drill_database = {
        "soccer": [
            DrillSearchResult(
                title="Progressive Passing Circuit",
                description=f"Multi-station passing drill focusing on {focus}. Players rotate through short, medium, and long passing stations with increasing difficulty.",
                source="soccer-coaching-weekly"
            ),
            DrillSearchResult(
                title="1v1 Attacking & Defending",
                description="Dynamic 1v1 scenarios in a 20x15 yard box. Attacker tries to score while defender works on positioning and tackling technique.",
                source="uefa-coaching"
            ),
            DrillSearchResult(
                title="Ball Mastery Stations",
                description="Technical skill circuit with cone weaving, ball juggling, and close control exercises. Perfect for developing touch and confidence.",
                source="coerver-coaching"
            ),
            DrillSearchResult(
                title="Small-Sided Games (4v4)",
                description="Conditioned games emphasizing quick passing, movement off the ball, and decision-making in tight spaces.",
                source="fa-coaching"
            ),
            DrillSearchResult(
                title="Shooting Technique Progression",
                description="Systematic shooting practice from stationary ball to moving ball scenarios. Focus on placement, power, and technique.",
                source="soccer-specific"
            ),
            DrillSearchResult(
                title="Defensive Shape & Pressing",
                description="Team defensive drill working on compact shape, communication, and coordinated pressing triggers.",
                source="tactical-soccer"
            )
        ],
        "basketball": [
            DrillSearchResult(
                title="Triple Threat Position",
                description=f"Fundamental stance work focusing on {focus}. Players practice jab steps, shot fakes, and drive moves from triple threat.",
                source="basketball-hq"
            ),
            DrillSearchResult(
                title="Dribbling Gauntlet",
                description="Multi-cone dribbling course with crossovers, between-legs, and behind-back moves. Builds ball handling confidence.",
                source="breakthrough-basketball"
            ),
            DrillSearchResult(
                title="Form Shooting Progression",
                description="Systematic shooting development starting close to basket. Focus on arc, follow-through, and consistent mechanics.",
                source="shooting-coach"
            ),
            DrillSearchResult(
                title="Defensive Slides & Closeouts",
                description="Footwork drill for defensive positioning. Practice lateral movement, proper stance, and closing out on shooters.",
                source="defensive-basketball"
            ),
            DrillSearchResult(
                title="3-Man Weave",
                description="Classic passing and cutting drill. Develops court vision, timing, and unselfish play in transition.",
                source="fundamental-basketball"
            ),
            DrillSearchResult(
                title="Rebounding Box-Out",
                description="Contact drill teaching proper box-out technique and aggressive rebounding mentality.",
                source="rebounding-fundamentals"
            )
        ],
        "baseball": [
            DrillSearchResult(
                title="Tee Work Progression",
                description=f"Hitting fundamentals focusing on {focus}. Progress from tee to soft toss to live pitching with emphasis on mechanics.",
                source="baseball-positive"
            ),
            DrillSearchResult(
                title="Fielding Fundamentals",
                description="Ground ball and fly ball practice with proper footwork, glove positioning, and throwing mechanics.",
                source="little-league"
            ),
            DrillSearchResult(
                title="Throwing Accuracy Circuit",
                description="Progressive throwing drill with targets at various distances. Focus on proper grip, stride, and follow-through.",
                source="throwing-program"
            ),
            DrillSearchResult(
                title="Base Running Technique",
                description="Proper running form, base rounding, and sliding technique. Include reading coaches and situational awareness.",
                source="baserunning-academy"
            ),
            DrillSearchResult(
                title="Catching Fundamentals",
                description="Stance, framing, and blocking drills for catchers. Include throwing to second base and game situation practice.",
                source="catching-101"
            ),
            DrillSearchResult(
                title="Pitching Mechanics",
                description="Step-by-step pitching instruction focusing on balance, stride, and arm action. Age-appropriate pitch counts.",
                source="pitching-coach"
            )
        ],
        "volleyball": [
            DrillSearchResult(
                title="Platform Passing",
                description=f"Fundamental passing technique focusing on {focus}. Work on proper platform angle and ball control.",
                source="volleyball-1on1"
            ),
            DrillSearchResult(
                title="Setting Footwork",
                description="Proper setter positioning and hand technique. Practice quick sets, back sets, and communication.",
                source="setting-secrets"
            ),
            DrillSearchResult(
                title="Attacking Approach",
                description="Three-step and four-step approach patterns. Focus on timing, jump technique, and arm swing.",
                source="volleyball-advantage"
            ),
            DrillSearchResult(
                title="Serving Progression",
                description="Underhand to overhand serving development. Target practice and consistency training.",
                source="serving-ace"
            ),
            DrillSearchResult(
                title="Blocking Technique",
                description="Proper hand position, timing, and footwork for effective blocking at the net.",
                source="blocking-clinic"
            ),
            DrillSearchResult(
                title="Pepper Drill Variations",
                description="Classic control drill with modifications for different skill levels. Builds ball control and communication.",
                source="volleyball-drills"
            )
        ],
        "flag-football": [
            DrillSearchResult(
                title="Route Running Precision",
                description=f"Detailed route practice focusing on {focus}. Work on cuts, timing, and catching technique.",
                source="flag-football-plays"
            ),
            DrillSearchResult(
                title="Flag Pulling Technique",
                description="Proper defensive positioning and flag removal. Practice angles and pursuit drills.",
                source="youth-flag-football"
            ),
            DrillSearchResult(
                title="Quarterback Mechanics",
                description="Throwing fundamentals including grip, stance, and follow-through. Practice with moving targets.",
                source="qb-development"
            ),
            DrillSearchResult(
                title="Center-QB Exchange",
                description="Snap timing and quarterback footwork. Practice under center and shotgun formations.",
                source="football-fundamentals"
            ),
            DrillSearchResult(
                title="Agility & Footwork",
                description="Cone drills, ladder work, and change of direction exercises specific to flag football movement.",
                source="speed-agility"
            ),
            DrillSearchResult(
                title="7v7 Scrimmage",
                description="Game-like situations with modified rules. Focus on strategy, communication, and sportsmanship.",
                source="flag-football-games"
            )
        ]
    }

    base_drills = drill_database.get(sport, [])

    # Customize drills based on age group and skill level
    if age_group:
        for drill in base_drills:
            if "u8" in age_group.lower() or "u10" in age_group.lower():
                drill.description = drill.description.replace(
                    "Focus on", "Simple focus on").replace("Practice", "Fun practice with")
            elif "u16" in age_group.lower() or "u18" in age_group.lower():
                drill.description = drill.description.replace(
                    "Practice", "Advanced practice with").replace("Focus on", "Intensive focus on")

    return base_drills


@app.post("/api/generate-practice")
async def generate_practice_plan(
    request: PracticeRequest,
    user=Depends(get_current_user)
) -> dict:
    """Generate comprehensive AI-powered practice plan"""
    try:
        # Enhanced practice plan generation
        sport_title = request.sport.title()
        duration = int(request.duration) if request.duration else 60

        # Get relevant drills for context
        relevant_drills = get_enhanced_drills(
            request.sport, request.focus, request.ageGroup, request.skillLevel)

        # Calculate time segments based on best practices
        warmup_time = max(8, duration // 8)
        skill_time = max(20, duration // 2.5)
        game_time = max(15, duration // 3)
        cooldown_time = max(5, duration // 10)

        # Generate comprehensive practice plan
        practice_plan = f"""# 🏆 HeadCoachAI Practice Plan - {sport_title}

## 📋 Practice Overview
- **Sport**: {sport_title}
- **Duration**: {duration} minutes
- **Primary Focus**: {request.focus}
- **Age Group**: {request.ageGroup or 'All ages'}
- **Skill Level**: {request.skillLevel or 'Mixed abilities'}
- **Players**: {request.playerCount or 'Flexible group size'}
- **Generated**: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}

---

## 🔥 Dynamic Warm-Up ({warmup_time} minutes)
**Objective**: Activate muscles, prevent injuries, and prepare for {request.focus}

### General Movement (4 minutes)
- **Light jogging** around playing area (2 minutes)
- **Dynamic stretching sequence**:
  - Leg swings (forward/back, side to side)
  - Arm circles and shoulder rolls
  - High knees and butt kicks
  - Walking lunges with rotation

### Sport-Specific Activation ({warmup_time-4} minutes)
- **{sport_title} movement patterns** at 50% intensity
- **Ball familiarization** (if applicable)
- **Partner warm-up activities**
- **Gradual intensity increase** leading into main session

**🎯 Coaching Focus**: 
- Check for any physical concerns or injuries
- Build positive energy and team communication
- Emphasize proper movement mechanics
- Set the tone for focused, fun practice

---

## ⚡ Technical Skills Development ({skill_time} minutes)
**Primary Focus**: {request.focus}

### Station 1: Fundamental Technique ({skill_time//2} minutes)
**Drill Inspiration**: {relevant_drills[0].title if relevant_drills else 'Progressive Skill Building'}

- **Individual skill work** with immediate feedback
- **Progressive difficulty** from basic to advanced
- **Repetition with purpose** - quality over quantity
- **Peer coaching opportunities** for advanced players

**Key Teaching Points**:
- Break down complex skills into simple components
- Use positive reinforcement and specific feedback
- Demonstrate proper technique multiple times
- Allow for individual learning pace differences

### Station 2: Applied Skills Under Pressure ({skill_time//2} minutes)
**Drill Inspiration**: {relevant_drills[1].title if len(relevant_drills) > 1 else 'Competitive Application'}

- **Small group challenges** (2-4 players)
- **Add time pressure and decision-making**
- **Competitive elements** to maintain engagement
- **Rotate roles** to develop different perspectives

**Key Teaching Points**:
- Encourage risk-taking and creativity
- Focus on decision-making speed
- Celebrate effort and improvement
- Connect skills to game situations

---

## 🎮 Game Application & Scrimmage ({game_time} minutes)
**Objective**: Apply skills in realistic game scenarios

### Small-Sided Games ({game_time//2} minutes)
**Format**: Modified games (3v3, 4v4, or 5v5 depending on sport)

- **Reduced playing area** for increased touches
- **Modified rules** to emphasize {request.focus}
- **Multiple games simultaneously** for maximum participation
- **Quick rotations** every 3-4 minutes

**Rule Modifications for {request.focus}**:
- Bonus points for demonstrating focus skills
- Mandatory touches or passes before scoring
- Specific player roles to practice different positions

### Competitive Challenges ({game_time//2} minutes)
**Skills competitions and team challenges**

- **Individual skill contests** related to session focus
- **Team relay races** incorporating sport skills
- **Fun games** that reinforce technique
- **Positive competition** with emphasis on effort

**🎯 Coaching During Games**:
- Step back and let players make decisions
- Provide encouragement rather than constant instruction
- Highlight good examples of focus skills in action
- Keep energy high with positive reinforcement

---

## 🧘 Cool-Down & Team Building ({cooldown_time} minutes)
**Objective**: Proper recovery and positive session closure

### Physical Recovery (3 minutes)
- **Walking cool-down** to lower heart rate
- **Static stretching** for major muscle groups used
- **Deep breathing exercises** for mental relaxation
- **Hydration reminder** and injury check

### Team Reflection & Connection (2 minutes)
- **Circle up** for team discussion
- **Highlight 3 positive moments** from practice
- **Ask players**: "What did you learn today?"
- **Preview next session** and upcoming events
- **Team cheer or motivational closing**

---

## 🎯 Sport-Specific Coaching Points for {sport_title}

### Technical Focus Areas:
- **Proper body mechanics** for injury prevention
- **Progressive skill development** appropriate for age
- **Decision-making skills** in game situations
- **Teamwork and communication** emphasis

### Safety Considerations:
- Proper equipment check before starting
- Age-appropriate contact and intensity levels
- Hydration breaks every 15-20 minutes
- Modified rules for safety in youth sports

### Fun Factor Elements:
- Variety in activities to maintain engagement
- Opportunities for every player to succeed
- Positive coaching language and encouragement
- Games and challenges that build confidence

---

## 📋 Equipment Checklist
- **{sport_title} balls**: 1 per 2-3 players minimum
- **Cones/markers**: 20-30 for boundaries and drills
- **Water bottles**: Ensure every player has access
- **First aid kit**: Basic supplies and emergency contacts
- **Pinnies/scrimmage vests**: For team identification
- **Clipboard**: For notes and player feedback

---

## 🔄 Adaptations by Skill Level

### **Beginner Modifications**:
- Slower pace with more demonstrations
- Simplified rules and fewer variables
- Extra encouragement and patience
- Focus on fun and basic skill development
- Shorter activity durations (3-5 minutes)

### **Intermediate Adaptations**:
- Add tactical elements and strategy
- Increase pace and intensity gradually
- Introduce more advanced techniques
- Longer sustained activities (5-8 minutes)
- Peer teaching opportunities

### **Advanced Challenges**:
- Higher intensity and game-like pressure
- Complex tactical scenarios
- Leadership roles and responsibility
- Competitive elements and performance goals
- Extended activity periods (8-12 minutes)

---

## 💡 HeadCoachAI Pro Tips

### Before Practice:
- Arrive 15 minutes early to set up equipment
- Have a backup plan for weather or space issues
- Review player names and any special considerations
- Prepare positive energy and enthusiasm

### During Practice:
- Use every player's name frequently
- Give specific, actionable feedback
- Keep instructions simple and clear
- Maintain high energy and positivity
- Be flexible and adapt based on player needs

### After Practice:
- Clean up equipment together as a team
- Send positive messages to parents about player progress
- Reflect on what worked well and what to improve
- Plan adjustments for next session

---

## 🌟 Session Success Indicators
- ✅ Every player touched the ball/participated actively
- ✅ Players demonstrated improvement in {request.focus}
- ✅ Positive team energy and communication
- ✅ Safe environment with no injuries
- ✅ Players left excited for next practice
- ✅ Coach felt organized and prepared

---
"""

        # Add selected drills section if any were chosen
        if request.selectedDrills:
            practice_plan += f"""## 🎯 Your Selected Drills Integration

You specifically requested these drills to be included:

"""
            for i, drill in enumerate(request.selectedDrills, 1):
                practice_plan += f"**{i}. {drill}**\n"
                practice_plan += f"   - Integrate into technical skills stations\n"
                practice_plan += f"   - Modify difficulty based on player ability\n"
                practice_plan += f"   - Use as warm-up or cool-down activity\n\n"

        practice_plan += f"""
---

*🏆 This comprehensive practice plan was generated by HeadCoachAI*

*Remember: Every player develops at their own pace. Use this plan as a guide, but always prioritize safety, fun, and individual growth. Adapt activities based on your team's specific needs and energy levels.*

**Next Steps**: 
- Review this plan before practice
- Gather all necessary equipment  
- Prepare for an amazing coaching session!

*Good luck, Coach! Your players are lucky to have someone who cares about their development.* 🌟
"""

        return {
            "generated_plan": practice_plan,
            "web_drills_found": len(relevant_drills),
            "sources_used": [drill.source for drill in relevant_drills[:3]]
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
    """Save practice plan to database"""
    try:
        # For now, just return success with a generated ID
        # In production, this would save to Supabase database
        practice_id = f"practice-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        return {
            "success": True,
            "id": practice_id,
            "message": "Practice plan saved successfully!"
        }

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
    """Get user's saved practice plans"""
    try:
        # Return enhanced sample data for demonstration
        sample_plans = [
            {
                "id": "sample-1",
                "title": "Soccer - U10 Passing & Movement",
                "sport": "soccer",
                "duration": 75,
                "created_at": "2024-01-15T10:00:00Z",
                "selected_drills": ["Progressive Passing Circuit", "Small-Sided Games"],
                "focus_areas": "Passing accuracy under pressure"
            },
            {
                "id": "sample-2",
                "title": "Basketball - U12 Shooting Fundamentals",
                "sport": "basketball",
                "duration": 60,
                "created_at": "2024-01-14T15:30:00Z",
                "selected_drills": ["Form Shooting Progression", "Triple Threat Position"],
                "focus_areas": "Shooting technique and confidence"
            },
            {
                "id": "sample-3",
                "title": "Baseball - U8 Hitting & Fielding",
                "sport": "baseball",
                "duration": 90,
                "created_at": "2024-01-13T16:00:00Z",
                "selected_drills": ["Tee Work Progression", "Fielding Fundamentals"],
                "focus_areas": "Basic hitting mechanics"
            },
            {
                "id": "sample-4",
                "title": "Volleyball - U14 Serving & Passing",
                "sport": "volleyball",
                "duration": 75,
                "created_at": "2024-01-12T14:00:00Z",
                "selected_drills": ["Platform Passing", "Serving Progression"],
                "focus_areas": "Consistent serving and passing"
            },
            {
                "id": "sample-5",
                "title": "Flag Football - U16 Route Running",
                "sport": "flag-football",
                "duration": 60,
                "created_at": "2024-01-11T17:00:00Z",
                "selected_drills": ["Route Running Precision", "7v7 Scrimmage"],
                "focus_areas": "Precise route running and timing"
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
