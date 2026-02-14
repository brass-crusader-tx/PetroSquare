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
        primary: '#2dd4bf',    // teal-400
        'primary-hover': '#14b8a6', // teal-500

        // Semantic Data Colors
        'data-positive': '#34d399', // emerald-400
        'data-warning': '#fbbf24',  // amber-400
        'data-critical': '#f87171', // red-400
        'data-neutral': '#94a3b8',  // slate-400
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
