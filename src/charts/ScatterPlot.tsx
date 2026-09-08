import React from "react"

interface ExperimentData {
  id: string
  title: string
  status: string
  method?: string
  correlation?: number
}

interface Props {
  data: ExperimentData
}

const DATASETS: Record<string, { x: number[]; y: number[] }> = {
  "exp-1": { x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95] },
  "exp-2": { x: [5, 6, 7, 8, 9, 10, 11], y: [45, 50, 60, 65, 70, 75, 80] },
  "exp-3": { x: [2, 3, 4, 5, 6, 7, 8], y: [60, 55, 50, 45, 40, 35, 30] },
}

const W = 600
const H = 400
const PAD = { left: 56, right: 24, top: 24, bottom: 48 }

export const ScatterPlot: React.FC<Props> = ({ data }) => {
  const dataset = DATASETS[data.id] ?? DATASETS["exp-3"]
  const { x, y } = dataset
  const n = x.length

  const sumX = x.reduce((acc, v) => acc + v, 0)
  const sumY = y.reduce((acc, v) => acc + v, 0)
  const sumXY = x.reduce((acc, v, i) => acc + v * y[i], 0)
  const sumX2 = x.reduce((acc, v) => acc + v * v, 0)

  const denom = n * sumX2 - sumX * sumX
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n

  const xMin = Math.min(...x)
  const xMax = Math.max(...x)
  const yMin = Math.min(...y)
  const yMax = Math.max(...y)
  const spanX = xMax - xMin || 1
  const spanY = yMax - yMin || 1

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const baseY = H - PAD.bottom
  const sx = (v: number) => PAD.left + ((v - xMin) / spanX) * plotW
  const sy = (v: number) => PAD.top + plotH - ((v - yMin) / spanY) * plotH

  return (
    <div className="mt-2 rounded-xl border border-gray-700 bg-gray-900/60 p-4">
      <h5 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
        Relationship Visualization
      </h5>

      <svg
        className="h-auto w-full"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Scatter plot: ${data.title}`}
      >
        <line x1={PAD.left} y1={baseY} x2={W - PAD.right} y2={baseY} stroke="#2a2a3a" strokeWidth={1} />
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={baseY} stroke="#2a2a3a" strokeWidth={1} />

        <text x={PAD.left + plotW / 2} y={H - 12} textAnchor="middle" fontSize={12} fill="#64748b">
          Study Hours
        </text>
        <text
          x={16}
          y={PAD.top + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 16 ${PAD.top + plotH / 2})`}
          fontSize={12}
          fill="#64748b"
        >
          Final Score
        </text>

        <line
          x1={sx(xMin)}
          y1={sy(intercept + slope * xMin)}
          x2={sx(xMax)}
          y2={sy(intercept + slope * xMax)}
          stroke="#4ade80"
          strokeWidth={2}
          strokeDasharray="6 4"
        />

        {x.map((xi, i) => (
          <circle
            key={`${xi}-${i}`}
            cx={sx(xi)}
            cy={sy(y[i])}
            r={5}
            fill="#4ade80"
            fillOpacity={0.85}
            stroke="#0a0a0f"
            strokeWidth={1}
          />
        ))}
      </svg>

      <p className="mt-2 text-xs text-gray-500">Demo dataset — correlation does not imply causation.</p>
    </div>
  )
}
