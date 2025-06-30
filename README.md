# 🏆 HeadCoachAI - Youth Sports Practice Planner

AI-powered practice plan generator for youth sports coaches with real-time drill research from top coaching websites.

## ✨ Features

- 🤖 **AI-Generated Practice Plans** - Powered by GPT-4 with sport-specific knowledge
- 🌐 **Real-Time Drill Research** - Fetches latest drills from coaching websites using Tavily API
- ⚽ **Multi-Sport Support** - Soccer, Basketball, Baseball, Volleyball, Flag Football
- 👶 **Age-Appropriate Content** - Safety protocols and skill progressions for youth athletes
- 🔐 **User Authentication** - Secure login with Google/GitHub via Supabase
- 💾 **Practice Plan Storage** - Save and organize your coaching history
- 📱 **Responsive Design** - Works perfectly on desktop and mobile

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Supabase Auth  
**Backend:** Python FastAPI, OpenAI GPT-4 API, Tavily API  
**Database:** Supabase  
**Deployment:** Vercel + Render

## 🚀 Quick Start

**Prerequisites:**

- Node.js 18+
- Python 3.11+
- OpenAI API key
- Tavily API key
- Supabase account

**Frontend Setup:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

**Backend Setup:**
\`\`\`bash
cd backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

## 🌐 Environment Variables

Create \`.env.local\` in frontend folder:
\`\`\`
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000
\`\`\`

Create \`.env\` in backend folder:
\`\`\`
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
\`\`\`

## 🚀 Live Demo

## 📸 Screenshots

---
