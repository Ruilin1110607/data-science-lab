import React from "react"
import { experiments } from "../data/experiments"
import { ExperimentCard } from "../components/experiment-card/ExperimentCard"

export const ExperimentsPage: React.FC = () => {
  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">Experiments</h2>
          <p className="text-lg text-gray-400">Small questions. Data-driven answers.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((experiment) => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      </div>
    </section>
  )
}
