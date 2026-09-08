import React from "react"
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import "./style.css"
import App from "./App"
import { ContentProvider } from "./data/content"

const root = document.getElementById("root") as HTMLElement

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HashRouter>
      <ContentProvider>
        <App />
      </ContentProvider>
    </HashRouter>
  </React.StrictMode>
)
