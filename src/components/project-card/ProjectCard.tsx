import React from "react"
import type { Project } from "../../data/types"

interface Props {
  project: Project
}

export const ProjectCard: React.FC<Props> = ({ project }) => {
  const { title, description, tags, status } = project

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-700 transition-transform hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-green-600/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-gray-300">
          {status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h4 className="mb-2 line-clamp-2 font-medium">{title}</h4>
        <p className="mb-4 line-clamp-2 text-sm text-gray-400">{description}</p>

        <div className="mt-auto flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded bg-gray-700 px-2 py-1 text-xs font-medium text-green-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
