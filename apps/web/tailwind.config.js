/** @type {import('tailwindcss').Config} */
const sharedConfig = require("@petrosquare/config/tailwind.config.js");

module.exports = {
  ...sharedConfig,
  content: [
    ...sharedConfig.content,
    "./app/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme?.extend,
      colors: {
        background: '#09090b', // zinc-950
        surface: '#18181b',    // zinc-900
        'surface-highlight': '#27272a', // zinc-800
        border: '#27272a',     // zinc-800
        text: '#fafafa',       // zinc-50
        muted: '#a1a1aa',      // zinc-400

        // Neutral/Sophisticated Primary (De-Tealed)
        // Replacing Teal-400 with a clean Zinc-100 or White accent for high contrast,
        // or a very desaturated blue for interactive elements.
        // Let's go with a high-contrast monochrome + subtle blue approach.
        primary: '#f4f4f5',    // zinc-100 (High contrast against dark bg)
        'primary-hover': '#ffffff', // white

        // Semantic Data Colors (Muted)
        'data-positive': '#10b981', // emerald-500 (standard, not neon)
        'data-warning': '#f59e0b',  // amber-500
        'data-critical': '#ef4444', // red-500
        'data-neutral': '#71717a',  // zinc-500
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
};
