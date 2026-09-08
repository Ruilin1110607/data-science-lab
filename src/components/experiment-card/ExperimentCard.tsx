import React from "react"
import { ScatterPlot } from "../../charts/ScatterPlot"

interface Props {
  id: string
  title: string
  status: string
  method?: string
  correlation?: number
}

export const ExperimentCard: React.FC<Props> = ({ id, title, status, method, correlation }) => {
  const hasChart = correlation !== undefined

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-700 transition-transform hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-gray-300">
          {status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h4 className="mb-3 font-medium">{title}</h4>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-gray-500">{method || "Correlation Analysis"}</span>
          {hasChart && (
            <span className="text-sm font-medium text-green-400">r = {correlation!.toFixed(2)}</span>
          )}
        </div>

        {hasChart && <ScatterPlot data={{ id, title, status, method, correlation }} />}

        <button className="mt-auto w-full px-4 pt-4 text-sm text-green-400 transition-colors hover:text-green-300">
          View Details →
        </button>
      </div>
    </div>
  )
}
