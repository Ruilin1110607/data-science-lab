import React from "react"
import type { Series } from "../data/experiments"

interface Props {
  title: string
  series: Series
}

const W = 600
const H = 400
const PAD = { left: 64, right: 24, top: 24, bottom: 56 }

export const ScatterPlot: React.FC<Props> = ({ title, series }) => {
  const { x, y, xLabel, yLabel } = series
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
    <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-4">
      <h5 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
        {xLabel} vs {yLabel}
      </h5>

      <svg
        className="h-auto w-full"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Scatter plot: ${title}`}
      >
        <line x1={PAD.left} y1={baseY} x2={W - PAD.right} y2={baseY} stroke="#2a2a3a" strokeWidth={1} />
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={baseY} stroke="#2a2a3a" strokeWidth={1} />

        <text x={PAD.left + plotW / 2} y={H - 14} textAnchor="middle" fontSize={12} fill="#64748b">
          {xLabel}
        </text>
        <text
          x={16}
          y={PAD.top + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 16 ${PAD.top + plotH / 2})`}
          fontSize={12}
          fill="#64748b"
        >
          {yLabel}
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
    </div>
  )
}
