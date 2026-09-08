import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/experiments", label: "Experiments" },
  { to: "/journey", label: "Journey" },
  { to: "/about", label: "About" },
]

export const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  const desktopClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 transition-colors hover:text-green-400 ${isActive ? "text-green-400" : "text-gray-400"}`

  const mobileClass = ({ isActive }: { isActive: boolean }) =>
    `block w-full px-6 py-3 text-left transition-colors hover:bg-gray-800 ${
      isActive ? "text-green-400" : "text-gray-300"
    }`

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-700 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-green-600">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-wider text-white">Data Science Lab</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={desktopClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <Link
            to="/manage"
            title="Manage content"
            aria-label="Manage content"
            className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:text-green-400 md:block"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </Link>

          <button
            className="p-2 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-700 bg-black/95 md:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={mobileClass}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/manage" className={mobileClass} onClick={closeMenu}>
            Manage content
          </NavLink>
        </div>
      )}
    </nav>
  )
}
