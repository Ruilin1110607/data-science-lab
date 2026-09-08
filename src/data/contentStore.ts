import type { Content, Experiment, Project, Series } from "./types"
import { defaultExperiments, defaultProjects } from "./defaults"

export const DRAFT_KEY = "data-science-lab:draft:v1"

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function createDefaultContent(): Content {
  return clone({ experiments: defaultExperiments, projects: defaultProjects })
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : value === undefined || value === null ? fallback : String(value)
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => asString(item).trim()).filter((item) => item.length > 0)
}

function asNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => Number(item)).filter((item) => Number.isFinite(item))
}

function asNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function normalizeSeries(value: unknown): Series | undefined {
  if (typeof value !== "object" || value === null) return undefined
  const raw = value as Record<string, unknown>
  const x = asNumberArray(raw.x)
  const y = asNumberArray(raw.y)
  if (x.length === 0 || x.length !== y.length) return undefined
  return {
    x,
    y,
    xLabel: asString(raw.xLabel, "x"),
    yLabel: asString(raw.yLabel, "y"),
  }
}

export function normalizeExperiment(value: unknown, index = 0): Experiment {
  const raw = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>
  const datasetRaw = (typeof raw.dataset === "object" && raw.dataset !== null ? raw.dataset : {}) as Record<
    string,
    unknown
  >

  return {
    id: asString(raw.id).trim() || `exp-${index + 1}`,
    title: asString(raw.title).trim() || "Untitled experiment",
    status: asString(raw.status).trim() || "Exploring",
    method: asString(raw.method).trim() || undefined,
    correlation: asNumber(raw.correlation),
    question: asString(raw.question),
    summary: asString(raw.summary),
    dataset: {
      name: asString(datasetRaw.name),
      observations: asNumber(datasetRaw.observations) ?? 0,
      variables: asStringArray(datasetRaw.variables),
    },
    findings: asStringArray(raw.findings),
    series: normalizeSeries(raw.series),
    note: asString(raw.note),
  }
}

export function normalizeProject(value: unknown, index = 0): Project {
  const raw = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>

  return {
    id: asString(raw.id).trim() || `project-${index + 1}`,
    title: asString(raw.title).trim() || "Untitled project",
    description: asString(raw.description),
    tags: asStringArray(raw.tags),
    status: asString(raw.status).trim() || "Planned",
  }
}

export function normalizeContent(value: unknown): Content {
  const raw = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>
  const experiments = Array.isArray(raw.experiments) ? raw.experiments : []
  const projects = Array.isArray(raw.projects) ? raw.projects : []

  return {
    experiments: experiments.map((item, index) => normalizeExperiment(item, index)),
    projects: projects.map((item, index) => normalizeProject(item, index)),
  }
}

export function serializeContent(content: Content): string {
  return JSON.stringify(content, null, 2)
}

export function parseContent(json: string): Content {
  const content = normalizeContent(JSON.parse(json))
  if (content.experiments.length === 0 && content.projects.length === 0) {
    throw new Error("No experiments or projects found in this file.")
  }
  return content
}

export function loadDraft(storage: StorageLike): Content | null {
  const stored = storage.getItem(DRAFT_KEY)
  if (!stored) return null
  try {
    return normalizeContent(JSON.parse(stored))
  } catch {
    return null
  }
}

export function saveDraft(storage: StorageLike, content: Content): void {
  storage.setItem(DRAFT_KEY, JSON.stringify(content))
}

export function clearDraft(storage: StorageLike): void {
  storage.removeItem(DRAFT_KEY)
}

export function slugify(value: string, taken: string[] = []): string {
  const base =
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"

  let candidate = base
  let counter = 2
  while (taken.includes(candidate)) {
    candidate = `${base}-${counter}`
    counter += 1
  }
  return candidate
}

export function upsertExperiment(content: Content, experiment: Experiment): Content {
  const exists = content.experiments.some((item) => item.id === experiment.id)
  const experiments = exists
    ? content.experiments.map((item) => (item.id === experiment.id ? experiment : item))
    : [...content.experiments, experiment]

  return { ...content, experiments }
}

export function deleteExperiment(content: Content, id: string): Content {
  return { ...content, experiments: content.experiments.filter((item) => item.id !== id) }
}

export function upsertProject(content: Content, project: Project): Content {
  const exists = content.projects.some((item) => item.id === project.id)
  const projects = exists
    ? content.projects.map((item) => (item.id === project.id ? project : item))
    : [...content.projects, project]

  return { ...content, projects }
}

export function deleteProject(content: Content, id: string): Content {
  return { ...content, projects: content.projects.filter((item) => item.id !== id) }
}
