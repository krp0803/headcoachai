\# 🏆 HeadCoachAI - Youth Sports Practice Planner



AI-powered practice plan generator for youth sports coaches with real-time drill research.



\## ✨ Features



\- 🤖 AI-Generated Practice Plans powered by GPT-4

\- 🌐 Real-time drill research from coaching websites  

\- ⚽ Multi-sport support (Soccer, Basketball, Baseball, Volleyball)

\- 👶 Age-appropriate content with safety protocols

\- 🔐 Secure authentication with Google/GitHub

\- 💾 Save and organize practice plans

\- 📱 Responsive design for all devices



\## 🛠️ Tech Stack



\*\*Frontend:\*\* React, TypeScript, Tailwind CSS, Vite, Supabase Auth  

\*\*Backend:\*\* Python FastAPI, OpenAI API, Tavily API  

\*\*Database:\*\* Supabase  

\*\*Deployment:\*\* Vercel + Render  



\## 🚀 Quick Start



\*\*Prerequisites:\*\*

\- Node.js 18+

\- Python 3.11+

\- OpenAI API key

\- Tavily API key

\- Supabase account



\*\*Frontend Setup:\*\*

```bash

cd frontend

npm install

npm run dev

```



\*\*Backend Setup:\*\*

```bash

cd backend

python -m venv venv

venv\\\\Scripts\\\\activate

pip install -r requirements.txt

uvicorn main:app --reload

```



\## 🌐 Environment Variables



Create `.env.local` in frontend folder:

```

VITE\_SUPABASE\_URL=your\_supabase\_url

VITE\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_key

VITE\_API\_BASE\_URL=http://localhost:8000

```



Create `.env` in backend folder:

```

OPENAI\_API\_KEY=your\_openai\_api\_key

TAVILY\_API\_KEY=your\_tavily\_api\_key

SUPABASE\_URL=your\_supabase\_url

SUPABASE\_SERVICE\_KEY=your\_supabase\_service\_key

```



\## 📸 Live Demo



\[Add your deployed app URL here]





