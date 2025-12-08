import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "80ch"
          }
        }
      },
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          dark: "#1d4ed8"
        }
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;

