import React from "react"
import { ProjectCard } from "../components/project-card/ProjectCard"
import { useContent } from "../data/content"

export const ProjectsPage: React.FC = () => {
  const { projects } = useContent()

  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">Projects</h2>
          <p className="text-lg text-gray-400">Things I am building to learn by doing.</p>
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
