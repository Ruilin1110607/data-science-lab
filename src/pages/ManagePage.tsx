import React, { useRef, useState } from "react"
import { useContent } from "../data/content"
import { parseContent, slugify } from "../data/contentStore"
import type { Experiment, Project } from "../data/types"

const inputClass =
  "w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-600 focus:border-green-500 focus:outline-none"
const textareaClass = `${inputClass} min-h-[80px]`

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <label className="block">
    <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-400">{label}</span>
    {children}
    {hint ? <span className="mt-1 block text-xs text-gray-500">{hint}</span> : null}
  </label>
)

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const parseNumbers = (value: string) =>
  parseList(value)
    .map(Number)
    .filter((item) => Number.isFinite(item))

interface ExperimentForm {
  id: string
  isNew: boolean
  title: string
  status: string
  method: string
  correlation: string
  question: string
  summary: string
  datasetName: string
  observations: string
  variables: string
  findings: string
  seriesX: string
  seriesY: string
  xLabel: string
  yLabel: string
  note: string
}

interface ProjectForm {
  id: string
  isNew: boolean
  title: string
  description: string
  tags: string
  status: string
}

const emptyExperimentForm = (): ExperimentForm => ({
  id: "",
  isNew: true,
  title: "",
  status: "Exploring",
  method: "Correlation Analysis",
  correlation: "",
  question: "",
  summary: "",
  datasetName: "",
  observations: "0",
  variables: "",
  findings: "",
  seriesX: "",
  seriesY: "",
  xLabel: "",
  yLabel: "",
  note: "",
})

const toExperimentForm = (experiment: Experiment): ExperimentForm => ({
  id: experiment.id,
  isNew: false,
  title: experiment.title,
  status: experiment.status,
  method: experiment.method ?? "",
  correlation: experiment.correlation !== undefined ? String(experiment.correlation) : "",
  question: experiment.question,
  summary: experiment.summary,
  datasetName: experiment.dataset.name,
  observations: String(experiment.dataset.observations),
  variables: experiment.dataset.variables.join(", "),
  findings: experiment.findings.join("\n"),
  seriesX: experiment.series ? experiment.series.x.join(", ") : "",
  seriesY: experiment.series ? experiment.series.y.join(", ") : "",
  xLabel: experiment.series?.xLabel ?? "",
  yLabel: experiment.series?.yLabel ?? "",
  note: experiment.note,
})

const toExperiment = (form: ExperimentForm, id: string): Experiment => {
  const x = parseNumbers(form.seriesX)
  const y = parseNumbers(form.seriesY)
  const correlation = Number(form.correlation)
  const observations = Number(form.observations)

  return {
    id,
    title: form.title.trim() || "Untitled experiment",
    status: form.status.trim() || "Exploring",
    method: form.method.trim() || undefined,
    correlation: form.correlation.trim() !== "" && Number.isFinite(correlation) ? correlation : undefined,
    question: form.question.trim(),
    summary: form.summary.trim(),
    dataset: {
      name: form.datasetName.trim(),
      observations: Number.isFinite(observations) ? observations : 0,
      variables: parseList(form.variables),
    },
    findings: form.findings
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    series:
      x.length > 0 && x.length === y.length
        ? { x, y, xLabel: form.xLabel.trim() || "x", yLabel: form.yLabel.trim() || "y" }
        : undefined,
    note: form.note.trim(),
  }
}

const emptyProjectForm = (): ProjectForm => ({
  id: "",
  isNew: true,
  title: "",
  description: "",
  tags: "",
  status: "Planned",
})

const toProjectForm = (project: Project): ProjectForm => ({
  id: project.id,
  isNew: false,
  title: project.title,
  description: project.description,
  tags: project.tags.join(", "),
  status: project.status,
})

const toProject = (form: ProjectForm, id: string): Project => ({
  id,
  title: form.title.trim() || "Untitled project",
  description: form.description.trim(),
  tags: parseList(form.tags),
  status: form.status.trim() || "Planned",
})

