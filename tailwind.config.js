/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0a0a0f",
          card: "#12121a",
          "card-hover": "#1a1a24",
          border: "#2a2a3a",
          muted: "#6b6b80",
          text: "#e8e8f0",
          "text-dim": "#8888a0",
          accent: "#00d4aa",
          "accent-hover": "#00e5bb",
          grid: "#1e1e2a",
          light: {
            bg: "#f8f9fa",
            card: "#ffffff",
            "card-hover": "#f0f2f5",
            border: "#d0d5dd",
            muted: "#8888a0",
            text: "#1e293b",
            "text-dim": "#64748b",
            accent: "#0891b2",
            "accent-hover": "#0ea5e9",
            grid: "#e2e8f0",
          },
        },
      },
    },
  },
  plugins: [],
}
