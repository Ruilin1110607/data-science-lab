import React from "react"
import { experiments } from "../../data/experiments"
import { projectCards } from "../../data/projects"

export const LabStatus: React.FC = () => {
  const rows = [
    { label: "ACTIVE", active: true },
    { label: "Data Science Foundations" },
    { label: "2026" },
    { label: "Undergraduate · Year 1" },
    { label: `Experiments: ${String(experiments.length).padStart(2, "0")}` },
    { label: `Projects: ${String(projectCards.length).padStart(2, "0")}` },
  ]

  return (
    <div className="mb-8 rounded-2xl border border-gray-700 bg-gray-800 p-6">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">LAB STATUS</h3>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className={`h-1 w-1 rounded-full ${row.active ? "bg-green-500" : "bg-gray-600"}`} />
            <span className={row.active ? "text-gray-300" : "text-gray-400"}>{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
