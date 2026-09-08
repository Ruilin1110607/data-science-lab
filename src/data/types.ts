export interface Series {
  x: number[]
  y: number[]
  xLabel: string
  yLabel: string
}

export interface Experiment {
  id: string
  title: string
  status: string
  method?: string
  correlation?: number
  question: string
  summary: string
  dataset: {
    name: string
    observations: number
    variables: string[]
  }
  findings: string[]
  series?: Series
  note: string
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  status: string
}

export interface Content {
  experiments: Experiment[]
  projects: Project[]
}
