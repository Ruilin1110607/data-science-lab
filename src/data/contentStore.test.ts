import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import * as store from "./contentStore"
import type { Content, Experiment, Project } from "./types"

function memoryStorage(): store.StorageLike {
  const data = new Map<string, string>()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
    removeItem: (key) => {
      data.delete(key)
    },
  }
}

const sampleExperiment: Experiment = {
  id: "exp-test",
  title: "Test experiment",
  status: "Exploring",
  question: "Does this work?",
  summary: "",
  dataset: { name: "Test", observations: 0, variables: [] },
  findings: [],
  note: "",
}

const sampleProject: Project = {
  id: "test-project",
  title: "Test project",
  description: "",
  tags: [],
  status: "Planned",
}

describe("drafts", () => {
  it("starts with no draft", () => {
    expect(store.loadDraft(memoryStorage())).toBeNull()
  })

  it("round-trips a saved draft", () => {
    const storage = memoryStorage()
    const content = store.createDefaultContent()

    store.saveDraft(storage, content)

    expect(store.loadDraft(storage)).toEqual(content)
  })

  it("ignores corrupted draft data", () => {
    const storage = memoryStorage()
    storage.setItem(store.DRAFT_KEY, "{not json")

    expect(store.loadDraft(storage)).toBeNull()
  })

  it("clears a draft", () => {
    const storage = memoryStorage()
    store.saveDraft(storage, store.createDefaultContent())
    store.clearDraft(storage)

    expect(store.loadDraft(storage)).toBeNull()
  })
})

describe("upsert and delete", () => {
  it("appends a new experiment", () => {
    const next = store.upsertExperiment(store.createDefaultContent(), sampleExperiment)

    expect(next.experiments).toHaveLength(4)
    expect(next.experiments.at(-1)).toEqual(sampleExperiment)
  })

  it("replaces an existing experiment in place", () => {
    const content = store.createDefaultContent()
    const edited = { ...content.experiments[0], title: "Edited title" }
    const next = store.upsertExperiment(content, edited)

    expect(next.experiments).toHaveLength(content.experiments.length)
    expect(next.experiments[0].title).toBe("Edited title")
  })

  it("does not mutate the input content", () => {
    const content = store.createDefaultContent()
    const before = JSON.stringify(content)
    store.upsertExperiment(content, sampleExperiment)

    expect(JSON.stringify(content)).toBe(before)
  })

  it("deletes an experiment by id", () => {
    const next = store.deleteExperiment(store.createDefaultContent(), "exp-1")

    expect(next.experiments.map((item) => item.id)).not.toContain("exp-1")
  })

  it("appends a project", () => {
    const next = store.upsertProject(store.createDefaultContent(), sampleProject)

    expect(next.projects.map((item) => item.id)).toContain("test-project")
  })

  it("deletes a project by id", () => {
    const next = store.deleteProject(store.createDefaultContent(), "studyos")

    expect(next.projects.map((item) => item.id)).not.toContain("studyos")
  })
})

describe("slugify", () => {
  it("turns a title into a url-safe id", () => {
    expect(store.slugify("Does Sleep Matter?")).toBe("does-sleep-matter")
  })

  it("avoids collisions with existing ids", () => {
    expect(store.slugify("Does Sleep Matter?", ["does-sleep-matter"])).toBe("does-sleep-matter-2")
  })

  it("falls back when the title has no usable characters", () => {
    expect(store.slugify("!!!")).toBe("item")
  })
})

describe("parsing", () => {
  it("rejects content with nothing in it", () => {
    expect(() => store.parseContent("{}")).toThrow()
  })

  it("normalizes partially specified records", () => {
    const content: Content = store.normalizeContent({
      experiments: [{ title: "Bare minimum" }],
      projects: [{ title: "Also bare" }],
    })

    expect(content.experiments[0].id).toBe("exp-1")
    expect(content.experiments[0].status).toBe("Exploring")
    expect(content.experiments[0].dataset.observations).toBe(0)
    expect(content.projects[0].status).toBe("Planned")
  })

  it("drops a series whose x and y lengths differ", () => {
    const experiment = store.normalizeExperiment({
      title: "Mismatched",
      series: { x: [1, 2, 3], y: [1, 2], xLabel: "a", yLabel: "b" },
    })

    expect(experiment.series).toBeUndefined()
  })

  it("parses the published content.json", () => {
    const raw = readFileSync(resolve(__dirname, "../../public/content.json"), "utf8")
    const content = store.parseContent(raw)

    expect(content.experiments.length).toBeGreaterThan(0)
    expect(content.projects.length).toBeGreaterThan(0)
    expect(content.experiments[0].series?.x).toHaveLength(10)
  })
})
