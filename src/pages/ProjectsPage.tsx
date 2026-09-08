import React from "react"
import { ProjectCard } from "../components/project-card/ProjectCard"
import { projectCards } from "../data/projects"

export const ProjectsPage: React.FC = () => {
  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">Projects</h2>
          <p className="text-lg text-gray-400">Things I am building to learn by doing.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectCards.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}
