import React from "react"
import { Link } from "react-router-dom"

export const NotFoundPage: React.FC = () => {
  return (
    <section className="bg-gray-900 py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-green-400">404</p>
        <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">Page not found</h2>
        <p className="mb-8 text-gray-400">That page does not exist in the lab.</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500"
        >
          Back to home
        </Link>
      </div>
    </section>
  )
}
