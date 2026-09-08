import React from "react"
import { Link } from "react-router-dom"
import { LabStatus } from "../components/lab-status/LabStatus"
import { useContent } from "../data/content"

export const HomePage: React.FC = () => {
  const { experiments, projects } = useContent()

  const stats = [
    { label: "Experiments", value: experiments.length },
    { label: "Projects", value: projects.length },
    { label: "Started", value: 2026 },
    { label: "Status", value: "Active" },
  ]

  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-green-400">
              Data Science Lab
            </p>
            <h2 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl">
              Questions in.
              <br />
              Evidence out.
            </h2>
            <p className="mb-8 max-w-2xl text-lg text-gray-400">
              A personal lab for turning everyday curiosity into small, reproducible data experiments —
              and publishing what the numbers actually say.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/experiments"
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500"
              >
                Browse experiments
              </Link>
              <Link
                to="/projects"
                className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium transition-colors hover:border-green-500 hover:text-green-400"
              >
                View projects
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-700 bg-gray-800/50 p-5">
                  <dt className="mb-1 text-xs uppercase tracking-wider text-gray-500">{item.label}</dt>
                  <dd className="text-2xl font-semibold text-white">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <LabStatus />
        </div>
      </div>
    </section>
  )
}
