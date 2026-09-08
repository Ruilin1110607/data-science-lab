import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { Content, Experiment, Project } from "./types"
import * as store from "./contentStore"

interface ContentContextValue {
  experiments: Experiment[]
  projects: Project[]
  hasLocalDraft: boolean
  saveExperiment: (experiment: Experiment) => void
  removeExperiment: (id: string) => void
  saveProject: (project: Project) => void
  removeProject: (id: string) => void
  replaceContent: (content: Content) => void
  resetToPublished: () => void
  exportJson: () => string
}

const ContentContext = createContext<ContentContextValue | null>(null)

function getBrowserStorage(): store.StorageLike | null {
  try {
    const probe = "__dsl_probe__"
    window.localStorage.setItem(probe, "1")
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storage = useMemo(getBrowserStorage, [])
  const [published, setPublished] = useState<Content>(() => store.createDefaultContent())
  const [draft, setDraft] = useState<Content | null>(() => (storage ? store.loadDraft(storage) : null))

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}content.json`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) setPublished(store.normalizeContent(data))
      })
      .catch(() => {
        /* keep the bundled defaults when content.json is unavailable */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const content = draft ?? published

  const commit = useCallback(
    (next: Content) => {
      setDraft(next)
      if (storage) store.saveDraft(storage, next)
    },
    [storage],
  )

  const value = useMemo<ContentContextValue>(
    () => ({
      experiments: content.experiments,
      projects: content.projects,
      hasLocalDraft: draft !== null,
      saveExperiment: (experiment) => commit(store.upsertExperiment(content, experiment)),
      removeExperiment: (id) => commit(store.deleteExperiment(content, id)),
      saveProject: (project) => commit(store.upsertProject(content, project)),
      removeProject: (id) => commit(store.deleteProject(content, id)),
      replaceContent: (next) => commit(next),
      resetToPublished: () => {
        if (storage) store.clearDraft(storage)
        setDraft(null)
      },
      exportJson: () => store.serializeContent(content),
    }),
    [content, draft, commit, storage],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent(): ContentContextValue {
  const value = useContext(ContentContext)
  if (!value) throw new Error("useContent must be used inside a ContentProvider")
  return value
}
