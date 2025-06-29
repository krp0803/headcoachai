"use client"

import { useState } from "react"
import { AuthProvider } from "./contexts/AuthContext"
import LandingPage from "./components/pages/LandingPage"
import Dashboard from "./components/pages/Dashboard"
import PracticeBuilder from "./components/pages/PracticeBuilder"

function App() {
  const [currentPage, setCurrentPage] = useState("landing")

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />
      case "practice-builder":
        return <PracticeBuilder onNavigate={handleNavigate} />
      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }

  return (
    <AuthProvider>
      <div className="App">{renderPage()}</div>
    </AuthProvider>
  )
}

export default App