import React, { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Navigation } from "./components/navigation/Navigation"
import { HomePage } from "./pages/HomePage"
import { ProjectsPage } from "./pages/ProjectsPage"
import { ExperimentsPage } from "./pages/ExperimentsPage"
import { ExperimentDetailPage } from "./pages/ExperimentDetailPage"
import { JourneyPage } from "./pages/JourneyPage"
import { AboutPage } from "./pages/AboutPage"
import { ManagePage } from "./pages/ManagePage"
import { NotFoundPage } from "./pages/NotFoundPage"

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <ScrollToTop />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/experiments/:id" element={<ExperimentDetailPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}
