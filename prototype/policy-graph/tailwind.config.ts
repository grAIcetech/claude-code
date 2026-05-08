import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAFA",
        policy: "#0B1F3A",
        requirement: "#475569",
        milestone: "#C9A24A",
        action: "#0F766E",
        source: "#64748B",
        question: "#B42318",
        rule: "#E5E7EB"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        serif: [
          "Source Serif 4",
          "Source Serif Pro",
          "ui-serif",
          "Georgia",
          "serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
