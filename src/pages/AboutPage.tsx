import React from "react"

const focus = [
  {
    title: "Foundations",
    body: "Programming, calculus, linear algebra and statistics — the tools every experiment depends on.",
  },
  {
    title: "Experiments",
    body: "Small questions answered with real data, written up so the reasoning can be reproduced.",
  },
  {
    title: "Projects",
    body: "Longer builds that turn what I learn into something usable.",
  },
]

export const AboutPage: React.FC = () => {
  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight lg:text-6xl">About</h2>
          <p className="text-lg text-gray-400">A first-year undergraduate learning data science in public.</p>
        </div>

        <div className="space-y-6">
          <p className="leading-relaxed text-gray-300">
            Data Science Lab is where I keep my work as I learn. Every experiment starts with a question I
            actually care about, gets a dataset, and ends with a write-up of what the numbers show — including
            the parts that did not work.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {focus.map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
                <h3 className="mb-2 font-medium text-green-400">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="mb-2 font-medium">How the experiments work</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Each write-up states the question, the data source, the method and the limits of the conclusion.
              Correlation is reported as correlation, never as cause.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
