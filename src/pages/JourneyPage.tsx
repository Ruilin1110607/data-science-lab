import React from "react"

interface YearNode {
  year: number
  title: string
  status: string
  items: string[]
  current?: boolean
}

const years: YearNode[] = [
  {
    year: 2026,
    title: "Year 1 · Foundations",
    status: "In Progress",
    current: true,
    items: ["C Programming", "Python", "Calculus", "Linear Algebra", "Statistics", "Data Visualization"],
  },
  {
    year: 2027,
    title: "Year 2 · Modeling",
    status: "Upcoming",
    items: ["Probability", "Machine Learning", "Statistical Learning", "Kaggle", "Data Mining"],
  },
  {
    year: 2028,
    title: "Year 3 · Research",
    status: "Upcoming",
    items: ["Deep Learning", "Research Projects", "Academic Writing", "Competition", "Research Internship"],
  },
  {
    year: 2029,
    title: "Year 4 · Graduate Study",
    status: "Future",
    items: [],
  },
]

export const JourneyPage: React.FC = () => {
  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">My Data Science Journey</h2>
          <p className="text-lg text-gray-400">Learning in public. Building in progress.</p>
        </div>

        <ol className="relative mx-auto max-w-3xl border-l border-gray-700">
          {years.map((node) => (
            <li key={node.year} className="mb-10 ml-6 last:mb-0">
              <span
                className={`absolute -left-[9px] flex h-4 w-4 rounded-full border ${
                  node.current ? "border-green-500 bg-green-500" : "border-gray-600 bg-gray-900"
                }`}
              />
              <div
                className={`rounded-2xl border p-6 ${
                  node.current ? "border-green-500/60 bg-gray-800" : "border-gray-700 bg-gray-800/50"
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold">{node.title}</h3>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      node.current ? "bg-green-500/15 text-green-400" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {node.status}
                  </span>
                  <span className="text-sm text-gray-500">{node.year}</span>
                </div>

                {node.items.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {node.items.map((item) => (
                      <span key={item} className="rounded bg-gray-700/60 px-2 py-1 text-xs text-gray-300">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">To be defined.</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
