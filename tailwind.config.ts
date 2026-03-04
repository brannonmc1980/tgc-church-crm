import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#20272a",
          light: "#2d373b",
          dark: "#171d1f",
        },
        sage: {
          DEFAULT: "#87b575",
          light: "#9fc78e",
          dark: "#6d9960",
        },
        stone: {
          50: "#fbfbfa",
          100: "#e8e4df",
          200: "#d3cfca",
          300: "#b8b3ad",
          400: "#9e9890",
          500: "#7a756e",
          600: "#5a554f",
          700: "#3d3a36",
          800: "#272421",
          900: "#1a1816",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: [
          "fragmentMono",
          "SFMono-Regular",
          "SF Mono",
          "JetBrains Mono",
          "Fira Code",
          "Cascadia Code",
          "Source Code Pro",
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
