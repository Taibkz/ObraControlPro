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
        brand: {
          50: "#fff8eb",
          100: "#feefc7",
          200: "#fedf88",
          300: "#fcc849",
          400: "#f9ab13",
          500: "#e58e06",
          600: "#c76d03",
          700: "#9e4c05",
          800: "#803c0b",
          900: "#6a320c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
