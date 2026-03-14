import type { Config } from "tailwindcss";

// All colors Tremor uses in charts — need to be safelisted
// because Tremor generates class names dynamically at runtime
const tremorColors = [
  "emerald",
  "cyan",
  "violet",
  "amber",
  "rose",
  "blue",
  "indigo",
  "fuchsia",
  "lime",
  "orange",
  "pink",
  "teal",
  "red",
  "green",
  "yellow",
  "sky",
  "purple",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
];

const tremorShades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

const tremorSafelist = tremorColors.flatMap((color) =>
  tremorShades.flatMap((shade) => [
    `bg-${color}-${shade}`,
    `text-${color}-${shade}`,
    `fill-${color}-${shade}`,
    `stroke-${color}-${shade}`,
    `border-${color}-${shade}`,
    `dark:bg-${color}-${shade}`,
    `dark:text-${color}-${shade}`,
    `dark:fill-${color}-${shade}`,
    `dark:stroke-${color}-${shade}`,
    `dark:border-${color}-${shade}`,
  ])
);

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: tremorSafelist,
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        tremor: {
          brand: {
            faint: "#022c22",
            muted: "#064e3b",
            subtle: "#065f46",
            DEFAULT: "#22c55e",
            emphasis: "#16a34a",
            inverted: "#ffffff",
          },
          background: {
            muted: "#18181b",
            subtle: "#27272a",
            DEFAULT: "#09090b",
            emphasis: "#3f3f46",
          },
          border: {
            DEFAULT: "#3f3f46",
          },
          ring: {
            DEFAULT: "#22c55e",
          },
          content: {
            subtle: "#71717a",
            DEFAULT: "#a1a1aa",
            emphasis: "#e4e4e7",
            strong: "#fafafa",
            inverted: "#09090b",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