export const ManagePage: React.FC = () => {
  const {
    experiments,
    projects,
    hasLocalDraft,
    saveExperiment,
    removeExperiment,
    saveProject,
    removeProject,
    replaceContent,
    resetToPublished,
    exportJson,
  } = useContent()

  const [tab, setTab] = useState<"experiments" | "projects">("experiments")
  const [experimentForm, setExperimentForm] = useState<ExperimentForm | null>(null)
  const [projectForm, setProjectForm] = useState<ProjectForm | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const notify = (text: string) => setMessage(text)

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "content.json"
    anchor.click()
    URL.revokeObjectURL(url)
    notify("Exported content.json — commit it to public/content.json to publish.")
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    try {
      replaceContent(parseContent(await file.text()))
      setExperimentForm(null)
      setProjectForm(null)
      notify(`Imported ${file.name} into the local draft.`)
    } catch (error) {
      notify(`Import failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const submitExperiment = (event: React.FormEvent) => {
    event.preventDefault()
    if (!experimentForm) return

    const id = experimentForm.isNew
      ? slugify(
          experimentForm.title,
          experiments.map((item) => item.id),
        )
      : experimentForm.id

    saveExperiment(toExperiment(experimentForm, id))
    setExperimentForm(null)
    notify(experimentForm.isNew ? `Added “${id}” to the local draft.` : `Updated “${id}” in the local draft.`)
  }

  const submitProject = (event: React.FormEvent) => {
    event.preventDefault()
    if (!projectForm) return

    const id = projectForm.isNew
      ? slugify(
          projectForm.title,
          projects.map((item) => item.id),
        )
      : projectForm.id

    saveProject(toProject(projectForm, id))
    setProjectForm(null)
    notify(projectForm.isNew ? `Added “${id}” to the local draft.` : `Updated “${id}” in the local draft.`)
  }

  const tabClass = (value: "experiments" | "projects") =>
    `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      tab === value ? "bg-green-600 text-white" : "text-gray-400 hover:text-green-400"
    }`

  return (
    <section className="bg-gray-900 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-3 text-4xl font-bold tracking-tight">Manage content</h2>
        <p className="mb-6 max-w-2xl text-gray-400">
          Add and edit experiments and projects. Changes are kept as a draft in this browser; export
          <code className="mx-1 rounded bg-gray-800 px-1.5 py-0.5 text-sm text-green-400">content.json</code>
          and commit it to <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-green-400">public/</code>
          to publish them for everyone.
        </p>

        {hasLocalDraft && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-green-500/40 bg-green-500/10 p-4">
            <span className="text-sm text-green-300">You have unpublished local changes.</span>
            <button
              type="button"
              onClick={resetToPublished}
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-green-500 hover:text-green-400"
            >
              Discard local changes
            </button>
          </div>
        )}

        {message && (
          <p className="mb-6 rounded-2xl border border-gray-700 bg-gray-800/60 p-4 text-sm text-gray-300">
            {message}
          </p>
        )}

        <div className="mb-6 flex items-center gap-2">
          <button type="button" className={tabClass("experiments")} onClick={() => setTab("experiments")}>
            Experiments ({experiments.length})
          </button>
          <button type="button" className={tabClass("projects")} onClick={() => setTab("projects")}>
            Projects ({projects.length})
          </button>
        </div>

        {tab === "experiments" && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setExperimentForm(emptyExperimentForm())}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
            >
              + New experiment
            </button>

            {experiments.map((experiment) => (
              <div
                key={experiment.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-700 bg-gray-800/50 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{experiment.title}</p>
                  <p className="text-xs text-gray-500">
                    {experiment.id} · {experiment.status}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setExperimentForm(toExperimentForm(experiment))}
                    className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-green-500 hover:text-green-400"
                  >
                    Edit
                  </button>
                  {pendingDelete === experiment.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          removeExperiment(experiment.id)
                          setPendingDelete(null)
                          notify(`Deleted “${experiment.id}” from the local draft.`)
                        }}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-500"
                      >
                        Confirm delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(null)}
                        className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingDelete(experiment.id)}
                      className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}

            {experimentForm && (
              <form
                onSubmit={submitExperiment}
                className="space-y-4 rounded-2xl border border-gray-700 bg-gray-800/50 p-6"
              >
                <h3 className="text-lg font-semibold">
                  {experimentForm.isNew ? "New experiment" : `Edit “${experimentForm.id}”`}
                </h3>

                <Field label="Title">
                  <input
                    className={inputClass}
                    value={experimentForm.title}
                    onChange={(event) =>
                      setExperimentForm({ ...experimentForm, title: event.target.value })
                    }
                    required
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Status">
                    <input
                      className={inputClass}
                      value={experimentForm.status}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, status: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="Method">
                    <input
                      className={inputClass}
                      value={experimentForm.method}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, method: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="Correlation" hint="Leave blank if not measured.">
                    <input
                      className={inputClass}
                      value={experimentForm.correlation}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, correlation: event.target.value })
                      }
                    />
                  </Field>
                </div>

                <Field label="Question">
                  <textarea
                    className={textareaClass}
                    value={experimentForm.question}
                    onChange={(event) =>
                      setExperimentForm({ ...experimentForm, question: event.target.value })
                    }
                  />
                </Field>

                <Field label="Summary">
                  <textarea
                    className={textareaClass}
                    value={experimentForm.summary}
                    onChange={(event) =>
                      setExperimentForm({ ...experimentForm, summary: event.target.value })
                    }
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Dataset name">
                    <input
                      className={inputClass}
                      value={experimentForm.datasetName}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, datasetName: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="Observations">
                    <input
                      className={inputClass}
                      value={experimentForm.observations}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, observations: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="Variables" hint="Comma separated.">
                    <input
                      className={inputClass}
                      value={experimentForm.variables}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, variables: event.target.value })
                      }
                    />
                  </Field>
                </div>

                <Field label="Findings" hint="One per line.">
                  <textarea
                    className={textareaClass}
                    value={experimentForm.findings}
                    onChange={(event) =>
                      setExperimentForm({ ...experimentForm, findings: event.target.value })
                    }
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Chart x values" hint="Comma separated numbers.">
                    <input
                      className={inputClass}
                      value={experimentForm.seriesX}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, seriesX: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="Chart y values" hint="Must match the number of x values.">
                    <input
                      className={inputClass}
                      value={experimentForm.seriesY}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, seriesY: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="x axis label">
                    <input
                      className={inputClass}
                      value={experimentForm.xLabel}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, xLabel: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="y axis label">
                    <input
                      className={inputClass}
                      value={experimentForm.yLabel}
                      onChange={(event) =>
                        setExperimentForm({ ...experimentForm, yLabel: event.target.value })
                      }
                    />
                  </Field>
                </div>

                <Field label="Note">
                  <textarea
                    className={textareaClass}
                    value={experimentForm.note}
                    onChange={(event) =>
                      setExperimentForm({ ...experimentForm, note: event.target.value })
                    }
                  />
                </Field>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setExperimentForm(null)}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {tab === "projects" && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setProjectForm(emptyProjectForm())}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
            >
              + New project
            </button>

            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-700 bg-gray-800/50 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{project.title}</p>
                  <p className="text-xs text-gray-500">
                    {project.id} · {project.status}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setProjectForm(toProjectForm(project))}
                    className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-green-500 hover:text-green-400"
                  >
                    Edit
                  </button>
                  {pendingDelete === project.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          removeProject(project.id)
                          setPendingDelete(null)
                          notify(`Deleted “${project.id}” from the local draft.`)
                        }}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-500"
                      >
                        Confirm delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(null)}
                        className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingDelete(project.id)}
                      className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}

            {projectForm && (
              <form
                onSubmit={submitProject}
                className="space-y-4 rounded-2xl border border-gray-700 bg-gray-800/50 p-6"
              >
                <h3 className="text-lg font-semibold">
                  {projectForm.isNew ? "New project" : `Edit “${projectForm.id}”`}
                </h3>

                <Field label="Title">
                  <input
                    className={inputClass}
                    value={projectForm.title}
                    onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })}
                    required
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    className={textareaClass}
                    value={projectForm.description}
                    onChange={(event) =>
                      setProjectForm({ ...projectForm, description: event.target.value })
                    }
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Tags" hint="Comma separated.">
                    <input
                      className={inputClass}
                      value={projectForm.tags}
                      onChange={(event) => setProjectForm({ ...projectForm, tags: event.target.value })}
                    />
                  </Field>
                  <Field label="Status">
                    <input
                      className={inputClass}
                      value={projectForm.status}
                      onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value })}
                    />
                  </Field>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectForm(null)}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3 border-t border-gray-800 pt-6">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-green-500 hover:text-green-400"
          >
            Export content.json
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-green-500 hover:text-green-400"
          >
            Import JSON
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleImport} hidden />
        </div>
      </div>
    </section>
  )
}
