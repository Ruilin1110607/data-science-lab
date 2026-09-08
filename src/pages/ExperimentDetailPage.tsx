import React from "react"
import { Link, useParams } from "react-router-dom"
import { ScatterPlot } from "../charts/ScatterPlot"
import { useContent } from "../data/content"

export const ExperimentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { experiments } = useContent()
  const experiment = experiments.find((item) => item.id === id)

  if (!experiment) {
    return (
      <section className="bg-gray-900 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-bold">Experiment not found</h2>
          <p className="mb-8 text-gray-400">No experiment matches “{id}”.</p>
          <Link to="/experiments" className="text-green-400 transition-colors hover:text-green-300">
            ← Back to all experiments
          </Link>
        </div>
      </section>
    )
  }

  const meta = [
    { label: "Status", value: experiment.status },
    { label: "Method", value: experiment.method ?? "Correlation Analysis" },
    {
      label: "Correlation",
      value: experiment.correlation !== undefined ? `r = ${experiment.correlation.toFixed(2)}` : "Not yet measured",
    },
    { label: "Observations", value: String(experiment.dataset.observations) },
  ]

  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <Link
          to="/experiments"
          className="mb-8 inline-block text-sm text-gray-400 transition-colors hover:text-green-400"
        >
          ← All experiments
        </Link>

        <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">{experiment.title}</h2>
        <p className="mb-8 max-w-2xl text-lg text-gray-400">{experiment.question}</p>

        <dl className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label} className="rounded-2xl border border-gray-700 bg-gray-800/50 p-4">
              <dt className="mb-1 text-xs uppercase tracking-wider text-gray-500">{item.label}</dt>
              <dd className="text-sm font-medium text-gray-200">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-8">
          {experiment.summary && (
            <div>
              <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-400">Overview</h3>
              <p className="leading-relaxed text-gray-300">{experiment.summary}</p>
            </div>
          )}

          {experiment.series && (
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-400">Data</h3>
              <ScatterPlot title={experiment.title} series={experiment.series} />
            </div>
          )}

          {(experiment.dataset.name || experiment.dataset.variables.length > 0) && (
            <div>
              <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-400">Dataset</h3>
              <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-5">
                {experiment.dataset.name && <p className="mb-2 text-sm text-gray-200">{experiment.dataset.name}</p>}
                <div className="flex flex-wrap gap-2">
                  {experiment.dataset.variables.map((variable) => (
                    <span key={variable} className="rounded bg-gray-700/60 px-2 py-1 text-xs text-gray-300">
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-400">Findings</h3>
            {experiment.findings.length > 0 ? (
              <ul className="space-y-3">
                {experiment.findings.map((finding) => (
                  <li key={finding} className="flex gap-3 leading-relaxed text-gray-300">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-green-400" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No findings yet — this experiment is still being designed.</p>
            )}
          </div>

          {experiment.note && (
            <p className="rounded-2xl border border-gray-700 bg-gray-800/50 p-5 text-sm text-gray-400">
              {experiment.note}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
