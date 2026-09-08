import React, { useEffect, useState } from "react"
import { Navigation } from "./components/navigation/Navigation"
import { HomePage } from "./pages/HomePage"
import { ProjectsPage } from "./pages/ProjectsPage"
import { ExperimentsPage } from "./pages/ExperimentsPage"
import { JourneyPage } from "./pages/JourneyPage"
import { AboutPage } from "./pages/AboutPage"

export default function App() {
  const [activePage, setActivePage] = useState("home")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [activePage])

  const renderPage = () => {
    switch (activePage) {
      case "projects":
        return <ProjectsPage />
      case "experiments":
        return <ExperimentsPage />
      case "journey":
        return <JourneyPage />
      case "about":
        return <AboutPage />
      default:
        return <HomePage onNavigate={setActivePage} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation activePage={activePage} onNavigate={setActivePage} />
      <main className="pt-20">{renderPage()}</main>
    </div>
  )
}
