import React from "react"
import { ExperimentCard } from "../components/experiment-card/ExperimentCard"
import { useContent } from "../data/content"

export const ExperimentsPage: React.FC = () => {
  const { experiments } = useContent()

  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">Experiments</h2>
          <p className="text-lg text-gray-400">Small questions. Data-driven answers.</p>
        </div>

        {experiments.length === 0 ? (
          <p className="text-center text-gray-500">No experiments yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiments.map((experiment) => (
              <ExperimentCard key={experiment.id} experiment={experiment} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
