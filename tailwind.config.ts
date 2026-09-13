import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        muted: "#6e7b88",
        line: "#dfe5ea",
        paper: "#f7f9fb",
        accent: "#195c91",
        "accent-soft": "#e8f2fa"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(20, 34, 48, 0.04), 0 8px 28px rgba(20, 34, 48, 0.04)"
      }
    }
  },
  plugins: []
};

export default config;
