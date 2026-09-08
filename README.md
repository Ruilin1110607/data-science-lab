# Data Science Lab

A personal data science lab: small questions answered with data, published in public.

Live site: https://ruilin1110607.github.io/data-science-lab/

## Stack

React 18 + TypeScript + Vite + Tailwind CSS, routed with `react-router-dom` (HashRouter).
Hosted on GitHub Pages and deployed by GitHub Actions on every push to `master`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

On Windows you can also double-click `start.bat`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check (`tsc --noEmit`) then build to `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm test` | Run the Vitest suite |
| `npm run lint` | ESLint over `src/` |

## Content

Experiments and projects live in `public/content.json`. The app fetches that file at
runtime, so editing it and committing is all it takes to publish new content.

There is also an editor at `#/manage`:

1. Add or edit experiments and projects in the browser.
2. Changes are saved as a draft in that browser's `localStorage` only — visitors do not see them.
3. Click **Export content.json** and commit the file to `public/content.json`.
4. The next deploy publishes the changes for everyone.

**Import JSON** loads a `content.json` back into the draft, and **Discard local changes**
drops the draft so the site shows the published content again.

### Data shape

```jsonc
{
  "experiments": [
    {
      "id": "exp-1",              // url slug, used by #/experiments/<id>
      "title": "...",
      "status": "Completed",
      "method": "Correlation Analysis",
      "correlation": 0.67,        // optional
      "question": "...",
      "summary": "...",
      "dataset": { "name": "...", "observations": 10, "variables": ["x", "y"] },
      "findings": ["..."],
      "series": { "x": [1, 2], "y": [3, 4], "xLabel": "x", "yLabel": "y" },  // optional
      "note": "..."
    }
  ],
  "projects": [
    { "id": "studyos", "title": "...", "description": "...", "tags": ["React"], "status": "Building" }
  ]
}
```

Unknown or missing fields are normalized on load, so a partial file will not crash the site.

## Deployment

`.github/workflows/deploy.yml` runs the tests, builds the site, and publishes `dist/` to
GitHub Pages. Repository Pages source must be set to **GitHub Actions**.

## Notes

- The experiment data currently shipped is demo data, labelled as such on each page.
- If `*.github.io` will not load in your browser, check whether a system proxy is
  intercepting it; direct connections work.
