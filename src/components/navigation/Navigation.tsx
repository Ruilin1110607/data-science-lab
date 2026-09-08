@react-component Navigation
import React from "react"
import { IconHome, IconFolder, IconMicroscope, IconClock, IconUser } from "lucide-react"

export interface NavigationProps {
  activePage: string
  onNavigate: (page: string) => void
  experimentId?: string | null
}

export const Navigation: React.FC<NavigationProps> = ({ activePage, onNavigate, experimentId }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-700 dark:border-gray-600">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-green-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white">Data Science Lab</h1>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate("home")}
            className={`relative px-4 py-2 text-gray-400 hover:text-green-400 transition-colors ${activePage === "home" ? "text-green-400" : ""}`}
            aria-label="Home"
          >
            Home
          </button>

          <button
            onClick={() => onNavigate("projects")}
            className={`relative px-4 py-2 text-gray-400 hover:text-green-400 transition-colors ${activePage === "projects" ? "text-green-400" : ""}`}
            aria-label="Projects"
          >
            Projects
          </button>

          <button
            onClick={() => onNavigate("experiments")}
            className={`relative px-4 py-2 text-gray-400 hover:text-green-400 transition-colors ${activePage === "experiments" ? "text-green-400" : ""}`}
            aria-label="Experiments"
          >
            Experiments
          </button>

          <button
            onClick={() => onNavigate("journey")}
            className={`relative px-4 py-2 text-gray-400 hover:text-green-400 transition-colors ${activePage === "journey" ? "text-green-400" : ""}`}
            aria-label="Journey"
          >
            Journey
          </button>

          <button
            onClick={() => onNavigate("about")}
            className={`relative px-4 py-2 text-gray-400 hover:text-green-400 transition-colors ${activePage === "about" ? "text-green-400" : ""}`}
            aria-label="About"
          >
            About
          </button>
        </div>

        <button className="md:hidden p-2" onClick={() => onNavigate("home")} aria-label="Open menu">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </nav>
  )
}
